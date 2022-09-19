#!/usr/bin/env python3
from flask import Flask, request, jsonify
import logging
import os
import requests
import sys
from eth_abi import encode_abi
import eth_utils
import cbor2
from tfi_orders.fees import get_fee

app = Flask(__name__)
api_adapter = os.getenv('TRUFLATION_API_HOST', 'http://api-adapter:8081')
func_sig = eth_utils.function_signature_to_4byte_selector(
    'fulfillOracleRequest2(bytes32,uint256,address,bytes4,uint256,bytes)'
)

def encode_function(signature, parameters):
    [ function, params_list ] = signature.split("(")
    param_types = params_list.replace(")", "").replace(" ", "").split(",")
    func_sig = eth_utils.function_signature_to_4byte_selector(
        signature
    )
    encode_tx = encode_abi(param_types, parameters)
    return "0x" + func_sig.hex() + encode_tx.hex()
    
def fromHex(x):
    return bytes.fromhex(x[2:])

@app.route("/hello")
def hello_world():
    return "<h2>Hello, World!</h2>"

@app.route("/api1", methods=['POST'])
def api1():
    content = request.json
    app.logger.debug(content)
    oracleRequest = content['meta']['oracleRequest']
    logData = oracleRequest['data']
    requestId = oracleRequest['requestId']
    payment = int(oracleRequest['payment'])
    b = bytes.fromhex("bf" + logData[2:] + "ff")
    o = cbor2.decoder.loads(b)
    app.logger.debug(o)
    encode_tx = None
    encode_large = None
    fee = get_fee(o)
    # should reject request but some networks require polling
    if payment < fee:
        """
        encode_tx = encode_function(
            'rejectOracleRequest(bytes32,uint256,address,bytes4,uint256,address)', [
                fromHex(requestId),
                int(oracleRequest['payment']),
                fromHex(oracleRequest['callbackAddr']),
                fromHex(oracleRequest['callbackFunctionId']),
                int(oracleRequest['cancelExpiration']),
                fromHex(oracleRequest['callbackAddr'])
            ])
        """
        encode_large = encode_abi(
            ['bytes32', 'bytes'],
            [fromHex(requestId),
             b'{"error": "fee too small"}']
        )
        encode_tx = encode_function(
            'fulfillOracleRequest2AndRefund(bytes32,uint256,address,bytes4,uint256,bytes,uint256)', [
                fromHex(requestId),
                int(oracleRequest['payment']),
                fromHex(oracleRequest['callbackAddr']),
                fromHex(oracleRequest['callbackFunctionId']),
                int(oracleRequest['cancelExpiration']),
                encode_large,
                payment
            ])
    else:
        r = requests.post(api_adapter, json=o)
        encode_large = encode_abi(
            ['bytes32', 'bytes'],
            [fromHex(requestId),
             r.content]
        )
        encode_tx = encode_function(
            'fulfillOracleRequest2AndRefund(bytes32,uint256,address,bytes4,uint256,bytes,uint256)', [
                fromHex(requestId),
                int(oracleRequest['payment']),
                fromHex(oracleRequest['callbackAddr']),
                fromHex(oracleRequest['callbackFunctionId']),
                int(oracleRequest['cancelExpiration']),
                encode_large,
                payment - fee
            ])
    process_refund = encode_function(
        'processRefund(bytes32,address)',
        [
            fromHex(requestId),
            fromHex(oracleRequest['callbackAddr'])
        ])
    return jsonify({
        "tx0": encode_tx,
        "tx1": process_refund
    })


@app.route("/api0", methods=['POST'])
def api0():
    content = request.json
    app.logger.debug(content)
    oracleRequest = content['meta']['oracleRequest']
    logData = oracleRequest['data']
    requestId = oracleRequest['requestId']
    b = bytes.fromhex("bf" + logData[2:] + "ff")
    o = cbor2.decoder.loads(b)
    app.logger.debug(o)
    r = requests.post(api_adapter, json=o)
    encode_large = encode_abi(
        ['bytes32', 'bytes'],
        [fromHex(requestId),
         r.content]
    )
    encode_tx = encode_function(
        'fulfillOracleRequest2(bytes32,uint256,address,bytes4,uint256,bytes)', [
            fromHex(requestId),
            int(oracleRequest['payment']),
            fromHex(oracleRequest['callbackAddr']),
            fromHex(oracleRequest['callbackFunctionId']),
            int(oracleRequest['cancelExpiration']),
            encode_large
        ])
    app.logger.debug(encode_tx)
    return encode_tx

@app.route("/api-adapter", methods=['POST'])
def process_api_adapter():
    content = request.json
    r = requests.post(api_adapter, json=content)
    return r.content

if os.getenv('TFI_ORDERS_LOCAL_LOGLEVEL') is None:
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
else:
    app.logger.setLevel(os.getenv('TFI_ORDERS_LOCAL_LOGLEVEL'))

app.logger.info(f'Connecting to adapter at {api_adapter}')

def create_app():
    return app
