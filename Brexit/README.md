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
https://balkey.carto.com/viz/ddd30c32-528a-11e6-9801-0ee66e2c9693/embed_map

## Data model

For each transaction, the following attributes are scraped, if available. Generally, missing records are indicated as "N/A".

* Priority (*from P1 to P5*)
* Organization (*the beneficiary*)
* Project (*name of the operation*)
* Type (*ERDF or ESF, respectively*)
* Subsidy (*known funding amount in GBP - if there's matching funding also, it is not included*)
* Matching (*if matching funding is available, amount in GBP*)
* Total (*total operation cost amount in GBP*)
* Start_date (*operation or contract start date*)
* End_date (*operation or contract end date*)
* State (*regional tag attained from source data as a helper for geocoding*)
* Region (*regional tag attained from source data as a helper for geocoding*)
* Geocoding_round (*a descriptive record indicating the suspected accuracy of geocoding processes - the lower the round nr. the more accurate is geocoding*)
* County (*geocoded from __Organization__ column for aggregation and to crosscheck geocoding accuracy with __Region__ column TBD*)
* City_name (*geocoded from __Organization__ column*)
* Postal_code (*geocoded from __Organization__ column*)
* Lat_coords (*geocoded from __Organization__ column*)
* Long_coord (*geocoded from __Organization__ column*)
* LAU1_code (*geocoded from the __Lat_coords__, __Long coords__ columns*)
* LAU1_name (*geocoded from the __Lat_coords__, __Long coords__ columns*)

## Geocoding

Geocoding is performed by **Organization** - therefore subsidies are located according to the beneficiary's known address. Please keep in mind that this might not be the geolocation where the funding was spent, but due to the fact that there's no information provided about the approved project's geoloaction, this still seems the best - and fairest - method.

Where **Region** column was available, we included that information when geolocating the beneficiary's address - therefore trying to get the geographically most accurate result when there were multiple addresses available for the given Organization name accross the UK. **State** column was always included in geolocation.

Geolocation was done by the Google Places API Web Service and the Google Maps Geocoding API. Unsuccesfull results were geocoded in severeal rounds, gradually leaving out **Region**, **State** then country ("United Kingdom") additions. Only addresses within the UK were considered successfull.

Minor transformations were made on the **Organization** name, to get better results. This could be further improved.

With this method, about 90 % of all transactions could be geocoded.

To get the parenting LAU1 units name for each transaction, we used the transaction's coordinates and the shapefiles containing all the LAU1 units - if the coordinates fell within a given unit's boundaries, the transaction received it's LAU1_code and LAU1_name attributes. We tried to do the matching on the basis of city names with the help of lookup tables provided by the UK member countries' statistical institutions - this was a miserable fail. The number of written variants for each municipality name and the complexity of their administrative hierarchies also made us wonder about all those Monthy Python jokes on British bureaucrats.

## Datasources

### Subsidy data

Subsidy data was scraped from the following sources:

* <a href="https://www.gov.uk/guidance/erdf-programmes-progress-and-achievements" target="_blank">England ERDF 2007-2013</a>
* <a href="https://www.gov.uk/government/collections/esf-funding-allocations-2007-to-2013" target="_blank">England ESF 2007-2013</a>
* <a href="http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17404/HIERDFJuly2013" target="_blank">Scotland - Highlands and Islands ERDF 2007-2013</a>
* <a href="http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17404/HIESFJuly2013" target="_blank">Scotland - Highlands and Islands ESF 2007-2013</a>
* <a href="http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17405/LUPSERDFPojectsJul2013" target="_blank">Scotland - Lowlands and Uplands ERDF 2007-2013</a>
* <a href="http://www.gov.scot/Topics/Business-Industry/support/17404/StructuralFunds2007-201/17405/LUPSESFProjectsJul13" target="_blank">Scotland - Lowlands and Uplands ESF 2007-2013</a>
* <a href="http://gov.wales/funding/eu-funds/previous/searchprojects/?lang=en" target="_blank">Wales ERDF, ESF 2007-2013</a>
* <a href="http://gov.wales/funding/eu-funds/2014-2020/looking/approved-projects/?lang=en" target="_blank">~~Wales ERDF, ESF 2014-2020~~</a>
* <a href="http://successes.eugrants.org/default.aspx" target="_blank">Northern Ireland ERDF, ESF 2007-2013</a>

### Population data

Population data was acquired from the following sources:

* <a href="https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/datasets/wardlevelmidyearpopulationestimatesexperimental" target="_blank">England, Wales - Mid 2011 population estimates (Census based) on 2011 wards</a>
* <a href="http://www.nrscotland.gov.uk/statistics-and-data/statistics/statistics-by-theme/population/population-estimates/special-area-population-estimates/nuts-population-estimates" target="_blank">Scotland - LAU1/NUTS4 population estimates by sex and single year of age 2011</a>
* <a href="https://en.wikipedia.org/wiki/List_of_districts_in_Northern_Ireland_by_population" target="_blank">Northern Ireland - List of districts in Northern Ireland by population from the 2011 Census</a>

### Spatial data

* <a href="http://www.nisra.gov.uk/geography/SOA.htm" target="_blank">Northern Ireland: LAU1 were created on the basis of Super Output Areas (SOA) with lookup tables available on the NISRA website</a>

## License

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

