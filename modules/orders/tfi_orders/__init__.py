#!/usr/bin/env python3
from flask import Flask, request, jsonify
import logging

app = Flask(__name__)

@app.route("/hello")
def hello_world():
    return "<h2>Hello, World!</h2>"

@app.route("/", methods=['POST'])
def process_order():
    content = request.json
    app.logger.debug(content)
    return jsonify({})

gunicorn_logger = logging.getLogger('gunicorn.error')
app.logger.handlers = gunicorn_logger.handlers
app.logger.setLevel(gunicorn_logger.level)

def create_app():
    return app
