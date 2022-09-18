#!/usr/bin/env python3
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/hello")
def hello_world():
    return "<h2>Hello, World!</h2>"

@app.route("/", methods=['POST'])
def process_order():
    content = request.json
    app.logger.info(content)
    return jsonify({})

def create_app():
    return app
