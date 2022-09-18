#!/usr/bin/env python3
from flask import Flask

app = Flask(__name__)

@app.route("/hello")
def hello_world():
    return "<h2>Hello, World!</h2>"

def create_app():
    return app
