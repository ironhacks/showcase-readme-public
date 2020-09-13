
var map;
var directionsDisplay;
var boroughs = {
	"Bronx" : ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 9", "District 10", "District 11", "District 12"],
	"Brooklyn" : ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 9", "District 10", "District 11", "District 12", "District 13", "District 14", "District 15", "District 16", "District 17", "District 18"],
	"Manhattan" : ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 9", "District 10", "District 11", "District 12"],
	"Queens" : ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6", "District 7", "District 8", "District 9", "District 10", "District 11", "District 12", "District 13", "District 14"],
	"Staten" : ["District 1", "District 2", "District 3"]
};
//-----------------Change de center of the map---------------------------------------------------------------------------------------------
function onGoogleMapResponse(){
	map = new google.maps.Map(document.getElementById('googleMapContainer'), {
		zoom: 10,
    mapTypeId: 'hybrid'

	});
  directionsDisplay = new google.maps.DirectionsRenderer();
	var country = "NY Stern";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
}
function onNY(){
	var country = "New York";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(10);
}
function onBronx(){
	var country = "The Bronx";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(12);
}
function onBrooklyn(){
	var country = "Brooklyn";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(11);
}
function onManhattan(){
	var country = "Manhattan";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(11);
}
function onQueens(){
	var country = "Queens";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(10);
}
function onStaten(){
	var country = "Staten Island";
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode( { 'address' : country}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			map.setCenter(results[0].geometry.location);
		}
	});
  map.setZoom(11);
}
//-----------------NY_districts_shapes---------------------------------------------------------------------------------------------
var json;
var dist = [];
function updateDistricts(){
	var URL = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/ArcGIS/rest/services/NYC_Community_Districts/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
  	var data = $.get(URL, function(){
  	})
  		.done( function(){
        var text = data.responseText;
        json = JSON.parse(text);
  			//console.log(json);
        getCoords();
  		})
  		.fail( function(error){
  			console.error(error);
  		})
}
function getCoords() {
    var cont;
    var temp = [];
    var numBoro;
    var numDist;
    for (var i = 0; i < 71; i++) {
      if (i==14 || i == 18 || i == 20 || i == 26 || i ==28 || i == 47 || i == 52 || i == 55 || i == 58 || i == 59 ||
          i == 63 || i == 65 || i == 66 || i == 67) {
        cont = 0;
        temp = [];
        for (var k = 0; k < json.features[i].geometry.coordinates.length; k++) {
          var coords = [];
          for (var j = 0; j < json.features[i].geometry.coordinates[k][0].length; j++) {
              coords[j] = {lat: json.features[i].geometry.coordinates[k][0][j][1],
              lng: json.features[i].geometry.coordinates[k][0][j][0]};
          }
          temp[cont] = coords;
          cont++;
        }
        numBoro = parseInt(json.features[i].properties.BoroCD.toString().substring(0,1));
        numDist = parseInt(json.features[i].properties.BoroCD.toString().substring(1,3));
        if (numDist < 20) {
          switch (numBoro) {
            case 1: dist[numDist-1] = temp;break;
            case 2: dist[numDist+11] = temp;break;
            case 3: dist[numDist+23] = temp;break;
            case 4: dist[numDist+41] = temp;break;
            case 5: dist[numDist+55] = temp;break;
          }
        }
      } else {
        var coords = [];
        for (var j = 0; j < json.features[i].geometry.coordinates[0].length; j++) {
            coords[j] = {lat: json.features[i].geometry.coordinates[0][j][1],
            lng: json.features[i].geometry.coordinates[0][j][0]};
        }
        numBoro = parseInt(json.features[i].properties.BoroCD.toString().substring(0,1));
        numDist = parseInt(json.features[i].properties.BoroCD.toString().substring(1,3));
        if (numDist < 20) {
          switch (numBoro) {
            case 1: dist[numDist-1] = coords;break;
            case 2: dist[numDist+11] = coords;break;
            case 3: dist[numDist+23] = coords;break;
            case 4: dist[numDist+41] = coords;break;
            case 5: break;
          }
        }
      }
    }
    districtsCenters();
    districtsNames();
}
//-----------------NY_neighborhood_names---------------------------------------------------------------------------------------------
var neighborhood;
function updateNames() {
  var URL = "https://data.cityofnewyork.us/resource/xyye-rtrs.json";
  neighborhood = $.get(URL)
    .done(function() {
      //console.log(neighborhood);
      getNames();
    })
    .fail(function (error) {
      console.log(error);
    })
}
var neighNames = [];
function getNames() {
  var latlon;
  var name;
  var borough;
  for (var i = 0; i < neighborhood.responseJSON.length; i++) {
    latlon = {lat: neighborhood.responseJSON[i].the_geom.coordinates[1],lng: neighborhood.responseJSON[i].the_geom.coordinates[0]};
    name = neighborhood.responseJSON[i].name;
    borough = neighborhood.responseJSON[i].borough;
    neighNames[i] = {latlon, name, borough};
  }
}
//-----------------NY_housing---------------------------------------------------------------------------------------------
var housing;
function updateHousing() {
  var URL = "https://data.cityofnewyork.us/resource/hg8x-zxpr.json?$where=longitude!=\"0\"&$limit=500"
  housing = $.get(URL)
    .done(function() {
      getHousing();
    })
    .fail(function(error) {
      console.log(error);
    })
}
var housingSites = [];
function getHousing() {
  var borough;
  var latlon;
  var ExtLowInc;
  var name;
  for (var i = 0; i < housing.responseJSON.length; i++) {
     borough= housing.responseJSON[i].borough;
     latlon = {lat: parseFloat(housing.responseJSON[i].latitude), lng: parseFloat(housing.responseJSON[i].longitude)};
     ExtLowInc = housing.responseJSON[i].extremely_low_income_units;
     name = housing.responseJSON[i].project_name;
     housingSites[i] = {borough, latlon, ExtLowInc, name};
  }
}
//-----------------NY_crimes---------------------------------------------------------------------------------------------
var dataCrimes = [];
function updateCrimesBrx() {
    var URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=boro_nm,lat_lon,law_cat_cd,ofns_desc&$where=boro_nm=\"BRONX\" AND cmplnt_fr_dt>=\"2015-12-31T00:00:00\" AND lat_lon IS NOT NULL&$order=cmplnt_num";
    dataCrimes[0] = $.get(URL)
      .done(function () {
          //console.log(dataCrimes[0]);
          updateCrimeBro();
          updateDataChart(1, 0);
      })
      .fail(function (error) {
          console.log(error);
      })
}
function updateCrimeBro() {
    URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=boro_nm,lat_lon,law_cat_cd&$where=boro_nm=\"BROOKLYN\" AND cmplnt_fr_dt>=\"2015-12-31T00:00:00\" AND lat_lon IS NOT NULL&$order=cmplnt_num";
    dataCrimes[1] = $.get(URL)
      .done(function () {
          //console.log(dataCrimes[4]);
          updateCrimeMan();
      })
      .fail(function (error) {
          console.log(error);
      })
}
function updateCrimeMan() {
    URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=boro_nm,lat_lon,law_cat_cd&$where=boro_nm=\"MANHATTAN\" AND cmplnt_fr_dt>=\"2015-12-31T00:00:00\" AND lat_lon IS NOT NULL&$order=cmplnt_num";
    dataCrimes[2] = $.get(URL)
      .done(function () {
          //console.log(dataCrimes[4]);
          updateCrimeQue();
      })
      .fail(function (error) {
          console.log(error);
      })
}
function updateCrimeQue() {
    URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=boro_nm,lat_lon,law_cat_cd&$where=boro_nm=\"QUEENS\" AND cmplnt_fr_dt>=\"2015-12-31T00:00:00\" AND lat_lon IS NOT NULL&$order=cmplnt_num";
    dataCrimes[3] = $.get(URL)
      .done(function () {
          //console.log(dataCrimes[4]);
          updateCrimeSta();
      })
      .fail(function (error) {
          console.log(error);
      })
}
function updateCrimeSta() {
    URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=boro_nm,lat_lon,law_cat_cd&$where=boro_nm=\"STATEN ISLAND\" AND cmplnt_fr_dt>=\"2015-12-31T00:00:00\" AND lat_lon IS NOT NULL&$order=cmplnt_num";
    dataCrimes[4] = $.get(URL)
      .done(function () {
          //console.log(dataCrimes[4]);
          getCrimes();
      })
      .fail(function (error) {
          console.log(error);
      })
}
var allCenters = [];
function getCrimes() {
  for (var j = 0; j < 5; j++) {
    var centers = [];
    var level = [];
    //console.log(parseFloat(dataCrimes[j].responseJSON[1].lat_lon.latitude));
    for (var i = 0; i < dataCrimes[j].responseJSON.length; i++) {
      if (dataCrimes[j].responseJSON[i].lat_lon) {
        centers[i] = {lat: parseFloat(dataCrimes[j].responseJSON[i].lat_lon.latitude),
          lng: parseFloat(dataCrimes[j].responseJSON[i].lat_lon.longitude)};
        level[i] = dataCrimes[j].responseJSON[i].law_cat_cd;
      }
    }
    allCenters[j] = {centers, level};
  }
}
var dataC = [];
var dataChart = [[],[],[],[],[]];
function updateDataChart(i, num) {
  if (num < 5) {
    if (i == 32) {
      for (var j = 0; j < 31; j++) {
        dataChart[num][j] = [dataC[j].responseJSON[0].cmplnt_fr_dt, dataC[j].responseJSON.length];
      }
      dataC = [];
      updateDataChart(1, num+1);
    } else {
      switch (num) {
          case 0:
            boro = "BRONX";
            break;
          case 1:
            boro = "BROOKLYN";
            break;
          case 2:
            boro = "MANHATTAN";
            break;
          case 3:
            boro = "QUEENS";
            break;
          case 4:
            boro = "STATEN ISLAND";
            break;
        }
        if (i<10) {
          var URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=cmplnt_fr_dt&$where=boro_nm=\"" + boro + "\" AND cmplnt_fr_dt=\"2016-12-0" + i + "T00:00:00\"";
        } else {
          var URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json?$select=cmplnt_fr_dt&$where=boro_nm=\"" + boro + "\" AND cmplnt_fr_dt=\"2016-12-" + i + "T00:00:00\"";
        }
        dataC[i-1] = $.get(URL)
          .done(function () {
            //console.log(dataC[i-1]);
            updateDataChart(i+1, num);
          })
          .fail(function (error) {
              console.log(error);
          })
    }
  }
}
//-----------------Show the districts of the borough and the neighborhoods---------------------------------------------------------------------------------------------
var button = document.getElementById("close");
var table=document.getElementById("newTable");
var marker = [];
function makeMarker(num, i) {
  marker[i] = new google.maps.Marker({
    position: neighNames[num].latlon,
    label: {
      text: neighNames[num].name,
      fontSize: "10pt",
      color: "white",
      fontWeight: "10px"
    },
    map: map
  });
}
var house = [];
function makeHouse(num, i) {
  house[i] = new google.maps.Marker({
    position: housingSites[num].latlon,
    title: housingSites[num].name,
    map: map,
    icon: {
      url: "https://cdn3.iconfinder.com/data/icons/eziconic-v1-0/256/01.png",
      scaledSize: {width: 40, height:40}
    }
  });
}
var cont = 0;
function displayBronx() {
  directionsDisplay.setMap(null);
  $("#newTable tr").remove();
	for (var i = 0; i < boroughs["Bronx"].length ; i++) {
		var row = table.insertRow();
    row.id = i+1;
		var cell = row.insertCell(0);
		cell.innerHTML = boroughs["Bronx"][i];
	}
	button.style.visibility = "visible";
  var dibujo = new google.maps.Polygon();
  function bounds(coords) {
    dibujo = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }

  $("#1").hover(function() {
    cont = 0;
    bounds(dist[12]);
    dibujo.setMap(map);
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#1").on("click", function() {
    directionsDisplay.setMap(null);
    route(12, 0);
  });
  $("#2").hover(function() {
    cont = 0;
    bounds(dist[13]);
    dibujo.setMap(map);
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#2").on("click", function() {
    directionsDisplay.setMap(null);
    route(13, 0);
  });
  $("#3").hover(function() {
    cont = 0;
    bounds(dist[14]);
    dibujo.setMap(map);
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#3").on("click", function() {
    directionsDisplay.setMap(null);
    route(14, 0);
  });
  $("#4").hover(function() {
    bounds(dist[15]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#4").on("click", function() {
    directionsDisplay.setMap(null);
    route(15, 0);
  });
  $("#5").hover(function() {
    bounds(dist[16]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#5").on("click", function() {
    directionsDisplay.setMap(null);
    route(16, 0);
  });
  $("#6").hover(function() {
    bounds(dist[17]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#6").on("click", function() {
    directionsDisplay.setMap(null);
    route(17, 0);
  });
  $("#7").hover(function() {
    bounds(dist[18]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#7").on("click", function() {
    directionsDisplay.setMap(null);
    route(18, 0);
  });
  $("#8").hover(function() {
    bounds(dist[19]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#8").on("click", function() {
    directionsDisplay.setMap(null);
    route(19, 0);
  });
  $("#9").hover(function() {
    bounds(dist[20]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#9").on("click", function() {
    directionsDisplay.setMap(null);
    route(20, 0);
  });
  $("#10").hover(function() {
    bounds(dist[21]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#10").on("click", function() {
    directionsDisplay.setMap(null);
    route(21, 0);
  });
  $("#11").hover(function() {
    bounds(dist[22]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#11").on("click", function() {
    directionsDisplay.setMap(null);
    route(22, 0);
  });
  $("#12").hover(function() {
    bounds(dist[23]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#12").on("click", function() {
    directionsDisplay.setMap(null);
    route(23, 0);
  });
}
function displayBrooklyn() {
  directionsDisplay.setMap(null);
  $("#newTable tr").remove();
	for (var i = 0; i < boroughs["Brooklyn"].length ; i++) {
		var row = table.insertRow();
    row.id = i+1;
		var cell = row.insertCell(0);
		cell.innerHTML = boroughs["Brooklyn"][i];
	}
	button.style.visibility = "visible";
  var dibujo = new google.maps.Polygon();
  function bounds(coords) {
    dibujo = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }
  $("#1").hover(function() {
    bounds(dist[24]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#1").on("click", function() {
    directionsDisplay.setMap(null);
    route(24, 0);
  });
  $("#2").hover(function() {
    bounds(dist[25]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#2").on("click", function() {
    directionsDisplay.setMap(null);
    route(25, 0);
  });
  $("#3").hover(function() {
    bounds(dist[26]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#3").on("click", function() {
    directionsDisplay.setMap(null);
    route(26, 0);
  });
  $("#4").hover(function() {
    bounds(dist[27]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#4").on("click", function() {
    directionsDisplay.setMap(null);
    route(27, 0);
  });
  $("#5").hover(function() {
    bounds(dist[28]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#5").on("click", function() {
    directionsDisplay.setMap(null);
    route(28, 0);
  });
  $("#6").hover(function() {
    bounds(dist[29]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#6").on("click", function() {
    directionsDisplay.setMap(null);
    route(29, 0);
  });
  $("#7").hover(function() {
    bounds(dist[30]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#7").on("click", function() {
    directionsDisplay.setMap(null);
    route(30, 0);
  });
  $("#8").hover(function() {
    bounds(dist[31]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#8").on("click", function() {
    directionsDisplay.setMap(null);
    route(31, 0);
  });
  $("#9").hover(function() {
    bounds(dist[32]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#9").on("click", function() {
    directionsDisplay.setMap(null);
    route(32, 0);
  });
  $("#10").hover(function() {
    bounds(dist[33]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#10").on("click", function() {
    directionsDisplay.setMap(null);
    route(33, 0);
  });
  $("#11").hover(function() {
    bounds(dist[34]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#11").on("click", function() {
    directionsDisplay.setMap(null);
    route(34, 0);
  });
  $("#12").hover(function() {
    bounds(dist[35]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#12").on("click", function() {
    directionsDisplay.setMap(null);
    route(35, 0);
  });
  $("#13").hover(function() {
    bounds(dist[36]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#13").on("click", function() {
    directionsDisplay.setMap(null);
    route(36, 0);
  });
  $("#14").hover(function() {
    bounds(dist[37]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#14").on("click", function() {
    directionsDisplay.setMap(null);
    route(37, 0);
  });
  $("#15").hover(function() {
    bounds(dist[38]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#15").on("click", function() {
    directionsDisplay.setMap(null);
    route(38, 0);
  });
  $("#16").hover(function() {
    bounds(dist[39]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#16").on("click", function() {
    directionsDisplay.setMap(null);
    route(39, 0);
  });
  $("#17").hover(function() {
    bounds(dist[40]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#17").on("click", function() {
    directionsDisplay.setMap(null);
    route(40, 0);
  });
  $("#18").hover(function() {
    bounds(dist[41]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#18").on("click", function() {
    directionsDisplay.setMap(null);
    route(41, 0);
  });
}
function displayManhattan() {
  directionsDisplay.setMap(null);
  $("#newTable tr").remove();
	for (var i = 0; i < boroughs["Manhattan"].length ; i++) {
		var row = table.insertRow();
    row.id = i+1;
		var cell = row.insertCell(0);
		cell.innerHTML = boroughs["Manhattan"][i];
	}
	button.style.visibility = "visible";
  var dibujo = new google.maps.Polygon();
  function bounds(coords) {
    dibujo = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }

  $("#1").hover(function() {
    bounds(dist[0]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#1").on("click", function() {
    directionsDisplay.setMap(null);
    route(0, 0);
  });
  $("#2").hover(function() {
    bounds(dist[1]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#2").on("click", function() {
    directionsDisplay.setMap(null);
    route(1, 0);
  });
  $("#3").hover(function() {
    bounds(dist[2]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#3").on("click", function() {
    directionsDisplay.setMap(null);
    route(2, 0);
  });
  $("#4").hover(function() {
    bounds(dist[3]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#4").on("click", function() {
    directionsDisplay.setMap(null);
    route(3, 0);
  });
  $("#5").hover(function() {
    bounds(dist[4]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#5").on("click", function() {
    directionsDisplay.setMap(null);
    route(4, 0);
  });
  $("#6").hover(function() {
    bounds(dist[5]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#6").on("click", function() {
    directionsDisplay.setMap(null);
    route(5, 0);
  });
  $("#7").hover(function() {
    bounds(dist[6]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#7").on("click", function() {
    directionsDisplay.setMap(null);
    route(6, 0);
  });
  $("#8").hover(function() {
    bounds(dist[7]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#8").on("click", function() {
    directionsDisplay.setMap(null);
    route(7, 0);
  });
  $("#9").hover(function() {
    bounds(dist[8]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#9").on("click", function() {
    directionsDisplay.setMap(null);
    route(8, 0);
  });
  $("#10").hover(function() {
    bounds(dist[9]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#10").on("click", function() {
    directionsDisplay.setMap(null);
    route(9, 0);
  });
  $("#11").hover(function() {
    bounds(dist[10]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#11").on("click", function() {
    directionsDisplay.setMap(null);
    route(10, 0);
  });
  $("#12").hover(function() {
    bounds(dist[11]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#12").on("click", function() {
    directionsDisplay.setMap(null);
    route(11, 0);
  });
}
function displayQueens() {
  directionsDisplay.setMap(null);
  $("#newTable tr").remove();
	for (var i = 0; i < boroughs["Queens"].length ; i++) {
		var row = table.insertRow();
    row.id = i+1;
		var cell = row.insertCell(0);
		cell.innerHTML = boroughs["Queens"][i];
	}
	button.style.visibility = "visible";
  var dibujo = new google.maps.Polygon();
  function bounds(coords) {
    dibujo = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }

  $("#1").hover(function() {
    bounds(dist[42]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#1").on("click", function() {
    directionsDisplay.setMap(null);
    route(42, 0);
  });
  $("#2").hover(function() {
    bounds(dist[43]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#2").on("click", function() {
    directionsDisplay.setMap(null);
    route(43, 0);
  });
  $("#3").hover(function() {
    bounds(dist[44]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#3").on("click", function() {
    directionsDisplay.setMap(null);
    route(44, 0);
  });
  $("#4").hover(function() {
    bounds(dist[45]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#4").on("click", function() {
    directionsDisplay.setMap(null);
    route(45, 0);
  });
  $("#5").hover(function() {
    bounds(dist[46]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#5").on("click", function() {
    directionsDisplay.setMap(null);
    route(46, 0);
  });
  $("#6").hover(function() {
    bounds(dist[47]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#6").on("click", function() {
    directionsDisplay.setMap(null);
    route(47, 0);
  });
  $("#7").hover(function() {
    bounds(dist[48]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#7").on("click", function() {
    directionsDisplay.setMap(null);
    route(48, 0);
  });
  $("#8").hover(function() {
    bounds(dist[49]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#8").on("click", function() {
    directionsDisplay.setMap(null);
    route(49, 0);
  });
  $("#9").hover(function() {
    bounds(dist[50]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#9").on("click", function() {
    directionsDisplay.setMap(null);
    route(50, 0);
  });
  $("#10").hover(function() {
    bounds(dist[51]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#10").on("click", function() {
    directionsDisplay.setMap(null);
    route(51, 0);
  });
  $("#11").hover(function() {
    bounds(dist[52]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#11").on("click", function() {
    directionsDisplay.setMap(null);
    route(52, 0);
  });
  $("#12").hover(function() {
    bounds(dist[53]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#12").on("click", function() {
    directionsDisplay.setMap(null);
    route(53, 0);
  });
  $("#13").hover(function() {
    bounds(dist[54]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#13").on("click", function() {
    directionsDisplay.setMap(null);
    route(54, 0);
  });
  $("#14").hover(function() {
    bounds(dist[55]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#14").on("click", function() {
    directionsDisplay.setMap(null);
    route(55, 0);
  });
}
function displayStaten() {
  directionsDisplay.setMap(null);
  $("#newTable tr").remove();
	for (var i = 0; i < boroughs["Staten"].length ; i++) {
		var row = table.insertRow();
    row.id = i+1;
		var cell = row.insertCell(0);
		cell.innerHTML = boroughs["Staten"][i];
	}
	button.style.visibility = "visible";
  var dibujo = new google.maps.Polygon();
  function bounds(coords) {
    dibujo = new google.maps.Polygon({
      paths: coords,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });
  }

  $("#1").hover(function() {
    bounds(dist[56]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#1").on("click", function() {
    directionsDisplay.setMap(null);
    route(56, 0);
  });
  $("#2").hover(function() {
    bounds(dist[57]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#2").on("click", function() {
    directionsDisplay.setMap(null);
    route(57, 0);
  });
  $("#3").hover(function() {
    bounds(dist[58]);
    dibujo.setMap(map);
    cont = 0;
    for (var i = 0; i < neighNames.length; i++) {
      if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng(neighNames[i].latlon.lat,neighNames[i].latlon.lng), dibujo)){
        makeMarker(i, cont);
        cont++;
      }
    }
  }, function() {
    dibujo.setMap(null);
    for (var j = 0; j < marker.length; j++) {
      marker[j].setVisible(false);
    }
    marker = [];
  });
  $("#3").on("click", function() {
    directionsDisplay.setMap(null);
    route(58, 0);
  });
}
//-----------------Show the crimes in the map and in the chart, and show the housing in the boroughs---------------------------------------------------------------------------------------------
var color;
var circles = [];
function crimesBronx() {
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var i = 0; i < 500; i++) {
    if (allCenters[0].level[i] == "FELONY") {
      color = '#FF0000'
    }else if (allCenters[0].level[i] == "MISDEMEANOR") {
      color = '#FF4D00'
    }else {
      color = '#FFFF00'
    }
    circles[i] = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: allCenters[0].centers[i],
      radius: 40
    });
  }
  chart(0);
}
function housingBronx() {
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  cont = 0;
  for (var i = 0; i < housingSites.length; i++) {
    if (housingSites[i].borough == "Bronx") {
      makeHouse(i, cont);
      cont++;
    }
  }
}
function aspectsBronx() {
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  svg.selectAll("*").remove();
  var aspTable = document.getElementById("aspects");
	var row = aspTable.insertRow();
  row.id = 21;
	var cell = row.insertCell(0);
	cell.innerHTML = "Crimes";

  row = aspTable.insertRow();
  row.id = 22;
  cell = row.insertCell(0);
  cell.innerHTML = "Housing";

  $("#21").on("click", crimesBronx);
  $("#22").on("click", housingBronx);
}
function crimesBrooklyn() {
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var i = 0; i < 500; i++) {
    if (allCenters[1].level[i] == "FELONY") {
      color = '#FF0000'
    }else if (allCenters[1].level[i] == "MISDEMEANOR") {
      color = '#FF4D00'
    }else {
      color = '#FFFF00'
    }
    circles[i] = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: allCenters[1].centers[i],
      radius: 40
    });
  }
  chart(1);
}
function housingBrooklyn() {
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  cont = 0;
  for (var i = 0; i < housingSites.length; i++) {
    if (housingSites[i].borough == "Brooklyn") {
      makeHouse(i, cont);
      cont++;
    }
  }
}
function aspectsBrooklyn() {
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  svg.selectAll("*").remove();
  var aspTable = document.getElementById("aspects");
	var row = aspTable.insertRow();
  row.id = 21;
	var cell = row.insertCell(0);
	cell.innerHTML = "Crimes";

  row = aspTable.insertRow();
  row.id = 22;
  cell = row.insertCell(0);
  cell.innerHTML = "Housing";

  $("#21").on("click", crimesBrooklyn);
  $("#22").on("click", housingBrooklyn);
}
function crimesManhattan() {
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var i = 0; i < 500; i++) {
    if (allCenters[2].level[i] == "FELONY") {
      color = '#FF0000'
    }else if (allCenters[2].level[i] == "MISDEMEANOR") {
      color = '#FF4D00'
    }else {
      color = '#FFFF00'
    }
    circles[i] = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: allCenters[2].centers[i],
      radius: 40
    });
  }
  chart(2);
}
function housingManhattan() {
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  cont = 0;
  for (var i = 0; i < housingSites.length; i++) {
    if (housingSites[i].borough == "Manhattan") {
      makeHouse(i, cont);
      cont++;
    }
  }
}
function aspectsManhattan() {
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  svg.selectAll("*").remove();
  var aspTable = document.getElementById("aspects");
	var row = aspTable.insertRow();
  row.id = 21;
	var cell = row.insertCell(0);
	cell.innerHTML = "Crimes";

  row = aspTable.insertRow();
  row.id = 22;
  cell = row.insertCell(0);
  cell.innerHTML = "Housing";

  $("#21").on("click", crimesManhattan);
  $("#22").on("click", housingManhattan);
}
function crimesQueens() {
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var i = 0; i < 500; i++) {
    if (allCenters[3].level[i] == "FELONY") {
      color = '#FF0000'
    }else if (allCenters[3].level[i] == "MISDEMEANOR") {
      color = '#FF4D00'
    }else {
      color = '#FFFF00'
    }
    circles[i] = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: allCenters[3].centers[i],
      radius: 40
    });
  }
  chart(3);
}
function housingQueens() {
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  cont = 0;
  for (var i = 0; i < housingSites.length; i++) {
    if (housingSites[i].borough == "Queens") {
      makeHouse(i, cont);
      cont++;
    }
  }
}
function aspectsQueens() {
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  svg.selectAll("*").remove();
  var aspTable = document.getElementById("aspects");
	var row = aspTable.insertRow();
  row.id = 21;
	var cell = row.insertCell(0);
	cell.innerHTML = "Crimes";

  row = aspTable.insertRow();
  row.id = 22;
  cell = row.insertCell(0);
  cell.innerHTML = "Housing";

  $("#21").on("click", crimesQueens);
  $("#22").on("click", housingQueens);
}
function crimesStaten() {
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var i = 0; i < 500; i++) {
    if (allCenters[4].level[i] == "FELONY") {
      color = '#FF0000'
    }else if (allCenters[4].level[i] == "MISDEMEANOR") {
      color = '#FF4D00'
    }else {
      color = '#FFFF00'
    }
    circles[i] = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: map,
      center: allCenters[4].centers[i],
      radius: 40
    });
  }
  chart(4);
}
function housingStaten() {
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  cont = 0;
  for (var i = 0; i < housingSites.length; i++) {
    if (housingSites[i].borough == "Staten") {
      makeHouse(i, cont);
      cont++;
    }
  }
}
function aspectsStaten() {
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  svg.selectAll("*").remove();
  var aspTable = document.getElementById("aspects");
	var row = aspTable.insertRow();
  row.id = 21;
	var cell = row.insertCell(0);
	cell.innerHTML = "Crimes";

  row = aspTable.insertRow();
  row.id = 22;
  cell = row.insertCell(0);
  cell.innerHTML = "Wasn't found available housing in Staten Island";

  $("#21").on("click", crimesStaten);
  $("#22").on("click", housingStaten);
}
var svg = d3.select("svg");
function chart(num) {
  svg.selectAll("*").remove();
    margin = {top: 10, right: 20, bottom: 30, left: 30};
    width  = 1200- margin.right - margin.left;
    height = 400- margin.top - margin.bottom;
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");

    var x = d3.scaleTime()
  		.rangeRound([0, width]);

  	var y = d3.scaleLinear()
  		.rangeRound([height, 0]);

    var line = d3.line()
  		.x(function(data) { return x(data.date); })
  		.y(function(data) { return y(data.close); })

  	var data = dataChart[num].map(function(data){
  		return{
  			date: parseTime(data[0]),
  			close: parseFloat(data[1])
  		};
  	});
  	x.domain(d3.extent(data, function(d) {return d.date; }));
  	y.domain(d3.extent(data, function(d) {return d.close; }));

    g.append("g")
  		.attr("transform", "translate(0," + height + ")")
  		.call(d3.axisBottom(x));

  	g.append("g")
  		.call(d3.axisLeft(y))
  		.append("text")
  		.attr("fill", "#000")
  		.attr("transform", "rotate(-90)")
  		.attr("y", 6)
  		.attr("dy" , "0.7em")
  		.text("Crimes on December, 2016")

    g.append("path")
  		.datum(data)
  		.attr("fill", "none")
  		.attr("stroke", "steelblue")
  		.attr("stroke-width", 1.5)
  		.attr("d", line);
}
//-----------------Center of the districts---------------------------------------------------------------------------------------------
var distCenter = [];
function districtsCenters() {
  var latMayor;
  var latMenor;
  var lngMayor;
  var lngMenor;
  var lat;
  var lng;
  for (var i = 0; i < dist.length; i++) {
    //Multiplygon
    if (dist[i].length < 25) {
      var mayor = dist[i][0];
      for (var j = 1; j < dist[i].length; j++) {
        if (dist[i][j].length > mayor.length) {
          mayor = dist[i][j];
        }
      }
      latMayor = mayor[0].lat;
      latMenor = mayor[0].lat;
      lngMayor = mayor[0].lng;
      lngMenor = mayor[0].lng;
      for (var k = 1; k < mayor.length; k++) {
        //latitude
        if (mayor[k].lat > latMayor) {
          latMayor = mayor[k].lat;
        }else if (mayor[k].lat < latMenor) {
          latMenor = mayor[k].lat;
        }
        //longitude
        if (mayor[k].lng < lngMenor) {
          lngMenor = mayor[k].lng;
        }else if (mayor[k].lng > lngMayor) {
          lngMayor = mayor[k].lng;
        }
      }
      lat = (latMayor+latMenor)/2;
      lng = (lngMayor+lngMenor)/2;
      distCenter[i] = {lat: lat, lng: lng};
    }else{//Polygon
      latMayor = dist[i][0].lat;
      latMenor = dist[i][0].lat;
      lngMayor = dist[i][0].lng;
      lngMenor = dist[i][0].lng;
      for (var j = 1; j < dist[i].length; j++) {
        //latitude
        if (dist[i][j].lat > latMayor) {
          latMayor = dist[i][j].lat;
        }else if (dist[i][j].lat < latMenor) {
          latMenor = dist[i][j].lat;
        }
        //longitude
        if (dist[i][j].lng < lngMenor) {
          lngMenor = dist[i][j].lng;
        }else if (dist[i][j].lng > lngMayor) {
          lngMayor = dist[i][j].lng;
        }
      }
      lat = (latMayor+latMenor)/2;
      lng = (lngMayor+lngMenor)/2;
      distCenter[i] = {lat: lat, lng: lng};
      //console.log(distCenter[i]);
    }
  }
}
//-----------------Route from the center of the district to de NYU---------------------------------------------------------------------------------------------
var distance = [];
function route(num, ranking) {
  var cont = num;
  if (cont < 59) {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    directionsService.route({
      origin: distCenter[num],
      destination: { lat: 40.7291, lng: -73.9965 },
      travelMode: 'WALKING',
      unitSystem: google.maps.UnitSystem.METRIC
    },function(result, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(result);
        distance[num] = {num: num, dis: result.routes[0].legs[0].distance.value/1000};
        if (ranking == 1) {
          console.log(num + " - " + status);
          cont++;
          wait(850);
          route(cont, 1);
        }
      }
    });
    if (ranking == 0) {
      directionsDisplay.setMap(map);
    }
  }else {
    topDistance();
  }
}
//-----------------Array that contains the number of the district asociate with the name of the borough---------------------------------------------------------------------------------------------
var distName = [];
function districtsNames() {
  for (var i = 0; i < 59; i++) {
    distance[i] = {num: i, dis: 20};
  }
  for (var i = 0; i < dist.length; i++) {
    if (i < 12) {
      distName[i] = "Manhattan - " + (i+1);
    }else if (i < 24) {
      distName[i] = "Bronx - " + (i-11);
    }else if (i < 42) {
      distName[i] = "Brooklyn - " + (i-23);
    }else if (i < 56) {
      distName[i] = "Queens - " + (i-41);
    }else {
      distName[i] = "Staten Island - " + (i-55);
    }
  }
}
//-----------------Top 10 Distance---------------------------------------------------------------------------------------------
function topDistance() {
  var temp;
  console.log(distance);
  for (var i = 1; i < distance.length; i++) {
    for (var j = i; j > 0; j--) {
      if (distance[j].dis < distance[j-1].dis) {
        temp = distance[j-1].num;
        distance[j-1].num = distance[j].num;
        distance[j].num = temp;
        temp = distance[j-1].dis;
        distance[j-1].dis = distance[j].dis;
        distance[j].dis = temp;
      }else {
      break;
    }
    }
  }
  $("#processing").remove();
  var table=document.getElementById("topDistance");
  for (var i = 0; i < 10; i++) {
    var row = table.insertRow();
    var cell = row.insertCell(0);
    cell.innerHTML = i+1;
    var cell = row.insertCell(1);
    cell.innerHTML = distName[distance[i].num];
    var cell = row.insertCell(2);
    cell.innerHTML = distance[i].dis + "km";
  }
  window.scrollTo(0,document.body.scrollHeight);
  topAffordability();
}
//-----------------Top 10 Affordability--------------------------------------------------------------------------------------------
var afro = [];
function topAffordability() {
  var temp;
  var dibujo = new google.maps.Polygon();
  for (var i = 0; i < 59; i++) {
    dibujo = new google.maps.Polygon({
      paths: dist[i]
    });

    afro[i] = {num: i, value:0};
    for (var j = 0; j < housingSites.length; j++) {
      if ((google.maps.geometry.poly.containsLocation(new google.maps.LatLng(housingSites[j].latlon.lat,housingSites[j].latlon.lng), dibujo)) && (parseInt(housingSites[j].ExtLowInc) > afro[i].value)) {
          afro[i] = {num: i, value: parseInt(housingSites[j].ExtLowInc)};
      }
    }
    if (i > 0) {
      for (var k = i; k > 0; k--) {
        if (afro[k].value > afro[k-1].value) {
          temp = afro[k-1].value;
          afro[k-1].value = afro[k].value;
          afro[k].value = temp;
          temp = afro[k-1].num;
          afro[k-1].num = afro[k].num;
          afro[k].num = temp;
        }else {
          break;
        }
      }
    }
  }
  console.log(afro);
  $("#processing1").remove();
  var table=document.getElementById("topAffordability");
  for (var i = 0; i < 10; i++) {
    var row = table.insertRow();
    var cell = row.insertCell(0);
    cell.innerHTML = i+1;
    var cell = row.insertCell(1);
    cell.innerHTML = distName[afro[i].num];
    var cell = row.insertCell(2);
    cell.innerHTML = afro[i].value;
  }
  topSafety();
}
//-----------------Top 10 Safety--------------------------------------------------------------------------------------------
var safety = [];
function topSafety() {
  var temp;
  var dibujo = new google.maps.Polygon();
  for (var i = 0; i < 59; i++) {
    safety[i] = {num: i, crimes: 0}
  }
  for (var j = 0; j < 200; j++) {
    for (var i = 0; i < 12; i++) {
      dibujo = new google.maps.Polygon({
        paths: dist[i]
      });
      if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(allCenters[2].centers[j].lat,allCenters[2].centers[j].lng), dibujo)) {
          safety[i].crimes = safety[i].crimes + 1;
          break;
      }
    }
    for (var i = 12; i < 24; i++) {
      dibujo = new google.maps.Polygon({
        paths: dist[i]
      });
      if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(allCenters[0].centers[j].lat,allCenters[0].centers[j].lng), dibujo)) {
          safety[i].crimes = safety[i].crimes + 1;
          break;
      }
    }
    for (var i = 24; i < 42; i++) {
      dibujo = new google.maps.Polygon({
        paths: dist[i]
      });
      if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(allCenters[1].centers[j].lat,allCenters[1].centers[j].lng), dibujo)) {
          safety[i].crimes = safety[i].crimes + 1;
          break;
      }
    }
    for (var i = 42; i < 56; i++) {
      dibujo = new google.maps.Polygon({
        paths: dist[i]
      });
      if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(allCenters[3].centers[j].lat,allCenters[3].centers[j].lng), dibujo)) {
          safety[i].crimes = safety[i].crimes + 1;
          break;
      }
    }
    for (var i = 56; i < 59; i++) {
      dibujo = new google.maps.Polygon({
        paths: dist[i]
      });
      if (google.maps.geometry.poly.containsLocation(new google.maps.LatLng(allCenters[4].centers[j].lat,allCenters[4].centers[j].lng), dibujo)) {
          safety[i].crimes = safety[i].crimes + 1;
          break;
      }
    }
  }
  for (var i = 0; i < 59; i++) {
    if (i > 0) {
      for (var k = i; k > 0; k--) {
        if (safety[k].crimes < safety[k-1].crimes) {
          temp = safety[k-1].crimes;
          safety[k-1].crimes = safety[k].crimes;
          safety[k].crimes = temp;
          temp = safety[k-1].num;
          safety[k-1].num = safety[k].num;
          safety[k].num = temp;
        }else {
          break;
        }
      }
    }
  }

  console.log(safety);
  $("#processing2").remove();
  var table=document.getElementById("topSafety");
  for (var i = 0; i < 10; i++) {
    var row = table.insertRow();
    var cell = row.insertCell(0);
    cell.innerHTML = i+1;
    var cell = row.insertCell(1);
    cell.innerHTML = distName[safety[i].num];
    var cell = row.insertCell(2);
    cell.innerHTML = safety[i].crimes;
  }
  topthree();
}
//-----------------Top 3--------------------------------------------------------------------------------------------
var top3 = [];
function topthree() {
  var temp;
  for (var i = 0; i < distance.length; i++) {
    top3[distance[i].num] = {num: distance[i].num, total: i};
  }
  for (var i = 0; i < afro.length; i++) {
    top3[afro[i].num].total += i;
  }
  for (var i = 0; i < safety.length; i++) {
    top3[safety[i].num].total += i;
  }
  for (var i = 1; i < 59; i++) {
    for (var j = i; j > 0; j--) {
      console.log("i: " + i + " - j: " + j);
      if (top3[j].total < top3[j-1].total) {
        temp = top3[j-1].total;
        top3[j-1].total = top3[j].total;
        top3[j].total = temp;
        temp = top3[j-1].num;
        top3[j-1].num = top3[j].num;
        top3[j].num = temp;
      }else {
        break;
      }
    }
  }
  var table=document.getElementById("top3");
  for (var i = 0; i < 3; i++) {
    var row = table.insertRow();
    var cell = row.insertCell(0);
    cell.innerHTML = i+1;
    var cell = row.insertCell(1);
    cell.innerHTML = distName[top3[i].num];
  }

  console.log(top3);
}
//-----------------Export to csv file--------------------------------------------------------------------------------------------
var tmpColDelim;
var tmpRowDelim;
var rowDelim;
var colDelim;
function exportCsv($table, name) {
  var $headers = $table.find('tr:has(th)'),
      $rows = $table.find('tr:has(td)');
      colDelim = '","';
      rowDelim = '"\r\n"';
      tmpRowDelim = String.fromCharCode(0);
      tmpColDelim = String.fromCharCode(11);

      var csv = '"';
      csv += formatRows($headers.map(grabRow));
      csv += rowDelim;
      csv += formatRows($rows.map(grabRow)) + '"';

      var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);
      $(this).attr({
        'download': name,
        'href': csvData
      });
}
function formatRows(rows) {
  return rows.get().join(tmpRowDelim)
    .split(tmpRowDelim).join(rowDelim)
    .split(tmpColDelim).join(colDelim);
}
function grabRow(i,row){
    var $row = $(row);
    var $cols = $row.find('td');
    if(!$cols.length) $cols = $row.find('th');
    return $cols.map(grabCol)
      .get().join(tmpColDelim);
}
function grabCol(j,col){
   var $col = $(col),
       $text = $col.text();
   return $text.replace('"', '""'); // escape double quotes
}


var table1 = document.getElementById("topDistance");
var table2 = document.getElementById("topAffordability");
var table3 = document.getElementById("topSafety");
var table4 = document.getElementById("top3");
var link1 = document.getElementById("exportDistance");
var link2 = document.getElementById("exportAffro");
var link3 = document.getElementById("exportSafety");
var link4 = document.getElementById("export");
var title = document.getElementById("title");
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}
function hide() {
  $("#newTable tr").remove();
  $("#aspects tr").remove();
  for (var i in circles) {
    circles[i].setMap(null);
  }
  for (var j = 0; j < house.length; j++) {
    house[j].setVisible(false);
  }
  house = [];
  svg.selectAll("*").remove();
  directionsDisplay.setMap(null);
	button.style.visibility = "hidden";
}

$(document).ready(updateDistricts);
$(document).ready(updateCrimesBrx);
$(document).ready(updateNames);
$(document).ready(updateHousing);
$(document).ready( function() {
	button.style.visibility = "hidden";
	table1.style.visibility = "hidden";
	table2.style.visibility = "hidden";
	table3.style.visibility = "hidden";
	table4.style.visibility = "hidden";
	link1.style.visibility = "hidden";
	link2.style.visibility = "hidden";
	link3.style.visibility = "hidden";
	link4.style.visibility = "hidden";
	title.style.visibility = "hidden";
	$("#close").on("click", hide);
	$("#close").on("click", onNY);
	$("#T").on("click", onBronx);
	$("#T").on("click", displayBronx);
	$("#T").on("click", aspectsBronx);
  $("#B").on("click", onBrooklyn);
	$("#B").on("click", displayBrooklyn);
	$("#B").on("click", aspectsBrooklyn);
  $("#M").on("click", onManhattan);
	$("#M").on("click", displayManhattan);
	$("#M").on("click", aspectsManhattan);
  $("#Q").on("click", onQueens);
	$("#Q").on("click", displayQueens);
  $("#Q").on("click", aspectsQueens);
  $("#S").on("click", onStaten);
	$("#S").on("click", displayStaten);
	$("#S").on("click", aspectsStaten);
  $("#buttonDis").on("click", function() {
    route(0, 1);
    var row = table1.insertRow();
    row.id = "processing";
		var cell = row.insertCell(0);
		cell.innerHTML = "Processing...";
    var row = table2.insertRow();
    row.id = "processing1";
		var cell = row.insertCell(0);
		cell.innerHTML = "Processing...";
    var row = table3.insertRow();
    row.id = "processing2";
		var cell = row.insertCell(0);
		cell.innerHTML = "Processing...";
    window.scrollTo(0,document.body.scrollHeight);
    var button = document.getElementById("buttonDis");
    button.disabled = true;
    button.setAttribute('class', 'dis');
  	table1.style.visibility = "visible";
  	table2.style.visibility = "visible";
  	table3.style.visibility = "visible";
  	table4.style.visibility = "visible";
  	link1.style.visibility = "visible";
  	link2.style.visibility = "visible";
  	link3.style.visibility = "visible";
  	link4.style.visibility = "visible";
  	title.style.visibility = "visible";
  });
  $("#export").on("click", function() {
    var out = window.prompt("Name your file") || 'export';
    out = out.replace('.csv', '') + '.csv';
    exportCsv.apply(this, [$("#top3"), out]);
  });
  $("#exportSafety").on("click", function() {
    var out = window.prompt("Name your file") || 'export';
    out = out.replace('.csv', '') + '.csv';
    exportCsv.apply(this, [$("#topSafety"), out]);
  });
  $("#exportAffro").on("click", function() {
    var out = window.prompt("Name your file") || 'export';
    out = out.replace('.csv', '') + '.csv';
    exportCsv.apply(this, [$("#topAffordability"), out]);
  });
  $("#exportDistance").on("click", function() {
    var out = window.prompt("Name your file") || 'export';
    out = out.replace('.csv', '') + '.csv';
    exportCsv.apply(this, [$("#topDistance"), out]);
  });
})
