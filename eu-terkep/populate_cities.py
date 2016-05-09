#!/usr/bin/env python
# -*- coding: utf-8 -*-

from application import db
import models
import json
from whoosh.index import create_in
from whoosh.fields import *
import os

schema = Schema(city_name=TEXT(stored=True), city_name_n=NGRAMWORDS(minsize=1, maxsize=10))

if not os.path.exists("cities_index"):
    os.mkdir("cities_index")

ix = create_in("cities_index", schema)

writer = ix.writer()

#db.create_all(bind=['city'])
db.create_all()

json_file='static/resources/categories.json'
json_data=open(json_file).read().decode('utf-8')
data = json.loads(json_data)

for city in data:
    answer = data[city][0]
    answer_final = []
    for i in answer:
        answer_final.append({"label": i, "value": answer[i]})


    year_pop = 2007
    population = data[city][1]
    population_final = []
    for i in population:
        population_final.append({"date": str(year_pop), "value": i})
        year_pop += 1

    #year_tour = 1990
    year_tour = 2007
    tourism = data[city][2]
    tourism_final = []
    for i in tourism:
        tourism_final.append({"date": str(year_tour), "value": i})
        year_tour += 1

    #year_cult = 2006
    year_cult = 2007
    culture = data[city][3]
    culture_final = []
    for i in culture:
        culture_final.append({"date": str(year_cult), "value": i})
        year_cult += 1

    #year_unemp = 1995
    year_unemp = 2007
    unemployment = data[city][4]
    unemployment_final = []
    for i in unemployment:
        unemployment_final.append({"date": str(year_unemp), "value": i})
        year_unemp += 1

    #year_envi = 2008
    year_envi = 2007
    enviroment = data[city][5]
    enviroment_final = []
    for i in enviroment:
        enviroment_final.append({"date": str(year_envi), "value": i})
        year_envi += 1

    #year_health = 1990
    year_health = 2007
    health = data[city][6]
    health_final = []
    for i in health:
        health_final.append({"date": str(year_health), "value": i})
        year_health += 1

    #year_road = 2005
    year_road = 2007
    road = data[city][7]
    road_final = []
    for i in road:
        road_final.append({"date": str(year_road), "value": i})
        year_road += 1

    year_agri = 2009
    agriculture = data[city][8]
    agriculture_final = []
    for i in agriculture:
        agriculture_final.append({"date": str(year_agri), "value": i})
        year_agri += 1

    #year_comp = 2005
    year_comp = 2007
    company = data[city][9]
    company_final = []
    for i in company:
        company_final.append({"date": str(year_comp), "value": i})
        year_comp += 1

    #year_gov = 2001
    year_gov = 2007
    government = data[city][10]
    government_final = []
    for i in government:
        government_final.append({"date": str(year_gov), "value": i})
        year_gov += 1

    #year_wat = 1990
    year_wat = 2007
    water = data[city][11]
    water_final = []
    for i in water:
        water_final.append({"date": str(year_wat), "value": i})
        year_wat += 1

    #year_gas = 1990
    year_gas = 2007
    gas = data[city][12]
    gas_final = []
    for i in gas:
        gas_final.append({"date": str(year_gas), "value": i})
        year_gas += 1

    #year_edu = 2001
    year_edu = 2007
    education = data[city][13]
    education_final = []
    for i in education:
        education_final.append({"date": str(year_edu), "value": i})
        year_edu += 1

    #year_aid = 1999
    year_aid = 2007
    aid = data[city][14]
    aid_final = []
    for i in aid:
        aid_final.append({"date": str(year_aid), "value": i})
        year_aid += 1

    timeSeries = data[city][15]
    city_area = data[city][16]
    ranking_country = data[city][17]
    deviation = data[city][18]
    deviation_sum = data[city][19]
    county = data[city][-1]


    u1 = models.Cities(city = json.dumps(city),
                                piedata = json.dumps(answer_final),
                                population = json.dumps(population_final),
                                tourism = json.dumps(tourism_final),
                                culture = json.dumps(culture_final),
                                unemployment = json.dumps(unemployment_final),
                                enviroment = json.dumps(enviroment_final),
                                health = json.dumps(health_final),
                                road = json.dumps(road_final),
                                agriculture = json.dumps(agriculture_final),
                                company = json.dumps(company_final),
                                government = json.dumps(government_final),
                                water = json.dumps(water_final),
                                gas = json.dumps(gas_final),
                                education = json.dumps(education_final),
                                aid = json.dumps(aid_final),
                                timeSeries = json.dumps(timeSeries),
                                city_area = city_area,
                                ranking_country = json.dumps(ranking_country),
                                deviation = json.dumps(deviation),
                                deviation_sum = json.dumps(deviation_sum),
                                county = county.encode('utf8', 'replace'))
    writer.add_document(city_name=city, city_name_n=city)

    db.session.add(u1)

db.session.commit()
writer.commit()