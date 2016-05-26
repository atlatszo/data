#!/usr/bin/env python
# -*- coding: utf-8 -*-

from application import app
from flask import render_template, request, redirect, url_for, Response, jsonify

import os
import os.path

import json
import sys

from whoosh.index import open_dir
from whoosh import qparser
from whoosh.writing import AsyncWriter

reload(sys)
sys.setdefaultencoding("utf-8")

from models import *

#----------MySQL CONNECTION CHECK START-----------------------------------------

import MySQLdb
from sqlalchemy import exc, event
from sqlalchemy.pool import Pool

@event.listens_for(Pool, "checkout")
def ping_connection(dbapi_connection, connection_record, connection_proxy):
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("SELECT 1")
    except:
        # optional - dispose the whole pool
        # instead of invalidating one at a time
        # connection_proxy._pool.dispose()

        # raise DisconnectionError - pool will try
        # connecting again up to three times before raising.
        raise exc.DisconnectionError()
    cursor.close()

#----------MySQL CONNECTION CHECK END-------------------------------------------

basedir = os.path.abspath(os.path.dirname(__file__))

@app.route('/', methods=['GET', 'POST'])
def atlatszo():
    return render_template('index.html')

@app.route('/categoryfind2', methods=['GET', 'POST'])
def categoryfind2():
    if request.method == "POST":
        city = request.json
        result1 = Cities.query.filter_by(city = json.dumps(city)).first()
        json_file='static/resources/KSH_aggregated.json'
        json_data=open(json_file).read().decode('utf-8')
        data = json.loads(json_data)
        return jsonify(results = json.loads(result1.piedata),
                       population = json.loads(result1.population),
                       population_country = data['Hungary'][0],
                       population_county = data[json.loads(result1.county)][0],
                       tourism = json.loads(result1.tourism),
                       tourism_country = data['Hungary'][1],
                       tourism_county = data[json.loads(result1.county)][1],
                       culture = json.loads(result1.culture),
                       culture_country = data['Hungary'][2],
                       culture_county = data[json.loads(result1.county)][2],
                       unemployment = json.loads(result1.unemployment),
                       unemployment_country = data['Hungary'][3],
                       unemployment_county = data[json.loads(result1.county)][3],
                       enviroment = json.loads(result1.enviroment),
                       enviroment_country = data['Hungary'][4],
                       enviroment_county = data[json.loads(result1.county)][4],
                       health = json.loads(result1.health),
                       health_country = data['Hungary'][5],
                       health_county = data[json.loads(result1.county)][5],
                       road = json.loads(result1.road),
                       road_country = data['Hungary'][6],
                       road_county = data[json.loads(result1.county)][6],
                       agriculture = json.loads(result1.agriculture),
                       agriculture_country = data['Hungary'][7],
                       agriculture_county = data[json.loads(result1.county)][7],
                       company = json.loads(result1.company),
                       company_country = data['Hungary'][8],
                       company_county = data[json.loads(result1.county)][8],
                       government = json.loads(result1.government),
                       government_country = data['Hungary'][9],
                       government_county = data[json.loads(result1.county)][9],
                       water = json.loads(result1.water),
                       water_country = data['Hungary'][10],
                       water_county = data[json.loads(result1.county)][10],
                       gas = json.loads(result1.gas),
                       gas_country = data['Hungary'][11],
                       gas_county = data[json.loads(result1.county)][11],
                       education = json.loads(result1.education),
                       education_country = data['Hungary'][12],
                       education_county = data[json.loads(result1.county)][12],
                       aid = json.loads(result1.aid),
                       aid_country = data['Hungary'][13],
                       aid_county = data[json.loads(result1.county)][13],
                       timeSeries = json.loads(result1.timeSeries),
                       area = result1.city_area,
                       ranking_country = json.loads(result1.ranking_country),
                       deviation = json.loads(result1.deviation),
                       deviation_sum = json.loads(result1.deviation_sum),
                       county = json.loads(result1.county))

@app.route('/searchcity', methods=['GET'])
def searchcity():
    query0 = request.args.get('term').strip()
    query = query0[:1].upper() + query0[1:].lower()
    if len(query) >= 2:
        ix = open_dir('cities_index')
        qp = qparser.MultifieldParser(["city_name", "city_name_n"], schema=ix.schema)
        qp.add_plugin(qparser.FuzzyTermPlugin())
        q = qp.parse(query+"~0")
        with ix.searcher() as s:
            results = s.search(q, limit=50)
            results2 = []
            results3 = []
            results4 = []
            for result in results:
                if result['city_name'].startswith(query):
                    results2.append({"song_title": result['city_name']})
                elif query in result['city_name']:
                    results3.append({"song_title": result['city_name']})
                else:
                    results4.append({"song_title": result['city_name']})
            results5 = results2 + results3 + results4
            return json.dumps(results5)
    else:
        return json.dumps("")

@app.route('/embedtest', methods=['GET'])
def embedtest():
    return render_template('embedtest.html')