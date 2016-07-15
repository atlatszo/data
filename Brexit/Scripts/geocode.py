#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv
import json
import requests
import csv, codecs
import sys
import time

API_KEY = "your_API_key_goes_here"
csvfile = 'your_csv_file_goes_here.csv'

with open(csvfile, 'rb') as fin, open('geocoded_'+csvfile, 'wb') as fout:
	reader = csv.reader(fin, delimiter=",", lineterminator='\n')
	writer = csv.writer(fout, lineterminator='\n')
	writer.writerow(next(reader) + ["county", "city_name", "postal_code", "lat_coords", "long_coords"])
	for row in reader:
		geocoding_state = row[11]
		if geocoding_state == "None":
			region = row[10]
			county = "N/A"
			city_name = "N/A"
			postal_code = "N/A"
			lat_coords = "N/A"
			long_coords = "N/A"
			organization = row[1]
			last = organization[-6:]
			if last.isdigit():
				organization = row[1][:-7]
			PLACES_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query="+organization+" United Kingdom&key="+API_KEY
			r = requests.get(PLACES_URL)
			result_zero = json.loads(r.content)
			if len(result_zero["results"]) > 0:
				address =  result_zero["results"][0]["formatted_address"]
				GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&key='+API_KEY
				r2 = requests.get(GEOCODE_URL)
				result_one = json.loads(r2.content)
				print result_one
				if len(result_one["results"]) > 0:
					lat_coords = result_one['results'][0]['geometry']['location']['lat']
					long_coords = result_one['results'][0]['geometry']['location']['lng']
					for i in result_one["results"][0]["address_components"]:
						if i["types"][0] == u"postal_town":
							city_name = i["long_name"]
						if i["types"][0] == u"postal_code":
							postal_code = i["long_name"]
						if i["types"][0] == u"administrative_area_level_2":
							county = i["long_name"]
			writer.writerow(row[:11] + ["First", county, city_name, postal_code, lat_coords, long_coords])
			print county
			print city_name
			print postal_code
			print lat_coords
			print long_coords
		else:
			writer.writerow(row)