#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv
import json
import requests
import csv, codecs
import sys
import time

# Define custom dialect of input sourcefile.
csv.register_dialect(
    'mydialect',
    delimiter = ',',
    quotechar = '"',
    doublequote = True,
    skipinitialspace = True,
    lineterminator = '\r\n',
    quoting = csv.QUOTE_ALL)

csvfile = 'Subsidy_data/UK_subsidies_final.csv'

# Open translate table between LAU1, LAU2 and NUTS regions
translate_file = 'Resources/translate_LAU_nuts.csv'
translate_dict = {}
translate_list0 = []
with open(translate_file, 'rb') as transin:
	translate_raw = csv.reader(transin, delimiter=",", lineterminator='\n')
	translate_raw.next()
	for row in translate_raw:
		translate_dict[row[1]] = row[3]
		translate_list0.append(row[3])

translate_list1 = set(translate_list0)

translate_list = list(translate_list1)

subsidy = 0
matching = 0
counter = 0
Wales = 0
England = 0
Scotland = 0
Norther_Ireland = 0

counties = []
cities = []

with open(csvfile, 'rb') as fin:
	reader = csv.reader(fin, delimiter=",", lineterminator='\n')
	reader.next()
	for row in reader:
		counties.append(row[12])
		cities.append(row[13])
		counter +=1
		subsidy += float(row[4])
		if row[5] != "N/A":
			matching += float(row[5])
			matching_nr = float(row[5])
		else:
			matching_nr = 0
		if row[9] == "England":
			England += float(row[4])
			England += matching_nr
		elif row[9] == "Scotland":
			Scotland += float(row[4])
			Scotland += matching_nr
		elif row[9] == "Wales":
			Wales += float(row[4])
			Wales += matching_nr
		elif row[9] == "Northern Ireland":
			Norther_Ireland += float(row[4])
			Norther_Ireland += matching_nr
		if row[13] not in translate_list:
			print "----------------------"
			print row[13]
			print "----------------------"

unique_counties = set(counties)
unique_counties_list = list(unique_counties)

unique_cities = set(cities)
unique_cities_list = list(unique_cities)


print "Nr. of counties: ", len(unique_counties_list)
print "Nr. of cities: ", len(unique_cities_list)
print "#####################################"
summa = subsidy + matching
print "Subsidy: ", subsidy
print "Matching: ", matching
print "Summa: ", summa
print "#####################################"
print "England: ", England / 53012456
print "Wales: ", Wales /  3063456
print "Scotland: ", Scotland / 5295000
print "Northern Ireland: ", Norther_Ireland / 1810863