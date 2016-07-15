#!/usr/bin/python
# -*- coding: utf-8 -*-

import csv
import json
import requests
import csv, codecs
import sys
import time

csv.register_dialect(
    'mydialect',
    delimiter = ',',
    quotechar = '"',
    doublequote = True,
    skipinitialspace = True,
    lineterminator = '\r\n',
    quoting = csv.QUOTE_ALL)

csvfile = 'your_file_name_goes_here.csv'

with open(csvfile, 'rb') as fin, open('clean_'+csvfile, 'wb') as fout:
	reader = csv.reader(fin, delimiter=",", lineterminator='\n')
	writer = csv.writer(fout, dialect="mydialect")
	for row in reader:
		new_row = []
		for cell in row:
			cell1 = str(cell)
			cell2 = cell1.replace('"', '')
			cell3 = cell2.strip()
			new_row.append(str(cell3))
		writer.writerow(new_row)

