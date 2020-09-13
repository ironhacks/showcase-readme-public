# ASINY

ASINY is a recursive acronym that means **A**SINY is  **S**ite **I**n **N**ew **Y**ork. Its goal is to provide a ranking of the best district according to the metrics customized by the user. Mainly the distances e in different means of transport.
The interface tries to prioritize the Map, but at the same time give information about the best district determined by the application.
## How to use
After loading the page the user must select a filter to prioritize the districts for example the price, for the distance it takes a while however the bar located at the top of the filters allows to see the level of data loading .


After this the table will be updated, then the user will be able to select one of the rows of the table with which the district will be shown on the map with this the user will know its location. In addition, a series of graphs to explain the price data if this filter has been selected. If the distance filter has been activated the user can see the distance of the neighborhoods to NYU by simply passing the map for each of them and if you want to see the route just enough with click on said marker and it will show the best route to NYU.

The user can also choose in each of the table the available rows that he wants to be displayed and exported (only data from previously activated filters will be loaded)

finally the user has 4 tools to make their selection that are the heat map of crimes, see galleries, districts not habitable and see museums that are located at the top.
## KeyWords

* Interactive
* asdasd
* Tables
* Near
* Intuitive 

## Datasets Used

*  **Name NBH** [[NAMESNEIGHBORHOOD](https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD)]
	* Column Used:
		* [10]Name
		* [9]CoorCenter
		* [16]district
*  **SHAPECD** [[SHAPECD](https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson)]
	* Column Used:
		* features.geometry.coordinates
		* features.properties.BoroCD
		
	* 800 data  for consult
*  **NAMESNEIGHBORHOOD** [[NamesNB](https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD)]
	* Column Used:
		* [10]Name
		* [9]Centroid of Neighborhood
		* [16]Borough Name
		
	* 293 pull all in one consult
	
*  **CRIMES** [[crimes](https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD)]
	* Column Used:
		* [3]latitude
		* [20]Longitude
		* [16]Borough Name
		
	* 999 pull all in one consult
* Interactive Map
## Description

The application will seek to provide information filtered from the districts and also generate a ranking according to the parameters prioritized by the user. The interface will seek to be as intuitive as possible by responding to movements and controls commonly used in web pages containing maps.
Introduction
 -   Map View:
		1. [Y] the map starts centered at NYC University
		2. [Y] Marker in NYC University
 - Data Visualization:
		1. [Y] Highlight area of districts
		2. [Y] Table with ranking of best districts
		3. [Y] Chart transfer times from districts
 - Interaction Form:
		1. [Y]2 columns with filtered information regarding the districts
		2. [Y]Map interactive in the center
		3. [Y]Navigation bar on top to define metrics
		4. [N] Select means of transport
		5. [Y] Tables with the ranking of the districts that stand out on the map
		6. [Y] Exportable tables with  ranking
## Formulates district prioritization
To calculate the distance between Community District and NYU, the distance traveled by car from all the neighborhoods it contains to the NYU is calculated and averaged so that a more accurate measurement is obtained.
Then prioritize giving one point for each room of lower cost they have and also has the same type of prioritization for the number of rooms that has. Later it is divided by the number of houses that are counted to be more equitable.
 
# Files
 - index.html
 - style.css
 - index.js
 - [this] README.md

Here is the idea to use the mashup
	 1.  [Y] Basic Map with specific location (your map is located in a meaningful place, city of west lafayette for example)
    
