#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import re
from flask import request
from werkzeug.serving import WSGIRequestHandler
#from flask.ext.compress import Compress

app = Flask(__name__, static_folder='static', static_url_path='')
#Compress(app)
app.config.from_object('config')
app.secret_key = 'Surfinusa'

WSGIRequestHandler.protocol_version = "HTTP/1.1"

db = SQLAlchemy(app)

from views import *

if __name__ == "__main__":
#  app.run(debug=True)
  app.run()