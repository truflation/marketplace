#!/usr/bin/env python3
from flask import Flask, request, jsonify
import logging
import os
import requests
import sys
from eth_abi import encode_abi
import eth_utils
import cbor2

app = Flask(__name__)
api_adapter = os.getenv('TRUFLATION_API_HOST', 'http://api-adapter:8081')
func_sig = eth_utils.function_signature_to_4byte_selector(
    'fulfillOracleRequest2(bytes32,uint256,address,bytes4,uint256,bytes)'
)

def fromHex(x):
    return bytes.fromhex(x[2:])

@app.route("/hello")
def hello_world():
    return "<h2>Hello, World!</h2>"

@app.route("/", methods=['POST'])
def process_order():
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
    encode_tx = encode_abi(
        ['bytes32',
         'uint256',
         'address',
         'bytes4',
         'uint256',
         'bytes'],
        [
            fromHex(requestId),
            int(oracleRequest['payment']),
            fromHex(oracleRequest['callbackAddr']),
            fromHex(oracleRequest['callbackFunctionId']),
            int(oracleRequest['cancelExpiration']),
            encode_large
        ]
    )
    res = "0x" + func_sig.hex() + encode_tx.hex()
    app.logger.debug(res)
    return res

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
