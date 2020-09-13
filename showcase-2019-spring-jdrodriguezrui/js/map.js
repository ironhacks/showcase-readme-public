var map;
var geocoder;
var NYUmarker;
var testPolygon;
var districtMarkers = [];
var criteriaMarkers = [];
var heatmapDrawn = false;
var heatmap;
var positiveGradient = [
  'rgba(0, 255, 255, 0)',
  "#FF840D",
  "#FFBD0D",
  "#FFF50D",
  "#0DFF63",
  "#5AFF00",
  "#00FFFF"
];

var initialCenter = {lat: 40.7291, lng: -73.9965};
var initialZoom = 10;
var focusedDistrict;
var customIcon = {};

  function onGoogleMapResponse(){
    map = new google.maps.Map(document.getElementById('googleMapContainer'), {
      center: initialCenter,
      zoom: initialZoom,
      streetViewControl: false,
  		rotateControl: false,
      mapTypeControl: false,
      styles : [
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
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
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
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
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
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
    "featureType": "water",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]
    });
    //NYU school of business marker 
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': "NYU Stern School of Business"}, function(results, status) {
          if (status === 'OK') {          
            NYUmarker = new google.maps.Marker({
              map: map,
              label: 'NYU',
              position: results[0].geometry.location,
              title: 'NYU Stern School of Business',
              opacity:0.75,
              animation: google.maps.Animation.DROP
            });
          }
        });    
    
    customIcon.transport = {
    url: "https://maps.google.com/mapfiles/ms/micons/subway.png", // url
    scaledSize: new google.maps.Size(20, 20),
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(10, 10)
		};
    
    customIcon.housing = {
    url: "https://maps.google.com/mapfiles/ms/micons/realestate.png", // url
    scaledSize: new google.maps.Size(20, 20),
    origin: new google.maps.Point(0,0), 
    anchor: new google.maps.Point(10, 20)
    };
    
    customIcon.galleries = {
      url: "https://maps.google.com/mapfiles/ms/micons/arts.png", 
    scaledSize: new google.maps.Size(20, 20), 
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(10, 10) 
    };
    
     customIcon.markets = {
      url: "https://maps.google.com/mapfiles/ms/micons/convienancestore.png", 
    scaledSize: new google.maps.Size(20, 20), 
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(10, 10) 
    };
    customIcon.safety = {
    url: "https://maps.google.com/mapfiles/ms/micons/caution.png", 
    scaledSize: new google.maps.Size(20, 20), 
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(10, 10)
    };
    customIcon.childcare = {
    url : 'https://maps.google.com/mapfiles/ms/micons/sunny.png',
    scaledSize: new google.maps.Size(15, 15), 
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(7, 7)
    };
    
    customIcon.questionMark = {
      url: "https://maps.google.com/mapfiles/ms/micons/question.png", 
    scaledSize: new google.maps.Size(40, 40), 
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(20, 20)
    };
    
    customIcon.infoMark = {
      url: "https://maps.google.com/mapfiles/ms/micons/info.png", 
    scaledSize: new google.maps.Size(40, 40), 
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(20, 20)
    };
    customIcon.neighMark = {
      url: "https://maps.google.com/mapfiles/ms/micons/orange-dot.png", 
    scaledSize: new google.maps.Size(20, 20), 
    origin: new google.maps.Point(0,0),
    anchor: new google.maps.Point(10, 20)
    };
    
    
  }

	function initDistrictPolygons(districtArray){
    var distCount = 0;
    //for each district
    for(var i = 0;i<districtArray.length;i++){
      
      var dist = districtArray[i];
      var borColor = getInitialBorColor(dist.BoroCd);
			var polygCoords;      
      
      if(dist.polygCoords.length == 1){
        //Multipolygon for the district, multiple paths
        polygCoords = dist.polygCoords[0];
      }else{
        polygCoords = dist.polygCoords;
      }
        var districtPolyg = new google.maps.Polygon({
            paths: polygCoords,
            strokeColor: borColor,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: borColor,
            fillOpacity: 0.35
          });      
        districtPolyg.setMap(map);
            //provisional, para averiguar que BoroCD tienen los distritos a usar en el hack
      districtPolyg.BoroCD = dist.BoroCd;
      //Auxiliar para dibujar/ocultar poligono
      districtPolyg.isDrawn = true;
      districtPolyg.isFocused = false;
      //Listeners
      var infoWindow = new google.maps.InfoWindow({
    content: districtPolyg.BoroCD+"",
    position : dist.centerCoords
  });
        districtPolyg.addListener('mouseover',function(){
          if(this.isDrawn == false)return;
          if(this.isFocused == true)return;
          this.setOptions({fillOpacity : 0.1});
          
        	//infoWindow.open(map);
        });
      	districtPolyg.addListener('mouseout',function(infoWindow,map,e){
          if(this.isDrawn == false)return;
          if(this.isFocused == true)return;
          this.setOptions({fillOpacity : 0.35});
          //infoWindow.close();
        });
      districtPolyg.addListener('click',function(event){
      	distClick(this.BoroCD,this);      	
      });
      				       		
				districtArray[i].polygon = districtPolyg;
    }
  }

function translateFromRawCoords(rawCoords){
  var latLngCoords = [];
  for(var j=0;j< rawCoords.length;j++){
          var gData = new google.maps.LatLng(rawCoords[j][1], rawCoords[j][0]);
    latLngCoords.push(gData);
        }
  return latLngCoords;
}

function getInitialBorColor(boroCd){
  var borColor;
  if(boroCd<200){
    borColor = '#942994'; //Manhattan
  }else if(boroCd<300){
    borColor = '#3503ff'; //Bronx
  }else if(boroCd<400){
    borColor = '#20730b'; //Brooklyn
  }else if(boroCd<500){
    borColor = '#eb7703'; //Queens
  }else{
    borColor = '#f00d05'; //Staten Island
  }
  return borColor;
}


function polygonCenter(polygCoords) {
    var latitudes = [];
    var longitudes = [];
    var vertices;
  if(polygCoords.length == 1){
    vertices = [];
    for(var j=0;j<polygCoords[0].length;j++){
       vertices = vertices.concat(polygCoords[0][j]);
    }
  }else{
    vertices = polygCoords;
  }
    // put all latitudes and longitudes in arrays
    for (var i = 0; i < vertices.length; i++) {
        longitudes.push(vertices[i].lng());
        latitudes.push(vertices[i].lat());
    }

    // sort the arrays low to high
    latitudes.sort();
    longitudes.sort();

    // get the min and max of each
    var lowX = latitudes[0];
    var highX = latitudes[latitudes.length - 1];
    var lowy = longitudes[0];
    var highy = longitudes[latitudes.length - 1];

    // center of the polygon is the starting point plus the midpoint
    var centerX = lowX + ((highX - lowX) / 2);
    var centerY = lowy + ((highy - lowy) / 2);
  
    return (new google.maps.LatLng(centerX, centerY));
}

function drawByPosition(districtsArray){
  var i;
  var myColor = d3.scaleLinear().domain([1,districtsArray.length])
  .range(["#11D60B", "#FF0000"]);
  for(i=0;i<districtsArray.length;i++){
    hideDistPoly(districtsArray[i]);    
  }
  
  clearDistrictMarkers();
  
  for(var j=0;j<districtsArray.length;j++){
    var pos = j+1;
    showDistPoly(districtsArray[j],myColor(j));
    
    if(j==0){      
    var dist = districtsArray[j];
    //crear marcador con posicion del distrito
    var centMarker = new google.maps.Marker({
              map: map,
              label: "#1",
              position: dist.centerCoords,
              opacity:0.8,
        			title: ''+dist.BoroCd, //NombBarrio
        			animation: google.maps.Animation.DROP,
            });
    districtMarkers.push(centMarker);
    }
  }
  NYUmarker.setOptions({map : null});
}

function drawDefault(districtsArray){
  
  for(var j=0;j<districts.length;j++){
    showDistPoly(districtsArray[j],getInitialBorColor(districtsArray[j].BoroCd));	
  }
  clearDistrictMarkers();
  NYUmarker.setOptions({map : map});
}

function hideDistPoly(district){
  district.polygon.setOptions({
    map : null
  });
}

function showDistPoly(district,color){
  var selectedColor;
  if(color == undefined){
    selectedColor = getInitialBorColor(district.BoroCd);
  }else{
    selectedColor = color;
  }
  district.polygon.setOptions({
    map : map,
    fillColor : selectedColor,
    strokeColor : selectedColor,
    fillOpacity : 0.35,
    strokeWeight : 2
  });
}

function clearDistrictMarkers(){
  var i;
  for(i=0;i<districtMarkers.length;i++){
    districtMarkers[i].setOptions({map : null});
  }  
  districtMarkers = [];
}

function focusDistrict(district,districts,criteria){
  NYUmarker.setOptions({map : null});
  clearDistrictMarkers();
  map.setCenter(district.centerCoords);
  map.setZoom(12);
  //Borrarlos todos menos ese distrito
  for(var i = 0;i<districts.length;i++){
    hideDistPoly(districts[i]);
  }
  showDistPoly(district);
  district.polygon.setOptions({fillOpacity:0.1,strokeWeight : 4});
  focusedDistrict = district;
  //criteria
}

function refocusMap(districts,criteria){
  //cosas con focused district y criteria
  map.setCenter(initialCenter);
  map.setZoom(10);
  
  for(var i = 0;i<districts.length;i++){
    showDistPoly(districts[i]);
  }
  if(criteria != null){
    drawByPosition(districts);
  }else{
    NYUmarker.setOptions({map : map});
  }  
}

function drawCritMarkers(district,criteria){
  
  eraseCritMarkers();
  
  var property = criteria + "Locations";  
	var icon = customIcon[criteria];  
  var positionArray = district[property];
  var usedGradient;
  
  if(criteria == null){
     //draw neighborhoods
    var neighborhoods = district.neighborhoods;
    for(var x=0;x<neighborhoods.length;x++){
    	var neighMarker = new google.maps.Marker({
                map: map,
                label: "",
                position: neighborhoods[x].location,
                opacity:0.8,
                title: neighborhoods[x].name, //NombBarrio
                animation: google.maps.Animation.DROP,
         				icon: customIcon.neighMark
              });
      criteriaMarkers.push(neighMarker);
    }
    return;
   }else if(criteria=="distance" || criteria=="triple"){
     //draw dummy marker
       var NaMarker = new google.maps.Marker({
                map: map,
                label: "",
                position: district.centerCoords,
                opacity:0.8,
                title: "N/A", //NombBarrio
                animation: google.maps.Animation.DROP,
         				icon: customIcon.infoMark
              });
      criteriaMarkers.push(NaMarker);
      return;
     }else if(criteria=="safety"){
       usedGradient = null;
     }else{
       usedGradient = positiveGradient;
     }
  
  
  if(positionArray.length == 0){ //Ninguna posicion
    var sadMarker = new google.maps.Marker({
                map: map,
                label: "",
                position: district.centerCoords,
                opacity:0.8,
                title: "Sorry! Nothing here!", //NombBarrio
                animation: google.maps.Animation.DROP,
      					icon: customIcon.questionMark
              });
      criteriaMarkers.push(sadMarker);
  }else if(positionArray.length < 25){ //menos de X posiciones
    var i;
    for(i=0;i<positionArray.length;i++){
      var marker = new google.maps.Marker({
                map: map,
                label: "",
                position: positionArray[i],
                opacity:0.8,
                title: criteria, //NombBarrio
                animation: google.maps.Animation.DROP,
        				icon : icon
              });
      criteriaMarkers.push(marker);
    }
  }else{ //muchas posiciones
    	heatmap = new google.maps.visualization.HeatmapLayer({
    	data: positionArray,
    	map: map,
      gradient : usedGradient
      });
       
       heatmapDrawn = true;
  }
}

function eraseCritMarkers(){
  var i;
  for(i=0;i<criteriaMarkers.length;i++){
    criteriaMarkers[i].setOptions({map : null});
  }  
  criteriaMarkers = [];
  
  //erase heatmap
  if(heatmapDrawn == true){
    heatmap.setOptions({map : null});
  	heatmap = null;
    heatmapDrawn = false;
  }
}
