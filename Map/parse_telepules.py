#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv
import json
import sys
import io

json_file='telepules_2013.json'

json_data=open(json_file).read().decode('utf-8')
data = json.loads(json_data)

cities = {}

for i in data["features"]:
	city = i["properties"]["TEL_NEV"].encode('utf8', 'replace')
	cities[city] = 0

with open('EU_2007_2013_tamogatas.csv', 'rb') as f:
	reader = csv.reader(f)
	reader.next()
	for row in reader:
		city = row[1]
		if row[3] != u"NA" and city in cities:
			donate = float(row[3])
			cities[city] += donate

for i in data["features"]:
	city = i["properties"]["TEL_NEV"].encode('utf8', 'replace')
	if city in cities:
		i["properties"]["DONATION"] = cities[city]

with io.open('output.json', 'w', encoding='utf-8') as f:
	f.write(unicode(json.dumps(data, ensure_ascii=False)))