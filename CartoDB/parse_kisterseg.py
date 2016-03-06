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
regions = {}
regions_final = {}

for i in data["features"]:
	city = i["properties"]["TEL_NEV"].encode('utf8', 'replace')
	cities[city] = 0
	regions[city] = i["properties"]["KIST_NEV"].encode('utf8', 'replace')
	regions_final[regions[city]] = 0


with open('EU_2007_2013_tamogatas.csv', 'rb') as f:
	reader = csv.reader(f)
	reader.next()
	for row in reader:
		city = row[1]
		if row[3] != u"NA" and city in cities:
			donate = float(row[3])
			cities[city] += donate
			regions_final[regions[city]] += donate


json_file2='kisterseg_2013.json'

json_data2=open(json_file2).read().decode('utf-8')
data2 = json.loads(json_data2)


for i in data2["features"]:
	region = i["properties"]["KIST_NEV"].encode('utf8', 'replace')
	i["properties"]["DONATION"] = regions_final[region]

with io.open('output_kisterseg.json', 'w', encoding='utf-8') as f:
	f.write(unicode(json.dumps(data2, ensure_ascii=False)))


'''writer = csv.writer(open('data_final.csv', 'wb'))
for key, value in cities.items():
	writer.writerow([key, value])'''