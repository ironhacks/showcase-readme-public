var map;
var markers = [];
var TBoro = ["MANHATTAN","BRONX","BROOKLYN","QUEENS","STATEN ISLAND"];
var TBoro2 = ["MN","BX","BK","QN","SI"];
var districts = [];
var estilos = [
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
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
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
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
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
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
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
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
  ];

function initMap(){

  map = new google.maps.Map(document.getElementById('MapContainer'), {
    center: {lat: 40.729100, lng: -73.996500},
    zoom: 11,
    styles:estilos
  }); 

  console.time("carga");
  map.data.loadGeoJson(geoShapesURL,{},function(features){

    console.time("shapes");
    features.forEach((g)=>{
      if(g.getProperty("BoroCD")%100 <= 18){
        var d = {};
        d.shape = g;
        districts.push(d);
        districts[districts.length-1].center = getCenter1(d.shape.getGeometry());
      }              
    });
    districts.sort((a,b)=>{
      da = google.maps.geometry.spherical.computeDistanceBetween(a.center,map.getCenter());
      db = google.maps.geometry.spherical.computeDistanceBetween(b.center,map.getCenter());
      return da-db;
    });  
    districts.forEach((e,i)=>{
      e.rankingDistance = i; 
    });
    console.timeEnd("shapes");

    barrios.then((neighborhoods) => {
      console.time("neighborhoods");
      process_neighborhoods(neighborhoods,districts);  
      console.timeEnd("neighborhoods");
    });
    
    crimenes.then((crimes) => {
      console.time("crimes");
      process_crimes(crimes,districts);
      console.timeEnd("crimes");
    });

    edificios.then((buildings) => {
      console.time("buildings");
      process_buildings(buildings,districts); 
      console.timeEnd("buildings");
    });
  });     

  //Añadiendo diseño los diferentes Boroughs dk nueva york
  map.data.setStyle(function(features){
    
    if(features.getProperty("BoroCD")%100 >18){
      color = "white";
    }else{
      switch(Math.trunc(features.getProperty("BoroCD")/100)){
        case 1: color = "red"; break;
        case 2: color = "blue"; break;
        case 3: color = "green"; break;
        case 4: color = "orange"; break;
        case 5: color = "purple";
      }
    }    
    return {
      fillColor : color,
      strokeColor : color,
      strokeWeight : 0
    };
  });
  
  //---------------------------------------------
  //Añadiendo listener para cuando se pase sobre un distrito
  map.data.addListener('mouseover', function(event) {
    if(event.feature.getProperty("BoroCD")%100 <= 18){
      map.data.overrideStyle(event.feature, {strokeWeight : 3});  
    }
  });
  //Añadiendo listener para cuando se sale de un distrito
  map.data.addListener('mouseout', function(event) {
    //revertir estilo
    map.data.revertStyle();
  });
  //---------------------------------------------

}

function inside(point, vs) {
    var x = point.lat, y = point.lng;

    var inside = false;
    for (var i = 0, j = vs.getLength() - 1; i < vs.getLength(); j = i++) {
        var xi = vs.getAt(i).lat(), yi = vs.getAt(i).lng();
        var xj = vs.getAt(j).lat(), yj = vs.getAt(j).lng();

        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function process_buildings(buildings,districts){
  districts.forEach((d)=>{
    var b_of_d = [];
    buildings.data.forEach((b)=>{
      var BoroCD = (TBoro2.indexOf(b[19].substring(0,2))+1) + b[19].substring(3,5);
      if(BoroCD == d.shape.getProperty("BoroCD") &&b[25] != null && b[26] != null && b[33]>0){
        b_of_d.push({
          lat: b[25],
          lng: b[26],
          lowIncomeUnits: b[33],
          name: b[9],
          address: b[14]+b[13]
        });
      }
    });
    d.buildings = b_of_d;
  });
  districts.sort((a,b)=>{
    af = 0,bf = 0;
    a.buildings.forEach((e)=>{
      af += parseInt(e.lowIncomeUnits); 
    });
    b.buildings.forEach((e)=>{
      bf += parseInt(e.lowIncomeUnits); 
    }); 
    return bf - af;
  });
  districts.forEach((e,i)=>{
    e.rankingAffordability = i; 
  });
  return districts; 
}

function process_crimes(crimes,districts){
  districts.forEach((d)=>{
    
    var c_of_d = [];
    crimes.forEach((c)=>{
        var pos = {lat:parseFloat(c.latitude),lng: parseFloat(c.longitude)};
        if(d.shape.getGeometry().getType() == "Polygon"){
          if(inside(pos,d.shape.getGeometry().getAt(0))){
            c_of_d.push({
              lat : pos.lat,
              lng : pos.lng,
              description: c.ofns_desc
            });  
          }
        }else{
          d.shape.getGeometry().getArray().forEach((i)=>{
            if(inside(pos,i.getAt(0))){
              c_of_d.push({
                lat : pos.lat,
                lng : pos.lng,
                description: c.ofns_desc
              });  
            }        
          });
        }   
    });
    d.crimes = c_of_d;
  });
  
  districts.sort((a,b)=>a.crimes.length-b.crimes.length);
  districts.forEach((e,i)=>{
    e.rankingSecurity = i; 
  });
  return districts;
}

function process_neighborhoods(neighborhoods,districts){
  districts.forEach((g)=>{
    if(g.shape.getProperty("BoroCD")%100 <= 18){
      var n_of_g = [];
      neighborhoods.data.forEach((n)=>{
        var p = n[8];
        p = p.slice(7,p.length-1).split(" ");
        var pos = {lat:parseFloat(p[1]),lng:parseFloat(p[0])};
        
        if(g.shape.getGeometry().getType() == "Polygon"){
          if(inside(pos,g.shape.getGeometry().getAt(0))){
            n_of_g.push({
              lat : pos.lat,
              lng : pos.lng,
              name: n[10]
            });  
          }
        
        }else{
        
          g.shape.getGeometry().getArray().forEach((i)=>{
            if(inside(pos,i.getAt(0))){
              n_of_g.push({
                lat : pos.lat,
                lng : pos.lng,
                name: n[10]
              });  
            }        
          });
        }
      });
    }
    g.neighborhoods = n_of_g;              
  });
  return districts;
}

function getCenter1(poligono){
  var bounds = new google.maps.LatLngBounds();
  poligono.forEachLatLng((e)=>{
    bounds.extend(e);  
  });
  return bounds.getCenter();
}

function drawTopMarkers(S){
  switch(S){
    case "security":
      districts.sort((a,b)=>a.rankingSecurity-b.rankingSecurity);break;
    case "distance":
      districts.sort((a,b)=>a.rankingDistance-b.rankingDistance);break;
    case "affordability":
      districts.sort((a,b)=>a.rankingAffordability-b.rankingAffordability);break;
    case "average":
      districts.sort((a,b)=>a.rankingAverage-b.rankingAverage);
  }
  markers.forEach((e)=>{
    e.setMap(null);
  });
  markers = [];
  var marker;
  for (var i = 0; i < 10; i++) {
    icono = "http://maps.google.com/mapfiles/kml/paddle/"+(i+1)+".png";
      marker = new google.maps.Marker({
        position: districts[i].center,
        icon: icono,
        map: map,
        animation: google.maps.Animation.DROP
    	});
    markers.push(marker); 
  }
}
