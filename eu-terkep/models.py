#!/usr/bin/env python
# -*- coding: utf-8 -*-

from application import db

class Cities(db.Model):
    #__bind_key__ = 'city'
    __tablename__ = 'cities'
    uid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    city = db.Column(db.String(80), index=True)
    piedata = db.Column(db.Text())
    population = db.Column(db.Text())
    tourism = db.Column(db.Text())
    culture = db.Column(db.Text())
    unemployment = db.Column(db.Text())
    enviroment = db.Column(db.Text())
    health = db.Column(db.Text())
    road = db.Column(db.Text())
    agriculture = db.Column(db.Text())
    company = db.Column(db.Text())
    government = db.Column(db.Text())
    water = db.Column(db.Text())
    gas = db.Column(db.Text())
    education = db.Column(db.Text())
    aid = db.Column(db.Text())
    timeSeries = db.Column(db.Text())
    city_area = db.Column(db.String(10))
    ranking_country = db.Column(db.Text())
    deviation = db.Column(db.Text())
    deviation_sum = db.Column(db.Text())
    county = db.Column(db.String(80))

    def __repr__(self):
        return '<Cities %r>' % (self.uid)