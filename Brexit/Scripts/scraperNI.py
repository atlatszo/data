#!/usr/bin/env python

#A SCRAPER CUSTOMIZING TODD HAYTON'S AWESOME SCRAPING SCRIPT AVAILABLE @ https://github.com/thayton/architectfinder

"""
Python script for scraping the results from http://successes.eugrants.org/default.aspx
"""

import urllib
import csv

import re
import urlparse
import mechanize
import cookielib
import time

from bs4 import BeautifulSoup

csv.register_dialect(
    'mydialect',
    delimiter = ',',
    quotechar = '"',
    doublequote = True,
    skipinitialspace = True,
    lineterminator = '\r\n',
    quoting = csv.QUOTE_ALL)

csvfile = "your_csv_file.csv"

class Northern_Ireland_Scraper(object):
    def __init__(self):
        self.url = "http://successes.eugrants.org/default.aspx"
        self.br = mechanize.Browser()
        self.br.addheaders = [('User-agent', 
                               'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.63 Safari/535.7')]

    def get_state_items(self):
        self.br.open(self.url)
        self.br.select_form('aspnetForm')
        items = self.br.form.find_control('ctl00$ContentPlaceHolder1$ddlPrograme').get_items()
        return items

    def scrape_beneficiaries(self, state_item):
        
        self.br.open(self.url)
        s = BeautifulSoup(self.br.response().read())
        saved_form = s.find('form', id='aspnetForm').prettify()
        self.br.select_form('aspnetForm')

        #ERDF: ctl00$ContentPlaceHolder1$ddlPrograme == 1
        #ERDF: ctl00$ContentPlaceHolder1$ddlPrograme == 2
        self.br.form['ctl00$ContentPlaceHolder1$ddlPrograme'] = [ "1" ]
        self.br.form['ctl00$ContentPlaceHolder1$ddlYearApproved'] = [ "-1" ]
        self.br.form['ctl00$ContentPlaceHolder1$ddlTotalGrantApproved'] = [ "any" ]
        self.br.form['ctl00$ContentPlaceHolder1$ddlyearCompleted'] = [ "-1" ]
        self.br.form['ctl00$ContentPlaceHolder1$ddlTotalamountPaid'] = [ "any" ]

        self.br.form.new_control('hidden', 'ctl00$ContentPlaceHolder1$ibtnAdvanceSearch.x', {'value': '58'})
        self.br.form.new_control('hidden', 'ctl00$ContentPlaceHolder1$ibtnAdvanceSearch.y', {'value': '14'})

        self.br.form['ctl00$ContentPlaceHolder1$ddlcountry'] = [ "-1" ]
        
        viewstate = s.select("#__VIEWSTATE")[0]['value']
        eventvalidation = s.select("#__EVENTVALIDATION")[0]['value']

        self.br.form.set_all_readonly(False)
        self.br.form['__EVENTVALIDATION'] = eventvalidation
        self.br.form['__VIEWSTATE'] = viewstate
        self.br.form['__EVENTARGUMENT'] = 'ctl00$ContentPlaceHolder1$ddlPrograme'
        self.br.form['__VIEWSTATEGENERATOR'] = 'CA0B0334'
 
        self.br.form.fixup()

        self.br.submit()

        pageno = 2

        with open('final_'+csvfile, 'wb') as fout:
            writer = csv.writer(fout, dialect="mydialect")
            writer.writerow(['Organization', 'Project', 'Year_start', 'Total_ammount', 'Year_end', 'Paid_ammount', 'Project_postcode', 'Priority', 'Total_cost', 'Description'])

            while True:
                resp = BeautifulSoup(self.br.response().read())

                with open("Output"+str(pageno-1)+".txt", "w") as text_file:
                    text_file.write(self.br.response().read())
            
                indexNR = 2
                elemNR = 0
                while indexNR != 17:
                    if indexNR < 10:
                        counter = '0'+str(indexNR)
                    else:
                        counter = str(indexNR)

                    orgName = resp.find('div',{'id':'ctl00_ContentPlaceHolder1_gvSearchResult_ctl'+counter+'_pnlOrgName'})
                    projectTitle = resp.find('div',{'id':'ctl00_ContentPlaceHolder1_gvSearchResult_ctl'+counter+'_pnlProjectTitle'})
                    yearStart = projectTitle.parent.next_sibling
                    totalAmmount = yearStart.next_sibling
                    yearEnd = totalAmmount.next_sibling
                    paidAmmount = resp.find('span',{'id':'ctl00_ContentPlaceHolder1_gvSearchResult_ctl'+counter+'_lblTotalAmountPaid'})

                    html = resp.find("form", id='aspnetForm').prettify().encode('utf8')
                    view_state = resp.select("#__VIEWSTATE")[0]['value']
                    event_val = resp.select("#__EVENTVALIDATION")[0]['value']
                    resp0 = mechanize.make_response(html, [("Content-Type", "text/html")], self.br.geturl(), 200, "OK")

                    self.br.set_response(resp0)
                    self.br.select_form('aspnetForm')
                    self.br.form.set_all_readonly(False)
                    self.br.form['__EVENTTARGET'] = "ctl00$ContentPlaceHolder1$gvSearchResult"
                    self.br.form['__EVENTARGUMENT'] = "Select$"+str(elemNR)
                    self.br.form['__VIEWSTATE'] = view_state
                    self.br.form['__VIEWSTATEGENERATOR'] = "CA0B0334"
                    self.br.form['__VIEWSTATEENCRYPTED'] = ""
                    self.br.form['__EVENTVALIDATION'] = event_val
                    self.br.form['ctl00$ContentPlaceHolder1$txtQuickSearch'] = ""
                
                    ctl = self.br.form.find_control('ctl00$ibtnApplicationSearch')
                    self.br.form.controls.remove(ctl)

                    ctl = self.br.form.find_control('ctl00$ibtnContact')
                    self.br.form.controls.remove(ctl)

                    ctl = self.br.form.find_control('ctl00$ibtnEUgrants')
                    self.br.form.controls.remove(ctl)

                    ctl = self.br.form.find_control('ctl00$ContentPlaceHolder1$ibtnQuickSearch')
                    self.br.form.controls.remove(ctl)

                    ctl = self.br.form.find_control('ctl00$ContentPlaceHolder1$ibtnReturnToAdv')
                    self.br.form.controls.remove(ctl)

                    self.br.form.fixup()
                    self.br.submit()

                    resp0_back = BeautifulSoup(self.br.response().read())
                    
                    table = resp0_back.find('table')
                    table_rows = table.find_all('tr')
                    description = table_rows[3].find_all('td')[1].find('div').text.strip().encode("utf-8")
                    description = description.replace('\n', ' ')
                    description = description.replace('\r', ' ')
                    project_postcode = table_rows[4].find_all('td')[1].find('div').text.strip().encode("utf-8")
                    priority = ''.join(table_rows[6].find_all('td')[1].find('div').find_all('span')[1].next_sibling).strip()[:2].encode("utf-8")
                    total_cost = table_rows[7].find_all('td')[1].find('div').text.strip().encode("utf-8")

                    print "-------------------------"
                    print indexNR
                    print orgName.text.strip()
                    print projectTitle.text.strip()
                    print yearStart.text.strip()
                    print totalAmmount.text.strip()
                    print yearEnd.text.strip()
                    print paidAmmount.text.strip()
                    writer.writerow([orgName.text.strip().encode('ascii', 'ignore'), projectTitle.text.strip().encode('ascii', 'ignore'), yearStart.text.strip().encode('ascii', 'ignore'), totalAmmount.text.strip().encode('ascii', 'ignore'), yearEnd.text.strip().encode('ascii', 'ignore'), paidAmmount.text.strip().encode('ascii', 'ignore'), project_postcode, priority, total_cost, description])
                    indexNR += 1
                    elemNR += 1

                #TODO: Check for length of list, do no hardcode pagination!!! 
                pageno += 1
                if pageno == 174:
                    break
                # New __VIEWSTATE value
                view_state = resp.select("#__VIEWSTATE")[0]['value']
                event_val = resp.select("#__EVENTVALIDATION")[0]['value']

                # Regenerate form for next page
                html = resp.find("form", id='aspnetForm').prettify().encode('utf8')
                resp = mechanize.make_response(html, [("Content-Type", "text/html")], self.br.geturl(), 200, "OK")

                indexNR = 2
                self.br.set_response(resp)
                self.br.select_form('aspnetForm')
                self.br.form.set_all_readonly(False)
                self.br.form['__EVENTTARGET'] = "ctl00$ContentPlaceHolder1$gvSearchResult"
                self.br.form['__EVENTARGUMENT'] = "Page$"+str(pageno-1)
                self.br.form['__VIEWSTATE'] = view_state
                self.br.form['__VIEWSTATEGENERATOR'] = "CA0B0334"
                self.br.form['__VIEWSTATEENCRYPTED'] = ""
                self.br.form['__EVENTVALIDATION'] = event_val
                self.br.form['ctl00$ContentPlaceHolder1$txtQuickSearch'] = ""
                
                ctl = self.br.form.find_control('ctl00$ibtnApplicationSearch')
                self.br.form.controls.remove(ctl)

                ctl = self.br.form.find_control('ctl00$ibtnContact')
                self.br.form.controls.remove(ctl)

                ctl = self.br.form.find_control('ctl00$ibtnEUgrants')
                self.br.form.controls.remove(ctl)

                ctl = self.br.form.find_control('ctl00$ContentPlaceHolder1$ibtnQuickSearch')
                self.br.form.controls.remove(ctl)

                ctl = self.br.form.find_control('ctl00$ContentPlaceHolder1$ibtnReturnToAdv')
                self.br.form.controls.remove(ctl)


                self.br.form.fixup()
                self.br.submit()

    def scrape(self):
        state_items = self.get_state_items()
        self.scrape_beneficiaries(state_items)

if __name__ == '__main__':
    scraper = Northern_Ireland_Scraper()
    scraper.scrape()