#!/usr/bin/python
# -*- coding: utf-8 -*-
import ogr
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
    #quoting = csv.QUOTE_ALL)
    quoting = csv.QUOTE_NONNUMERIC)

csvfile = 'Subsidy_data/UK_subsidies_final'

# load the shape file as a layer
drv = ogr.GetDriverByName('ESRI Shapefile')
ds_in = drv.Open("Resources/Shapefiles/GeoJSON/uk.shp")
lyr_in = ds_in.GetLayer(0)

# field index for which i want the data extracted 
# ("satreg2" was what i was looking for)
LAU_code = lyr_in.GetLayerDefn().GetFieldIndex("CODE")
LAU_name = lyr_in.GetLayerDefn().GetFieldIndex("NAME")

def check(lon, lat):
    # create point geometry
    pt = ogr.Geometry(ogr.wkbPoint)
    pt.SetPoint_2D(0, lon, lat)
    lyr_in.SetSpatialFilter(pt)

    # go over all the polygons in the layer see if one include the point
    for feat_in in lyr_in:

        # roughly subsets features, instead of go over everything
        ply = feat_in.GetGeometryRef()

        # test
        if ply.Contains(pt):

            # TODO do what you need to do here
            return [feat_in.GetFieldAsString(LAU_code), feat_in.GetFieldAsString(LAU_name)]
        else:
            return ["N/A","N/A"]


processor = 0
with open(csvfile+".csv", 'rb') as fin, open(csvfile+"_LAU1.csv", 'wb') as fout:
    reader = csv.reader(fin, delimiter=",", lineterminator='\n')
    #writer = csv.writer(fout, delimiter=",", quotechar='"', lineterminator='\n')
    #writer = csv.writer(fout, delimiter=",", lineterminator='\n')
    writer = csv.writer(fout, dialect="mydialect")
    writer.writerow(next(reader) + ["LAU1_CODE", "LAU1_NAME"])
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
            lat_trans = row[15]
            lon_trans = row[16]
        if lat_trans != "N/A" and lon_trans != "N/A":
            lat_trans = float(row[15])
            lon_trans = float(row[16])
            query_res = check(lon_trans, lat_trans)
            if query_res and len(query_res) > 0:
                res_code = query_res[0]
                res_name = query_res[1]
            else:
                res_code = "N/A"
                res_name = "N/A"
            new_row.append(res_code)
            new_row.append(res_name)
        else:
            new_row.append("N/A")
            new_row.append("N/A")
        writer.writerow(new_row)
        print new_row
        processor += 1
        print processor