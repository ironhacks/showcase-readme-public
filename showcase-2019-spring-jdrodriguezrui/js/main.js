var criterioSelec = null;
var criterioSELECT = null;
var activeCriteria = false;
var districtVisualizationMode = false;
var focusedDistrict = null;

var totalDatasets = 9; //9 en total
var currLoadedDatasets = 0;

var districts = [];
/*
district = {
  borough : 'Borough'
  BoroCd : BorNumber+DistrictNumber
  polygon :
  polygCoords : 
  centerCoords :
  affordableUnits : *
  distanceToNyu : * !
  crimes : * !
  markets : *
  galleries : *
  subEntrances : *
  childCarePrograms : *
  housingRankPos : 
  distanceRankPos :
  safetyRankPos :
  tripleRankPos :
  marketsRankPos : 
  galleriesRankPos : 
  transportRankPos : 
  childcareRankPos : 
  housingLocations : 
  safetyLocations : 
  marketsLocations : 
  galleriesLocations : 
  transportLocations : 
  childcareLocations : 
  neighborhoods :[{location, name},{},{}]
}
*/

function updateLoadingState(){
  currLoadedDatasets++;
  var currentProgress = (currLoadedDatasets*100)/totalDatasets;
  $("#barraCarga").css("width", currentProgress + "%").attr("aria-valuenow",currentProgress).text(currentProgress.toFixed(2) +"%");
  if(currLoadedDatasets == totalDatasets){
    $( "#loader" ).fadeOut(400, function(){
    	$( "#content" ).fadeIn(400);
    }); 
    borDistrictBubbleChart(districts);    
    getRankings();
    //console.log(districts);
  }
}

function getDistrictByBoroCd(BoroCd){
  for(var i = 0;i<districts.length;i++){
    if(districts[i].BoroCd == BoroCd){
      return districts[i];
    }
  }
}

function getBorough(boroCd){
    if(boroCd<200){
    return 'Manhattan';
  }else if(boroCd<300){
    return 'Bronx';
  }else if(boroCd<400){
    return 'Brooklyn';
  }else if(boroCd<500){
    return 'Queens';
  }else{
    return 'Staten Island';
  }
}

function convertBorough(boroName){
  switch(boroName){
    case "BRONX":
      return 'Bronx';
    case "STATEN ISLAND":
      return 'Staten Island';
    case "QUEENS":
      return 'Queens';
    case "BROOKLYN":
      return 'Brooklyn';
    case "MANHATTAN":
      return 'Manhattan';
  }
}
function initDatasets(){
  
    //NY districts geoshapes  
    $.get("https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/ArcGIS/rest/services/NYC_Community_Districts/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson",                  function(response){  
      var geoshapes = JSON.parse(response);      
      //console.log(geoshapes);
      //push initial district objects into dictricts array
      for(var i=0 ; i<geoshapes.features.length;i++){
        var feat = geoshapes.features[i];
        //if district not habitable/valid for the hack, ignore it
        var invalidBorocd = [164,355,356,481,482,484,595,226,228,227,480,483];
        if(invalidBorocd.indexOf(feat.properties.BoroCD) !=-1){
           continue;
           }
           
        var newDistrict = {};
        newDistrict.BoroCd = feat.properties.BoroCD;
        newDistrict.borough = getBorough(newDistrict.BoroCd);
        if(feat.geometry.type == "Polygon"){
          //El arreglo guardado sera el de los puntos
          newDistrict.polygCoords = translateFromRawCoords(feat.geometry.coordinates[0]);
        }else{
          //El arreglo guardado sera de un elemento, y contendra un arreglo con varios arreglos de coordenadas,aka varios poligonos
          var auxArr = [];
          var containerArr = [];
          for(var j=0;j<feat.geometry.coordinates.length;j++){
            containerArr.push(translateFromRawCoords(feat.geometry.coordinates[j][0]));          
          }
          auxArr.push(containerArr);
          newDistrict.polygCoords = auxArr;
        }
        //District area and perimeter can be stored too         
        newDistrict.centerCoords = polygonCenter(newDistrict.polygCoords);
        districts.push(newDistrict);     
      }      
      initDistrictPolygons(districts);
      calcNeighborhoods(); //carga++
      calcDistrictsHousing(); //carga++
      calcDistrictsDistance(); //carga++
      calcCrimes(); //carga++
      calcMarkets(); //carga++
      calcGalleries(); //carga++
      calcPublicTransport(); //carga++
      calcChildCare(); //carga++
      updateLoadingState();
    });                      
       
  }

function calcNeighborhoods(){
  for(var x = 0;x<districts.length;x++){    
    districts[x].neighborhoods = [];
  }
   //Neighborhood Names GIS
    $.get("https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json",function(response){   
      //console.log(response);
      var data =  response.data;
      
      for(var i=0;i<data.length;i++){
        var bor = data[i][16];
        var neighName = data[i][10];
      	var auxStr = data[i][8].split("(")[1].split(" ");
      	var neighLng = parseFloat(auxStr[0]);
      	var neighLat = parseFloat(auxStr[1].split(")")[0]);      
      	for(var j=0;j<districts.length;j++){
      		if(bor == districts[j].borough){
          	 var location = new google.maps.LatLng(neighLat,neighLng);
        	if(google.maps.geometry.poly.containsLocation(location, districts[j].polygon)){            
          	districts[j].neighborhoods.push({location : location, name : neighName});
        		}
      		}
      	}      
    	}
      updateLoadingState();
  });
}


  function calcDistrictsHousing(){
  //inicializar affordableUnits
  for(var i = 0;i<districts.length;i++){
    districts[i].affordableUnits = 0;
    districts[i].housingLocations = [];
  }
    //New York Housing
  $.get("https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json",function(response){
    var data = response.data;
    //Para cada entrada
    for(var i = 0;i<data.length;i++){
      var dataBorough = data[i][15];
      var dataLat = data[i][23];
      var dataLng = data[i][24];
      var dataAffUnits = data[i][33];
      
      if(dataLat == null || dataLng == null || dataAffUnits == 0){
        //Si no hay coordenadas o unidades de vivienda, seguir con la siguiente pieza de datos
        continue;
      }
      //buscar en que distrito va, ayudarse del Borough
      for(var j = 0; j<districts.length;j++){
        if(districts[j].borough == dataBorough){
          //Coordenadas al interior del distrito?
          var location = new google.maps.LatLng(dataLat,dataLng);
       if(google.maps.geometry.poly.containsLocation(location, districts[j].polygon)){
            districts[j].affordableUnits += Number(dataAffUnits);
         		districts[j].housingLocations.push(location);
          }
        }
      }
    }
    //console.log("Housing calculated");
    updateLoadingState();
  });
}

function calcDistrictsDistance(){
  var NYUcoords;
  var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': "NYU Stern School of Business"}, function(results, status){
      if(status === 'OK' ){
        NYUcoords = results[0].geometry.location;
        for(var i=0;i<districts.length;i++){
          var distCenter =  districts[i].centerCoords;
          districts[i].distanceToNyu = google.maps.geometry.spherical.computeDistanceBetween(NYUcoords,distCenter).toFixed(2);
        }
      }
      //console.log("Distances calculated");
      updateLoadingState();
    });    
}

function calcCrimes(){
    for(var x=0;x<districts.length;x++){
    districts[x].crimes = 0;
    districts[x].safetyLocations = [];
    }
    $.get("https://data.cityofnewyork.us/resource/9s4h-37hy.json?$where=cmplnt_fr_dt%20between%20%272015-12-31T00:00:00%27%20and%20%272015-12-31T23:59:59%27", function(response){
      //console.log(response);
      var data = response;
      for(var i=0;i<data.length;i++){
        var borName = convertBorough(data[i].boro_nm);
        var crimeLat = parseFloat(data[i].latitude);
        var crimeLng = parseFloat(data[i].longitude);
        
        for(var j=0;j<districts.length;j++){
          if(districts[j].borough == borName){
            var location = new google.maps.LatLng(crimeLat,crimeLng);
   if(google.maps.geometry.poly.containsLocation(location, districts[j].polygon)){
              districts[j].crimes++;
     					districts[j].safetyLocations.push(location);
            }
        }
      }
    }
    //console.log("Crimes calculated");
    updateLoadingState();
    }); 
}

function calcMarkets(){
  for(var x = 0;x<districts.length;x++){
    districts[x].markets = 0;
    districts[x].marketsLocations = [];
  }
  $.get("https://data.ny.gov/resource/7jkw-gj56.json?$where=city%20in(%27New%20York%27,%27Manhattan%27,%27Bronx%27,%27Brooklyn%27,%27Queens%27)",function(response){
    var totalMarkets = 0;
    for(var i=0;i<response.length;i++){
      var marketLat = parseFloat(response[i].latitude);
      var marketLng = parseFloat(response[i].longitude);
      for(var j=0;j<districts.length;j++){
        var location = new google.maps.LatLng(marketLat,marketLng);
        if(google.maps.geometry.poly.containsLocation(location, districts[j].polygon)){
            districts[j].markets++;
          	districts[j].marketsLocations.push(location);
          totalMarkets++;
          }
      }
      
    }
    //console.log("Markets calculated: "+totalMarkets);
    updateLoadingState();
  });
}

function calcGalleries(){
  for(var x = 0;x<districts.length;x++){
    districts[x].galleries = 0;
    districts[x].galleriesLocations = [];
  }
  $.get("https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json",function(response){
    var data = response.data;
    var totalGalleries = 0;
    for(var i=0;i<data.length;i++){
      var auxStr = data[i][8].split("(")[1].split(" ");
      var galLng = parseFloat(auxStr[0]);
      var galLat = parseFloat(auxStr[1].split(")")[0]);      
      for(var j=0;j<districts.length;j++){
        var location = new google.maps.LatLng(galLat,galLng);
        if(google.maps.geometry.poly.containsLocation(location, districts[j].polygon)){
            districts[j].galleries++;
          	districts[j].galleriesLocations.push(location);
          totalGalleries++;
          }
      }      
    }
    //console.log("Galleries calculated: "+totalGalleries);
    updateLoadingState();
  });
}

function calcPublicTransport(){
  for(var x = 0;x<districts.length;x++){
    districts[x].subEntrances = 0;
    districts[x].transportLocations = [];
  }
  $.get("https://data.ny.gov/resource/hvwh-qtfg.json",function(response){    
    var totalEntr = 0;
    for(var i=0;i<response.length;i++){
      var entLat = parseFloat(response[i].entrance_latitude);
      var entLng = parseFloat(response[i].entrance_longitude);
      for(var j=0;j<districts.length;j++){
        var location = new google.maps.LatLng(entLat,entLng);
        if(google.maps.geometry.poly.containsLocation(location, districts[j].polygon)){
            districts[j].subEntrances++;
          	districts[j].transportLocations.push(location);
          totalEntr++;
          }
      }
      
    }
    //console.log("Entrances calculated: "+totalEntr);
    updateLoadingState();
  });
}

function calcChildCare(){
  for(var x = 0;x<districts.length;x++){
    districts[x].childCarePrograms = 0;
    districts[x].childcareLocations = [];
  }
  $.get("https://data.ny.gov/resource/mn9z-iqan.json?$where=facility_status%20like%20%27%25License%25%27%20and%20city%20in(%27New%20York%27,%27Manhattan%27,%27Bronx%27,%27Brooklyn%27,%27Queens%27)",function(response){
    //console.log(response);
    //Muy grande D:
    var data = response;
    var totalCares = 0;
    for(var i=0;i<data.length;i++){
        var borName = data[i].city;
        var careLat = parseFloat(data[i].latitude);
        var careLng = parseFloat(data[i].longitude);
        
        for(var j=0;j<districts.length;j++){
          if(districts[j].borough == borName){
            var location = new google.maps.LatLng(careLat,careLng); 
   if(google.maps.geometry.poly.containsLocation(location, districts[j].polygon)){
              districts[j].childCarePrograms++;
     					districts[j].childcareLocations.push(location);
     totalCares++;
            }
        }
      }
    }
    //console.log("Childcare Programs calculated : "+totalCares);
    updateLoadingState();
    });
  }

function initSelect(){
  $("#criteriaSelect").change(function(){
    criterioSELECT = $("#criteriaSelect").val();
    sortDistricts(criterioSELECT);
    
    var tableBody = $("#tableBody")[0];
    //Reiniciar la tabla
    while(tableBody.rows.length != 0){
      tableBody.deleteRow(0);
    }
    var newRow, district, borough, units, distance;
    var tableTitle = document.getElementById('tableTitle');
    var criteriaHeader = document.getElementById('critTableHeader');
    
    switch(criterioSELECT){
      case "housing":        
        fillTable("Districts sorted by housing","Number of Extremely low income units","affordableUnits");         
        break;
        
      case "distance":        
        //tabla
        fillTable("Districts sorted by distance to NYU","Meters","distanceToNyu");         
        break;
      
      case "safety":
        //tabla
        fillTable("Districts sorted by safety","Crimes","crimes");        
        break;
      case "triple":
        //tabla
        fillTable("Districts sorted by safety, housing and distance to NYU","3-Rank average","tripleRankPos");
        break;
      case "markets":
        fillTable("Districts sorted by number of Farmers' markets","Markets","markets");
        break;
      case "galleries":
        fillTable("Districts sorted by number of Art Galleries","Galleries","galleries");
        break;
       case "transport":
        fillTable("Districts sorted by number of Subway Entrances","Entrances","subEntrances");
        break;
        case "childcare":
        fillTable("Districts sorted by number of Child Care Regulated programs","Programs","childCarePrograms");
        break;
      default:
      
        break;
      }
    //drawByPosition(districts);
    criteriaBarChart(criterioSELECT,districts);
    });    
}

function initCSVBtn(){
  $("#csvBtn").click(function(){
    var fileName="export.csv",link,data;
    var tableBody = $("#tableBody")[0];
    var results = "";
    results+="Position,District,Borough,";
    results+= $("#critTableHeader").text() + "\n";
    for(var i=0;i<tableBody.rows.length;i++){
      results += tableBody.rows[i].cells[0].textContent + ",";
      results += tableBody.rows[i].cells[1].textContent + ",";
      results += tableBody.rows[i].cells[2].textContent + ",";
      results += tableBody.rows[i].cells[3].textContent + "\n";
    }
    results = 'data:text/csv;charset=utf-8,' + results;
    data = encodeURI(results);
    
    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', criterioSelec+"Export.csv");
    link.click();
  });
}

function sortDistricts(criteria){
  //To do, solo ordena el arreglo de distritos bajo un criterio con un switch
  switch(criteria){
      case "housing":
            //ordenar arreglo
        districts.sort(function(a,b){
          return (b.affordableUnits - a.affordableUnits);     
        });
        
        break;
        
      case "distance":
        districts.sort(function(a,b){
          return(a.distanceToNyu - b.distanceToNyu);
        });
        break;
      case "safety":
        districts.sort(function(a,b){
          return(a.crimes - b.crimes);
        });
        break;
    case "triple":      
        districts.sort(function(a,b){          
          return (a.tripleRankPos - b.tripleRankPos);
        });
      break;
    case "markets":
        districts.sort(function(a,b){
          return (b.markets-a.markets);
        });
      break;
     case "galleries":
        districts.sort(function(a,b){
          return (b.galleries-a.galleries);
        });
      break;
      case "transport":
        districts.sort(function(a,b){
          return (b.subEntrances-a.subEntrances);
        });
      break;
      case "childcare":
        districts.sort(function(a,b){
          return (b.childCarePrograms-a.childCarePrograms);
        });
      break;
      default:
      
        break;
    }
  
}

function fillTable(title,criteria,distProperty){
    var tableBody = $("#tableBody")[0];
    //Reiniciar la tabla
    while(tableBody.rows.length != 0){
      tableBody.deleteRow(0);
    }  
    var newRow, district, borough, units, distance,position;
    var tableTitle = document.getElementById('tableTitle');
    var criteriaHeader = document.getElementById('critTableHeader');
  	
    		tableTitle.textContent =title;
        criteriaHeader.textContent = criteria;
        //tabla
        for(var i=0;i<districts.length;i++){
          newRow= tableBody.insertRow(tableBody.rows.length);
          position = newRow.insertCell(0);
          district = newRow.insertCell(1);
          borough = newRow.insertCell(2);
          units = newRow.insertCell(3);

          position.innerHTML = '#'+(i+1);
          district.innerHTML = districts[i].BoroCd;
          borough.innerHTML = districts[i].borough;
          units.innerHTML = districts[i][distProperty];   
    }
}

function getRankings(){
  var i;
  var district;

  calculateRanking("housing");
  calculateRanking("distance");
  calculateRanking("safety");
  calculateRanking("markets");
  calculateRanking("galleries");
  calculateRanking("transport");
  calculateRanking("childcare");
  //Calculate promedium rank
  for(i=0;i<districts.length;i++){
    district = districts[i];
    district.tripleRankPos = ((district.distanceRankPos + district.safetyRankPos + district.housingRankPos)/3).toFixed(1);
  }
  //console.log("Rankings calculated");
}

function calculateRanking(criteria){
  var i;
  var district;
  var property = criteria+"RankPos";
  sortDistricts(criteria);
  for(i=0;i<districts.length;i++){
    districts[i][property] = i+1;
  }
}

function criteriaBtnFunc(criteria,button){
  
  if(activeCriteria && criterioSelec == criteria){
  $(button).removeClass('pressedColoredBtn').addClass('coloredBtn');
    this.active = false; 
    activeCriteria = false;
    criterioSelec = null;
    if(districtVisualizationMode){
      //Borrarle los marcadores del criterio
      drawCritMarkers(focusedDistrict,criterioSelec);
    }else{
      //dibujar otra vez todos los distritos
    drawDefault(districts);
    }        
  }else{
  $('.crit').removeClass('pressedColoredBtn').addClass('coloredBtn');    $(button).removeClass('coloredBtn').addClass('pressedColoredBtn');
    criterioSelec = criteria;
    this.active = true;
    activeCriteria = true;
    sortDistricts(criteria);
    if(districtVisualizationMode){
      //Dibujarle los marcadores del criterio
      drawCritMarkers(focusedDistrict,criterioSelec);
    }else{
      drawByPosition(districts);        
    }
  }         
}

function initUI(){  

   $(".navbar").hide();
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() > $(window).height()) 											{
            	$('.navbar').fadeIn();
            } else {
            	$('.navbar').fadeOut();
            }
        });
      
      $("#housBtn").click(function (){
        criteriaBtnFunc("housing",this);
      });
      
      $("#distBtn").click(function (){
        criteriaBtnFunc("distance",this);
      });
      $("#triplBtn").click(function (){
        criteriaBtnFunc("triple",this);
      });
      $("#safBtn").click(function (){
        criteriaBtnFunc("safety",this);        
      });
      $("#markBtn").click(function (){
        criteriaBtnFunc("markets",this);        
      });
      $("#transpBtn").click(function (){
        criteriaBtnFunc("transport",this); 
      });
      
      $("#childBtn").click(function (){
        criteriaBtnFunc("childcare",this);
      });
      
      $("#galBtn").click(function (){
        criteriaBtnFunc("galleries",this);
      });
	});
  $( "#districtDetailTab" ).fadeOut(400);
  
  //test
  $("#testBtn").click(function (){
    var detTab = $( "#districtDetailTab");
    var mapCont = $("#googleMapContainer");
    
    detTab.fadeOut(0);
    mapCont.removeClass("col-md-8").addClass("col-md-12");
    detTab.removeClass("col-md-4");
    districtVisualizationMode = false; 
    focusedDistrict.polygon.isFocused = false;
    focusedDistrict = null;
    window.location.href = '#mapSection';
    refocusMap(districts,criterioSelec);
    eraseCritMarkers();
  });
}

function distClick(boroCd,polygClicked){
  if(polygClicked.isFocused == true){
      	  polygClicked.isFocused = false;
      	}else{
      	  polygClicked.isFocused = true;
      	}
  
  var dist = getDistrictByBoroCd(boroCd);
  showDistrictDetails(dist);
  var detTab = $( "#districtDetailTab");
    var mapCont = $("#googleMapContainer");
    if(!districtVisualizationMode){
      mapCont.removeClass("col-md-12").addClass("col-md-8");
    detTab.addClass("col-md-4");
    
    detTab.fadeIn(0);
      focusDistrict(dist,districts,criterioSelec);
      districtVisualizationMode = true;
      focusedDistrict = dist;
      showDistrictDetails(dist);
      drawCritMarkers(focusedDistrict,criterioSelec);
    }else{
      detTab.fadeOut(0);
      mapCont.removeClass("col-md-8").addClass("col-md-12");
    detTab.removeClass("col-md-4");
    districtVisualizationMode = false;
      focusedDistrict = null;
    window.location.href = '#mapSection';
    refocusMap(districts,criterioSelec);
      eraseCritMarkers();
    }  
}

function showDistrictDetails(district){
  districtRadarChart(district);
  //Texto de los detalles
  document.getElementById("distanceCell").textContent = "Distance to NYU: "+district.distanceToNyu+"m";
  document.getElementById("housingCell").textContent = "Affordable units: "+district.affordableUnits;
  document.getElementById("safetyCell").textContent = "Crimes: "+district.crimes;
  document.getElementById("marketsCell").textContent = "Farmers' markets: "+district.markets;
  document.getElementById("galleriesCell").textContent = "Art galleries: "+district.galleries;
  document.getElementById("childcareCell").textContent = "Childcare programs: "+district.childCarePrograms;
  document.getElementById("transportCell").textContent = "Subway entrances: "+district.subEntrances;
}

function initCreditsBtn(){
  $("#navCredBut").click(function(){
    alert("Icons made by Smashicons from www.flaticon.com is licensed by CC 3.0 BY "+" Icons made by Gregor Cresnar from www.flaticon.com is licensed by CC 3.0 BY");
  });
}
 $(document).ready( function(){
    initUI();
    initDatasets();
    initSelect();
   	initCSVBtn();
   	initCreditsBtn();
  });
