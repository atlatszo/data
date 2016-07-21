# UK Subsidies & The Referendum

This is a project aimed at collecting subsidies received by the United Kingdom under the European Structural Funds programme.

For now, the following programmes are collected:

* European Regional Development Funds (ERDF) 2007 - 2013
* European Social Funds (ESF) 2007 - 2013

The final aim of this project is to show the results of the 2016 UK referendum and the subsidies received on a map, where electoral wards and administrative regions are harmonized / properly aggregated.

Changing with zoom levels, both electoral and subsidy data should be aggregated to the following levels:

* Countries
* NUTS 1
* NUTS 2
* NUTS 3
* LAU 1

## Data model

For each transaction, the following attributes are scraped, if available. Generally, missing records are indicated as "N/A"

* Priority (<i>from P1 to P5</i>)
* Organization (<i>the beneficiary</i>)
* Project (<i>name of the operation</i>)
* Type (<i>ERDF or ESF, respectively</i>)
* Subsidy (<i>known funding amount in GBP - if there's matching fund, it is not included</i>)
* Matching (<i>if matching funding is available, amount in GBP</i>)
* Total (<i>total operation cost amount in GBP</i>)
* Start_date (<i>operation or contract start date</i>)
* End_date (<i>operation or contract end date</i>)
* End_date (<i>operation or contract end date</i>)
* State (<i>regional tag attained from source data as a helper for geocoding</i>)
* Region (<i>regional tag attained from source data as a helper for geocoding</i>)
* Geocoding_round (<i>a descriptive record indicating the suspected accuracy of geocoding processes - the lower the round nr. the more accurate is geocoding</i>)
* County (<i>geocoded from <b>Organization</b> column for aggregation and to crosscheck geocoding accuracy with <b>Region</b> column - TBD</i>)
* City_name (<i>geocoded from <b>Organization</b> column</i>)
* Postal_code (<i>geocoded from <b>Organization</b> column</i>)
* Lat_coords (<i>geocoded from <b>Organization</b> column, WGS84 projection</i>)
* Long_coord (<i>geocoded from <b>Organization</b> column, WGS84 projection</i>)

## Datasources

Subsidy data was scraped from the following sources:

* [England ERDF 2007-2013](https://www.gov.uk/guidance/erdf-programmes-progress-and-achievements)
* [England ESF 2007-2013](https://www.gov.uk/government/collections/esf-funding-allocations-2007-to-2013)
* [Scotland - Highlands and Islands ERDF 2007-2013](http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17404/HIERDFJuly2013)
* [Scotland - Highlands and Islands ESFF 2007-2013](http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17404/HIESFJuly2013)
* [Scotland - Lowlands and Uplands ERDF 2007-2013](http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17405/LUPSERDFPojectsJul2013)
* [Scotland - Lowlands and Uplands ESF 2007-2013](http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17405/LUPSESFProjectsJul13)
* To be done: [Wales ERDF, ESF 2007-2013](http://gov.wales/funding/eu-funds/previous/searchprojects/?lang=en)
* [Wales ERDF, ESF 2014-2020](http://gov.wales/funding/eu-funds/previous/searchprojects/?lang=en)
* [Northern Ireland ERDF, ESF 2007-2013](http://successes.eugrants.org/default.aspx)

## License

UK Subsidies & The Referendum
Copyright (C) 2016 Krich Balazs, [atlatszo.hu](https://atlatszo.hu)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

