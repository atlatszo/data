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
counties = {}
counties_final = {}

for i in data["features"]:
	city = i["properties"]["TEL_NEV"].encode('utf8', 'replace')
	cities[city] = 0
	counties[city] = i["properties"]["MEGY_NEV"].encode('utf8', 'replace')
	counties_final[counties[city]] = 0


with open('EU_2007_2013_tamogatas.csv', 'rb') as f:
	reader = csv.reader(f)
	reader.next()
	for row in reader:
		city = row[1]
		if row[3] != u"NA" and city in cities:
			donate = float(row[3])
			cities[city] += donate
			counties_final[counties[city]] += donate


json_file2='megye_2013.json'

json_data2=open(json_file2).read().decode('utf-8')
data2 = json.loads(json_data2)


for i in data2["features"]:
	county = i["properties"]["MEGY_NEV"].encode('utf8', 'replace')
	i["properties"]["DONATION"] = counties_final[county]

with io.open('output_megye.json', 'w', encoding='utf-8') as f:
	f.write(unicode(json.dumps(data2, ensure_ascii=False)))