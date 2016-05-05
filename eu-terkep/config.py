#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

#basedir = os.path.abspath(os.path.dirname(__file__))

username = str()
password = str()
database = str()

SQLALCHEMY_DATABASE_URI = "mysql://"+username+":"+password+"@"+database+"?charset=utf8"
SQLALCHEMY_POOL_RECYCLE = 499
SQLALCHEMY_POOL_TIMEOUT = 20
SQLALCHEMY_RECORD_QUERIES = True
SQLALCHEMY_ECHO = True
SQLALCHEMY_TRACK_MODIFICATIONS = True