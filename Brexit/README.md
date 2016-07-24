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

## Demo

Building a custom map application is in the works. Until then, the data is published @ Carto:
https://balkey.carto.com/viz/c97f6030-5179-11e6-aa76-0e05a8b3e3d7/embed_map

## Data model

For each transaction, the following attributes are scraped, if available. Generally, missing records are indicated as "N/A".

* Priority (<i>from P1 to P5</i>)
* Organization (<i>the beneficiary</i>)
* Project (<i>name of the operation</i>)
* Type (<i>ERDF or ESF, respectively</i>)
* Subsidy (<i>known funding amount in GBP - if there's matching funding also, it is not included</i>)
* Matching (<i>if matching funding is available, amount in GBP</i>)
* Total (<i>total operation cost amount in GBP</i>)
* Start_date (<i>operation or contract start date</i>)
* End_date (<i>operation or contract end date</i>)
* State (<i>regional tag attained from source data as a helper for geocoding</i>)
* Region (<i>regional tag attained from source data as a helper for geocoding</i>)
* Geocoding_round (<i>a descriptive record indicating the suspected accuracy of geocoding processes - the lower the round nr. the more accurate is geocoding</i>)
* County (<i>geocoded from <b>Organization</b> column for aggregation and to crosscheck geocoding accuracy with <b>Region</b> column - TBD</i>)
* City_name (<i>geocoded from <b>Organization</b> column</i>)
* Postal_code (<i>geocoded from <b>Organization</b> column</i>)
* Lat_coords (<i>geocoded from <b>Organization</b> column</i>)
* Long_coord (<i>geocoded from <b>Organization</b> column</i>)
* LAU1_code (<i>geocoded from the <b>Lat_coords</b>, <b>Long coords</b> columns</i>)
* LAU1_name (<i>geocoded from the <b>Lat_coords</b>, <b>Long coords</b> columns</i>)

## Geocoding

Geocoding is performed by <b>Organization</b> - therefore subsidies are located according to the beneficiary's known address. Please keep in mind that this might not be the geolocation where the funding was spent, but due to the fact that there's no information provided about the approved project's geoloaction, this still seems the best - and fairest - method.

Where <b>Region</b> column was available, we included that information when geolocating the beneficiary's address - therefore trying to get the geographically most accurate result when there were multiple addresses available for the given Organization name accross the UK. <b>State</b> column was always included in geolocation.

Geolocation was done by the Google Places API Web Service and the Google Maps Geocoding API. Unsuccesfull results were geocoded in severeal rounds, gradually leaving out <b>Region</b>, <b>State</b> then country ("United Kingdom") additions. Only addresses within the UK were considered successfull.

Minor transformations were made on the <b>Organization</b> name, to get better results. This could be further improved.

With this method, about 90 % of all transactions could be geocoded.

To get the parenting LAU1 units name for each transaction, we used the transaction's coordinates and the shapefiles containing all the LAU1 units - if the coordinates fell within a given unit's boundaries, the transaction received it's LAU1_code and LAU1_name attributes. We tried to do the matching on the basis of city names with the help of lookup tables provided by the UK member countries' statistical institutions - this was a miserable fail. The number of written variants for each municipality name and the complexity of their administrative hierarchies also made us wonder about all those Monthy Python jokes on British bureaucrats.

## Datasources

Subsidy data was scraped from the following sources:

* [England ERDF 2007-2013](https://www.gov.uk/guidance/erdf-programmes-progress-and-achievements)
* [England ESF 2007-2013](https://www.gov.uk/government/collections/esf-funding-allocations-2007-to-2013)
* [Scotland - Highlands and Islands ERDF 2007-2013](http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17404/HIERDFJuly2013)
* [Scotland - Highlands and Islands ESFF 2007-2013](http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17404/HIESFJuly2013)
* [Scotland - Lowlands and Uplands ERDF 2007-2013](http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17405/LUPSERDFPojectsJul2013)
* [Scotland - Lowlands and Uplands ESF 2007-2013](http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17405/LUPSESFProjectsJul13)
* To be done: [Wales ERDF, ESF 2007-2013](http://gov.wales/funding/eu-funds/previous/searchprojects/?lang=en)
* [Wales ERDF, ESF 2014-2020](http://gov.wales/funding/eu-funds/2014-2020/looking/approved-projects/?lang=en)
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

