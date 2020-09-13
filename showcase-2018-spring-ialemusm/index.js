var URLGeoShapes = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/ArcGIS/rest/services/NYC_Community_Districts/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";


var arrAffor = [8, 161, undefined, 116, 186, 0, 0, 607, 187, 712, 183, undefined, 0, 1353, 0, 434, undefined, 929, 401, 463, 0, 0, undefined, 630, 170, undefined, 186, 1, 0, 332, 1116, 0, 0, undefined, 38, undefined, 475, 51, 265, 559, 112, undefined, 0, undefined, 0, 0, 45, 47, 105, 213, undefined, 478, 75, undefined, 58, 0, 540, undefined, 725, 348, 13, 354, 0, 160, 0, 0, 727, 0, 67, 0, 17];
var arrCrimes = [5, 32, undefined, 16, 14, 13, 13, 15, 15, 23, 9, undefined, 9, 29, 6, 22, undefined, 21, 15, 26, 18, 10, undefined, 20, 10, undefined, 26, 17, 20, 25, 23, 14, 14, undefined, 24, undefined, 22, 12, 23, 13, 20, undefined, 13, undefined, 7, 7, 46, 5, 16, 35, undefined, 40, 15, undefined, 33, 26, 9, undefined, 40, 23, 14, 10, 9, 18, 19, 17, 26, 8, 15, 12, 13];
var boolMarkers = false;
var byAffor = true;
var byCrimes = true;
var byDistance = true;
var center = {lat: 40.7291, lng: -73.9965};
var crimes = [];
var districts = [];
var graphCounter = 0;
var housing = [];
var map;
var markers = [];
var Neighborhoods = [];
var rankAffor = [];
var rankCrimes = [];
var rankDistance = [];



/**
  *Get Neighborhoods Names in each District
  */

function getNeighborhoodNames(){
  var URL = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
	var data = $.get(URL)
    //Itera sobre todo el archivo JSON para obtener los datos: nombre, localización (coordenadas) y localidad
		.done( function(){
      for (var i = 0; i < 299; i++) {
        var nei = new Object();
        nei.name = data.responseJSON.data[i][10];
        nei.borough = data.responseJSON.data[i][16];
        var loc = data.responseJSON.data[i][9];
        loc = loc.split(" "); // SE HACE LA ADAPTACION DE LA LOCALIZACION A FORMATO LAT-LNG
        loc = new google.maps.LatLng(loc[2].split(")")[0], loc[1].split("(")[1]);
        //loc = {lat: loc[2].split(")")[0], lng: loc[1].split("(")[1]};
        nei.location = loc; // SE GUARDAN LOS DATOS EN UN OBJETO DENTRO DEL ARRAY districts
        Neighborhoods.push(nei);
      }
      console.log(Neighborhoods);
      return Neighborhoods;

		})
		.fail( function(error){
			console.error(error);
		})
}

/**
  *Get data from DB Housing New York Units by Building
  */

function getHousingByBuilding(){
  var URL = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
	var data = $.get(URL)
		.done( function(){
      var json = data.responseJSON.data;
      for (var i = 0; i < json.length; i++) {
        if(json[i][23] != null &&  json[i][24] != null){
          var obj = new Object();
          obj.affor = json[i][31];
          var latlng = new google.maps.LatLng(json[i][23], json[i][24]);
          obj.latlng = latlng;
          housing.push(obj);
        }
      }


      //new google.maps.LatLng --> Cambiar de número a LatLng

		})
		.fail( function(error){
			console.error(error);
		})
}

/**
  *Get data Crimes in New York
  */

function getCrimes(){
  const URL = "https://data.cityofnewyork.us/resource/9s4h-37hy.json?$select= boro_nm, ofns_desc, lat_lon, CMPLNT_FR_DT&$where=cmplnt_fr_dt=\"2015-12-31T00:00:00.000\" AND lat_lon IS NOT NULL &$limit=40000";
	var data = $.get(URL)
		.done(function(){
      var json = data.responseJSON;
      for (var i = 0; i < json.length; i++) {
        crimes.push(json[i]);
      }
		})
		.fail( function(error){
			console.error(error);
		})
}

/**
  * Get distance between two points
  */

function getDistance(latlng){
  var lat = latlng.lat();
  var lng = latlng.lng();
  URL = "https://maps.googleapis.com/maps/api/distancematrix/json?&origins=40.7291,-73.9965&mode=walking&destinations=" + lat + "," + lng + "&key=AIzaSyCCJJCEbVpgTg8ZEU3cULnmLnZLVi6yrI0";
  var data = $.get(URL)
  	.done(function(){
      console.log(data);
  	})
  	.fail( function(error){
  		console.error(error);
  	})
}

/**
  * Get basic district data
  */

function affordabilityDeterminator(poly){
  var sum = 0;
  for (var i = 0; i < housing.length; i++) {
    if(google.maps.geometry.poly.containsLocation(housing[i].latlng, poly)){
       sum += parseInt(housing[i].affor);
       housing.splice(i, 1);
       i--;
    }
  }
  return sum;
}

function crimeLocator(poly){
  var numCrimes = 0;
  for (var i = 0; i < crimes.length; i++) {
    var latlon = new google.maps.LatLng(crimes[i].lat_lon.coordinates[1], crimes[i].lat_lon.coordinates[0]);
    if(google.maps.geometry.poly.containsLocation(latlon, poly)){
       numCrimes++;
       crimes.splice(i, 1);
       i--;
    }
  }
  return numCrimes;
}

function getPolygon(json, i){
  var polygons = [];
  var coord = [];
  var bounds = new google.maps.LatLngBounds();
  for (var k = 0; k < json[i].geometry.coordinates[0].length; k++) {
    var latlng = new google.maps.LatLng(json[i].geometry.coordinates[0][k][1], json[i].geometry.coordinates[0][k][0]);
    bounds.extend(latlng);
    coord.push(latlng);
  }
  var poly = new google.maps.Polygon({path: coord});

  //districts[i].crimes = crimeLocator(poly);

  //districts[i].affor = affordabilityDeterminator(poly);

  var r = new Object();
  r.first = coord;
  r.second = bounds.getCenter();
  return r;
}

function getMultiPolygon(json, i){
  var polygons = [];
  //var sum = 0;
  var bounds = new google.maps.LatLngBounds();
  for (var j = 0; j < json[i].geometry.coordinates.length; j++) {
    var coord = [];
    for (var k = 0; k < json[i].geometry.coordinates[j][0].length; k++) {
      var latlng = new google.maps.LatLng(json[i].geometry.coordinates[j][0][k][1], json[i].geometry.coordinates[j][0][k][0]);
      coord.push(latlng);
      bounds.extend(latlng);
    }
    var poly = new google.maps.Polygon({path: coord})
    //sum += affordabilityDeterminator(poly);
    //districts[i].crimes += crimeLocator(poly);
    polygons.push(coord);
  }
  //districts[i].affor = sum;
  var r = new Object();
  r.first = polygons;
  r.second = bounds.getCenter();
  return r;
}

function habitableSelector(boroCD){
  switch (parseInt(boroCD / 100)) {
    case 1:
      var color = '#C67052';
      if(boroCD % 100 >= 1 && boroCD % 100 <= 12 && parseInt(boroCD / 100) == 1){
        return true;
      } else if (parseInt(boroCD / 100) == 1) {
        return false;
      }
      break;
    case 2:
      var color = '#C1AE8D';
      if(boroCD % 100 >= 1 && boroCD % 100 <= 12 && parseInt(boroCD / 100) == 2){
        return true;
      } else if (parseInt(boroCD / 100) == 2) {
        return false;
      }
      break;
    case 3:
    var color = '#7A989A';
      if(boroCD % 100 >= 1 && boroCD % 100 <= 18 && parseInt(boroCD / 100) == 3){
        return true;
      } else if (parseInt(boroCD / 100) == 3) {
        return false;
      }
      break;
    case 4:
    var color = '#849271';
      if(boroCD % 100 >= 1 && boroCD % 100 <= 14 && parseInt(boroCD / 100) == 4){
        return true;
      } else if (parseInt(boroCD / 100) == 4) {
        return false;
      }
      break;
    case 5:
    var color = '#CF9546';
      if(boroCD % 100 >= 1 && boroCD % 100 <= 14 && parseInt(boroCD / 100) == 5){
        return true;
        console.log("1");
      } else if (parseInt(boroCD / 100) == 5) {
        return false;
      }
      break;
    default:

  }
}

function rank(){
  for (var i = 0; i < districts.length; i++) {
    rankAffor.push(districts[i]);
    rankCrimes.push(districts[i]);
    rankDistance.push(districts[i]);
  }

  rankAffor.sort(function(a, b){
    if(a.affor == null){
      return +999999;
    } else if (b.affor == null) {
      return -999999;
    }
    return b.affor-a.affor;
  });

  rankCrimes.sort(function(a, b){
    if(a.crimes == null){
      return +999999;
    } else if (b.crimes == null) {
      return -999999;
    }
    return a.crimes-b.crimes;
  });

  rankDistance.sort(function(a, b){
    if(a.distance == null){
      return +999999;
    } else if (b.distance == null) {
      return -999999;
    }
    return a.distance-b.distance;
  });
}

function boroSelector(boroCD){
  var cd = parseInt(boroCD / 100);
  switch (cd) {
    case 1:
      return "Manhattan";
      break;
    case 2:
      return "Bronx";
      break;
    case 3:
      return "Brooklyn";
      break;
    case 4:
      return "Queens";
      break;
    case 5:
      return "Staten Island";
      break;
    default:

  }
}

function getData(){
  for (var i = 0; i < 71; i++) {
    var district = new Object();
    districts.push(district);
  }
  var URL = URLGeoShapes, re;
  //Request crimes
  getCrimes();
  getHousingByBuilding();
  var data = $.get(URL)
    .done( function(){
      var json = JSON.parse(data.responseText).features;
      for(var i = 0; i < json.length; i++){
        districts[i].borough = boroSelector(json[i].properties.BoroCD);
        if(habitableSelector(json[i].properties.BoroCD)){
          districts[i].crimes = 0;
          // Get BoroughCD
          districts[i].boroCD = json[i].properties.BoroCD;

          /**
          * Little cheat to load faster data
          */
          districts[i].crimes = arrCrimes[i];
          districts[i].affor = arrAffor[i];

          // Get shape and center
          if(json[i].geometry.type == "Polygon"){
            var r = getPolygon(json, i);
            districts[i].shape = r.first;
            districts[i].center = r.second;
            districts[i].distance = (google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(center.lat, center.lng), districts[i].center) / 1000).toFixed(1);
          } else {
            var r = getMultiPolygon(json, i);
            districts[i].shape = r.first;
            districts[i].center = r.second;
            districts[i].distance = (google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(center.lat, center.lng), districts[i].center) / 1000).toFixed(1);
          }
        }
      }
      rank();
      $('#crimeCheck').prop('checked', true);
      $('#afforCheck').prop('checked', true);
      fillTable();
      chartPlotter();
    })
    .fail( function(error){
      console.error(error);
    })
}

/**
  * Fill table by option
  */
function afforChecked(){
  byAffor = !byAffor;
  fillTable();
  chartPlotter();
}

function crimeChecked(){
  byCrimes = !byCrimes;
  fillTable();
  chartPlotter();
}

function distanceChecked(){
  byDistance = !byDistance;
  fillTable();
  chartPlotter();
}

function ranker(){
  var tem = [];
  for (var i = 0; i < districts.length; i++) {
    tem.push(districts[i]);
    tem[i].rank = 0;
  }
  if(!byCrimes && !byAffor && !byDistance){
    for (var i = 0; i < tem.length; i++) {
      if(tem[i].boroCD == null){
        tem.splice(i, 1);
        i--;
      }
    }
    tem.sort(function(a, b){
      return a.boroCD-b.boroCD;
    });
    return tem;
  }
  if(byCrimes){
    for (var i = 0; i < rankCrimes.length; i++) {
      for (var j = 0; j < tem.length; j++) {
        if(rankCrimes[i].boroCD == tem[j].boroCD){
          tem[j].rank += i;
        }
      }
    }
  }
  if(byAffor){
    for (var i = 0; i < rankAffor.length; i++) {
      for (var j = 0; j < tem.length; j++) {
        if(rankAffor[i].boroCD == tem[j].boroCD){
          tem[j].rank += i;
        }
      }
    }
  }
  if(byDistance){
    for (var i = 0; i < rankAffor.length; i++) {
      for (var j = 0; j < tem.length; j++) {
        if(rankDistance[i].boroCD == tem[j].boroCD){
          tem[j].rank += i;
        }
      }
    }
  }
  tem.sort(function(a, b){
    return a.rank-b.rank;
  });
  return tem;
}

function rankFiltered(){
  var rank = [], arr = ranker();
  for(var i = 0; i < 10; i++){
    rank.push(arr[i]);
  }
  return rank;
}

function fillTable(){
  deleteTable();
  var ranking = ranker();
	tableReference = $("#mainTableBody")[0];
	var newRow, co2Amount, state, place, ranking;
	for(var i = 0; i < 10; i++){
		newRow = tableReference.insertRow(tableReference.rows.length);
		place = newRow.insertCell(0);
		borough = newRow.insertCell(1);
    code = newRow.insertCell(2);
    crimes = newRow.insertCell(3);
    affordability = newRow.insertCell(4);
    distance = newRow.insertCell(5);
    place.innerHTML = i+1;
		borough.innerHTML = ranking[i].borough;
    code.innerHTML = ranking[i].boroCD % 100;
    crimes.innerHTML = ranking[i].crimes;
    affordability.innerHTML = ranking[i].affor;
    distance.innerHTML = ranking[i].distance;
    var lab = "" + (i + 1);
    var marker = new google.maps.Marker({position: ranking[i].center, label: {text: lab, color: "#F0FFCE"}});
    if(boolMarkers){
      marker.setMap(map);
    }
    markers.push(marker);
	}
}

function deleteTable(){
  $('#mainTableBody').children( 'tr' ).remove();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
    markers.splice(i, 1);
    i--;
  }
}

function markerSetter(){
  if(boolMarkers){
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  } else {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  boolMarkers = !boolMarkers;
}

/**
  * Make the current's table chart
  */

function chartPlotter(){
  chartSecurityPlotter();
  chartAfforPlotter();
  chartDistancePlotter();
}

function chartSecurityPlotter() {
  d3.selectAll("#chartSecurity > *").remove();

  var data = rankFiltered();

  var margin = {top:10, right:10, bottom:90, left:100};

  var width = 560 - margin.left - margin.right;

  var height = 250 - margin.top - margin.bottom;

  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .03)

  var yScale = d3.scale.linear()
       .range([height, 0]);


  var xAxis = d3.svg.axis()
       .scale(xScale)
       .orient("bottom");


  var yAxis = d3.svg.axis()
       .scale(yScale)
       .orient("left");

  var svgContainer = d3.select("#chartSecurity").append("svg")
     .attr("width", width+margin.left + margin.right)
     .attr("height",height+margin.top + margin.bottom)
     .append("g").attr("class", "container")
     .attr("transform", "translate("+ margin.left +","+ margin.top +")");

  xScale.domain(data.map(function(d) { return d.boroCD; }));
  yScale.domain([0, d3.max(data, function(d) { return d.crimes; })]);


  //xAxis. To put on the bottom, swap "-5" with "(height)" in the translate() statement and make "-45" "45" in the rotate() statement. Then you'll have to change the margins above and the x,y attributes in the svgContainer.select('.x.axis') statement inside resize() below.
  var xAxis_g = svgContainer.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + (height) + ")")
       .call(xAxis)
       .selectAll("text")
       // Uncomment the next line to rotate the labels 45 degrees, then disable text wrap in the svgContainer.select('.x.axis').call() statement inside resize()
       //.attr("transform","rotate(-45)")
       .attr("x",0);

  // Uncomment this block if you want the y axis
  var yAxis_g = svgContainer.append("g")
       .attr("class", "y axis")
       .call(yAxis)
     .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -40).attr("dy", ".71em")
       .style("text-anchor", "end").text("Amount of Crimes");



   svgContainer.selectAll(".bar")
           .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
           .attr("x", function(d) { return xScale(d.boroCD); })
           .attr("width", xScale.rangeBand())
           .attr("y", function(d) { return yScale(d.crimes); })
           .attr("height", function(d) { return height - yScale(d.crimes); });
}

function chartAfforPlotter() {
  d3.selectAll("#chartAffor > *").remove();

  var data = rankFiltered();

  var margin = {top:10, right:10, bottom:90, left:50};

  var width = 560 - margin.left - margin.right;

  var height = 250 - margin.top - margin.bottom;

  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .03)

  var yScale = d3.scale.linear()
       .range([height, 0]);


  var xAxis = d3.svg.axis()
       .scale(xScale)
       .orient("bottom");


  var yAxis = d3.svg.axis()
       .scale(yScale)
       .orient("left");

  var svgContainer = d3.select("#chartAffor").append("svg")
     .attr("width", width+margin.left + margin.right)
     .attr("height",height+margin.top + margin.bottom)
     .append("g").attr("class", "container")
     .attr("transform", "translate("+ margin.left +","+ margin.top +")");

  xScale.domain(data.map(function(d) { return d.boroCD; }));
  yScale.domain([0, d3.max(data, function(d) { return d.affor; })]);


  //xAxis. To put on the bottom, swap "-5" with "(height)" in the translate() statement and make "-45" "45" in the rotate() statement. Then you'll have to change the margins above and the x,y attributes in the svgContainer.select('.x.axis') statement inside resize() below.
  var xAxis_g = svgContainer.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + (height) + ")")
       .call(xAxis)
       .selectAll("text")
       // Uncomment the next line to rotate the labels 45 degrees, then disable text wrap in the svgContainer.select('.x.axis').call() statement inside resize()
       //.attr("transform","rotate(-45)")
       .attr("x",0);

  // Uncomment this block if you want the y axis
  var yAxis_g = svgContainer.append("g")
       .attr("class", "y axis")
       .call(yAxis)
     .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -50).attr("dy", ".75em")
       .style("text-anchor", "end").text("Extremely Low Income Units");



   svgContainer.selectAll(".bar")
           .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
           .attr("x", function(d) { return xScale(d.boroCD); })
           .attr("width", xScale.rangeBand())
           .attr("y", function(d) { return yScale(d.affor); })
           .attr("height", function(d) { return height - yScale(d.affor); });

}

function chartDistancePlotter() {
  d3.selectAll("#chartDistance > *").remove();
  d3.selectAll("#chartDistance").transition();

  var data = rankFiltered();

  var margin = {top:10, right:10, bottom:90, left:100};

  var width = 560 - margin.left - margin.right;

  var height = 250 - margin.top - margin.bottom;

  var xScale = d3.scale.ordinal().rangeRoundBands([0, width], .03)

  var yScale = d3.scale.linear()
       .range([height, 0]);


  var xAxis = d3.svg.axis()
       .scale(xScale)
       .orient("bottom");


  var yAxis = d3.svg.axis()
       .scale(yScale)
       .orient("left");

  var svgContainer = d3.select("#chartDistance").append("svg")
     .attr("width", width+margin.left + margin.right)
     .attr("height",height+margin.top + margin.bottom)
     .append("g").attr("class", "container")
     .attr("transform", "translate("+ margin.left +","+ margin.top +")");

  xScale.domain(data.map(function(d) { return d.boroCD; }));
  yScale.domain([0, d3.max(data, function(d) { return d.distance; })]);


  //xAxis. To put on the bottom, swap "-5" with "(height)" in the translate() statement and make "-45" "45" in the rotate() statement. Then you'll have to change the margins above and the x,y attributes in the svgContainer.select('.x.axis') statement inside resize() below.
  var xAxis_g = svgContainer.append("g")
       .attr("class", "x axis")
       .attr("transform", "translate(0," + (height) + ")")
       .call(xAxis)
       .selectAll("text")
       // Uncomment the next line to rotate the labels 45 degrees, then disable text wrap in the svgContainer.select('.x.axis').call() statement inside resize()
       //.attr("transform","rotate(-45)")
       .attr("x",0);

  // Uncomment this block if you want the y axis
  var yAxis_g = svgContainer.append("g")
       .attr("class", "y axis")
       .call(yAxis)
     .append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -65).attr("dy", ".75em")
       .style("text-anchor", "end").text("Distance to NYU (km)");



   svgContainer.selectAll(".bar")
           .data(data)
         .enter()
         .append("rect")
         .attr("class", "bar")
           .attr("x", function(d) { return xScale(d.boroCD); })
           .attr("width", xScale.rangeBand())
           .attr("y", function(d) { return yScale(d.distance); })
           .attr("height", function(d) { return height - yScale(d.distance); });

}

/**
  * Draw all habitable districts by Borough
  */

function drawDistrict(){

  map.data.loadGeoJson(URLGeoShapes);

  map.data.setStyle(function(feature) {
    switch (parseInt(feature.getProperty('BoroCD') / 100)) {
      case 1:
        var color = '#C67052';
        if(feature.getProperty('BoroCD') % 100 >= 1 && feature.getProperty('BoroCD') % 100 <= 12 && parseInt(feature.getProperty('BoroCD') / 100) == 1){
          return({
            fillColor: color,
            strokeColor: color,
            strokeWeight: 1
          });
          console.log("1");
        } else if (parseInt(feature.getProperty('BoroCD') / 100) == 1) {
          return ({
            fillColor: "white",
            strokeWeight: 0,
            fillOpacity: 0
          });
        }
        break;
      case 2:
        var color = '#C1AE8D';
        if(feature.getProperty('BoroCD') % 100 >= 1 && feature.getProperty('BoroCD') % 100 <= 12 && parseInt(feature.getProperty('BoroCD') / 100) == 2){
          return({
            fillColor: color,
            strokeColor: color,
            strokeWeight: 1
          });
          console.log("1");
        } else if (parseInt(feature.getProperty('BoroCD') / 100) == 2) {
          return ({
            fillColor: "white",
            strokeWeight: 0,
            fillOpacity: 0
          });
        }
        break;
      case 3:
      var color = '#7A989A';
        if(feature.getProperty('BoroCD') % 100 >= 1 && feature.getProperty('BoroCD') % 100 <= 18 && parseInt(feature.getProperty('BoroCD') / 100) == 3){
          return({
            fillColor: color,
            strokeColor: color,
            strokeWeight: 1
          });
          console.log("1");
        } else if (parseInt(feature.getProperty('BoroCD') / 100) == 3) {
          return ({
            fillColor: "white",
            strokeWeight: 0,
            fillOpacity: 0
          });
        }
        break;
      case 4:
      var color = '#849271';
        if(feature.getProperty('BoroCD') % 100 >= 1 && feature.getProperty('BoroCD') % 100 <= 14 && parseInt(feature.getProperty('BoroCD') / 100) == 4){
          return({
            fillColor: color,
            strokeColor: color,
            strokeWeight: 1
          });
          console.log("1");
        } else if (parseInt(feature.getProperty('BoroCD') / 100) == 4) {
          return ({
            fillColor: "white",
            strokeWeight: 0,
            fillOpacity: 0
          });
        }
        break;
      case 5:
      var color = '#CF9546';
        if(feature.getProperty('BoroCD') % 100 >= 1 && feature.getProperty('BoroCD') % 100 <= 14 && parseInt(feature.getProperty('BoroCD') / 100) == 5){
          return({
            fillColor: color,
            strokeColor: color,
            strokeWeight: 1
          });
          console.log("1");
        } else if (parseInt(feature.getProperty('BoroCD') / 100) == 5) {
          return ({
            fillColor: "white",
            strokeWeight: 0,
            fillOpacity: 0
          });
        }
        break;
      default:

    }
  });


  map.data.addListener('mouseover', function(event) {
    map.data.revertStyle();
    if(event.feature.getProperty('BoroCD') % 100 < 20){
      map.data.overrideStyle(event.feature, {strokeWeight: 1.5});
    }
  });

  map.data.addListener('mouseout', function(event) {
    map.data.revertStyle();
  });

}

/**
  * Mandatory function for Google Maps
  * Contains Style Config
  */

function onGoogleMapResponse(){

  var styledMapType = new google.maps.StyledMapType(
    [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#523735"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#c9b2a6"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#dcd2be"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ae9e90"
          }
        ]
      },
      {
        "featureType": "administrative.neighborhood",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#93817c"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#a5b076"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#447530"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f1e6"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#fdfcf8"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f8c967"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#e9bc62"
          },
          {
            "visibility": "simplified"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e98d58"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#db8555"
          }
        ]
      },
      {
        "featureType": "road.local",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#806b63"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#8f7d77"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#ebe3cd"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dfd2ae"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#b9d3c2"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#92998d"
          }
        ]
      }
    ]
  );
	map = new google.maps.Map(document.getElementById('googleMapContainer'), {
    center: {lat: 40.7291, lng: -73.9965},
    zoom: 10.3,
    mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
          }
	});

  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');


  var image = {
    url: "https://reachingthethirties.files.wordpress.com/2012/06/nyu-stern-logo.png?w=192&h=69",
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17,34),
    scaledSize: new google.maps.Size(55, 25)
  };

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(40.7291, -73.9965),
    icon: image,
    animation: google.maps.Animation.BOUNCE,
    map: map
  });
  marker.addListener('click', centerMap);
  function centerMap(){
    map.setCenter(new google.maps.LatLng(40.7291, -73.9965));
    map.setZoom(15);
  }


  getData();
  drawDistrict();
}

function downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;

  // CSV file
  csvFile = new Blob([csv], {type: "text/csv"});

  // Download link
  downloadLink = document.createElement("a");

  // File name
  downloadLink.download = filename;

  // Create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Hide download link
  downloadLink.style.display = "none";

  // Add the link to DOM
  document.body.appendChild(downloadLink);

  // Click download link
  downloadLink.click();
}

function exportTableToCSV(filename) {
  var csv = [];
  var rows = document.querySelectorAll("#ranking tr");
  for (var i = 1; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td, th");

      for (var j = 0; j < cols.length; j++)
          row.push(cols[j].innerText);

      csv.push(row.join(";"));
  }
  // Download CSV file
  downloadCSV(csv.join("\n"), filename);
}

$(document).ready( function(){
})
