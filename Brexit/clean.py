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
    #quoting = csv.QUOTE_ALL
    quoting = csv.QUOTE_NONNUMERIC)

csvfile = 'Subsidy_data/UK_subsidies'

with open(csvfile+".csv", 'rb') as fin, open(csvfile+"_final.csv", 'wb') as fout:
	reader = csv.reader(fin, delimiter=",", lineterminator='\n')
	#writer = csv.writer(fout, delimiter=",", quotechar='"', lineterminator='\n')
	#writer = csv.writer(fout, delimiter=",", lineterminator='\n')
	writer = csv.writer(fout, dialect="mydialect")
	#writer.writerow(next(reader) + ["Start_date", "End_date"])
	for row in reader:
		new_row = []
		cell_counter = 0
		for cell in row:
			if cell_counter != 4 and cell_counter != 5 and cell_counter != 6:
				cell1 = str(cell)
				cell2 = cell1.replace('"', '')
				cell3 = cell2.strip()
				new_row.append(str(cell3))
			else:
				cell1 = str(cell)
				cell2 = cell1.replace('"', '')
				cell3 = cell2.strip()
				cell4 = cell3.split(".")
				if cell4[0] == "Subsidy" or cell4[0] == "Matching" or cell4[0] == "Total":
					new_row.append(str(cell4[0]))
				elif cell4[0] != "N/A":
					new_row.append(int(cell4[0]))
				else:
					new_row.append(0)
			cell_counter += 1 
		#years_list = row[6].split('-')
		#start_year = years_list[0]
		#end_year = years_list[1]
		writer.writerow(new_row)

