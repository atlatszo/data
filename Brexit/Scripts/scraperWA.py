#!/usr/bin/python
# -*- coding: utf-8 -*-

"""
Python script for scraping the results from gov.wales/funding/eu-funds/previous/searchprojects/
"""


import urllib
import csv

import re
import urlparse
import mechanize
import cookielib
import time
import sys

import requests
from bs4 import BeautifulSoup

csv.register_dialect(
    'mydialect',
    delimiter = ',',
    quotechar = '"',
    doublequote = True,
    skipinitialspace = True,
    lineterminator = '\r\n',
    #quoting = csv.QUOTE_ALL)
    quoting = csv.QUOTE_NONNUMERIC)

csvfile = "your_csv_file"

counter = 80000

with open(csvfile+"_scraped.csv", 'wb') as fout:
    writer = csv.writer(fout, dialect="mydialect")
    writer.writerow(["Priority", "Organization", "Project", "Type", "Subsidy", "Matching", "Total", "Start_date", "End_date"])
    while counter < 90000:
        print counter
        url = "gov.wales/funding/eu-funds/previous/searchprojects/"+str(counter)+"?lang=en"
        r  = requests.get("http://" +url)
        data = r.text

        soup = BeautifulSoup(data)
        check_obj = soup.find('div',{'class':'page_heading_3col'})
        if check_obj:
            pr_status = soup.find('div',{'class':'status'}).find("span").next_sibling.strip().encode("utf-8").lower()
            print pr_status
            if pr_status == "approved":
                project_title = soup.find('div',{'class':'page_heading_3col'}).find("h2").text.strip().encode("utf-8")
                print project_title

                container = soup.find('div',{'class':'eoiEntries'}).find("ul").find_all('li')

                if container[0].find('span').next_sibling:
                    pr_type = container[0].find('span').next_sibling.strip().encode("utf-8")
                else:
                    pr_type = "N/A"
                if container[1].find('span').next_sibling:
                    priority = container[1].find('span').next_sibling.strip().encode("utf-8")
                else:
                    priority = "N/A"
                if container[4].find('span').next_sibling:
                    organization = container[4].find('span').next_sibling.strip().encode("utf-8")
                else:
                    organization = "N/A"
                if container[8].find('span').next_sibling:
                    start_date = container[8].find('span').next_sibling.strip().encode("utf-8")
                else:
                    start_date = "N/A"
                if container[9].find('span').next_sibling:
                    end_date = container[9].find('span').next_sibling.strip().encode("utf-8")
                else:
                    end_date = "N/A"
                if container[10].find('span').next_sibling:
                    subsidy = container[10].find('span').next_sibling.strip().encode("utf-8")
                else:
                    subsidy = "£ 0"
                if container[11].find('span').next_sibling:
                    national = container[11].find('span').next_sibling.strip().encode("utf-8")
                else:
                    national = "£ 0"
                if container[12].find('span').next_sibling:
                    matching = container[12].find('span').next_sibling.strip().encode("utf-8")
                else:
                    matching = "N/A"
                writer.writerow([priority, organization, project_title, pr_type, subsidy, matching, national, start_date, end_date])
            else:
                pass
        else:
            pass
        counter += 1