#!/usr/bin/env python3
from flask import Flask, request, jsonify
import logging
import os
import requests
import sys
import eth_abi
import cbor2

app = Flask(__name__)
api_adapter = os.getenv('TRUFLATION_API_HOST', 'http://api-adapter:8081')

@app.route("/hello")
def hello_world():
    return "<h2>Hello, World!</h2>"

@app.route("/", methods=['POST'])
def process_order():
    content = request.json
    app.logger.debug(content)
    logData = content['meta']['oracleRequest']['data']
    b = bytes.fromhex("bf" + logData[2:] + "ff")
    o = cbor2.decoder.loads(b)
    app.logger.debug(o)
    r = requests.post(api_adapter, json=o)
    return jsonify(r.json())

@app.route("/api-adapter", methods=['POST'])
def process_api_adapter():
    content = request.json
    r = requests.post(api_adapter, json=content)
    return jsonify(r.json())

if os.getenv('TFI_ORDERS_LOCAL_LOGLEVEL') is None:
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
else:
    app.logger.setLevel(os.getenv('TFI_ORDERS_LOCAL_LOGLEVEL'))

app.logger.info(f'Connecting to adapter at {api_adapter}')

def create_app():
    return app
