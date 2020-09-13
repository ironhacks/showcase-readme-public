const API_KEY = "AIzaSyDphGVfxEq0-P0a0Fn8SS7tijAeU0tYwss";
var map;
var nYorkCoor = {lat: 40.7291, lng: -73.9965};
 var markers = [];
 var y = 0;

   var directionsDisplay;
   var directionService;
   var PoliGeneral=[];
   var poli=[];
   var poliCrimenesMenor=[];
   var poliCrimenesMenorF=[];
   var poliCasasMayor=[];

   var poliDistanciaMenor=[];
   var tableReference;

function initMap() {


       map = new google.maps.Map(document.getElementById('map'), {
         zoom: 10,
         center: nYorkCoor

       });

       var  myLating = {lat: 40.7291, lng: -73.9965};
var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
       var marker = new google.maps.Marker({
           position: myLating,
           map: map,
           title: 'University',
           animation: google.maps.Animation.DROP,
           icon: image

         });
    marker.setMap(map);

       $.getJSON('https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/ArcGIS/rest/services/NYC_Community_Districts/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson', function(dato) {

         for (var i = 0; i < dato.features.length; i++) {
           var polyCrime;
           var points=[];
           var boroCD = dato.features[i].properties.BoroCD;
          var boroCD2 = Math.floor(boroCD/100)*100;
          var boroCD3 = boroCD - Math.floor(boroCD/100)*100;
          if(boroCD3 >= 20)
          {
            boroCD2 = 0;
          }



if(dato.features[i].geometry.type == "Polygon")
{

var bounds = new google.maps.LatLngBounds();
  for(var j=0; j < dato.features[i].geometry.coordinates["0"].length; j++)
  {

  points.push(new google.maps.LatLng(dato.features[i].geometry.coordinates["0"][j][1], dato.features[i].geometry.coordinates["0"][j][0]));
  bounds.extend(new google.maps.LatLng(dato.features[i].geometry.coordinates["0"][j][1], dato.features[i].geometry.coordinates["0"][j][0]));
 }

polyCrime = new google.maps.Polygon({paths: points,
strokeColor: '#322e2e',
strokeOpacity: 0.8,
strokeWeight: 1,
fillColor: 'hsl('+boroCD2+', 100%, 50%)',
fillOpacity: 0.35});
var center = bounds.getCenter();
var distance = calcRoute(center);

PoliGeneral.push([boroCD,0,0,polyCrime,boroCD,distance]);
poli.push(polyCrime);
//polyCrime.setMap(map);

}
else if (dato.features[i].geometry.type == "MultiPolygon") {

  for (var k = 0; k < dato.features[i].geometry.coordinates.length; k++) {
    var polyCrime;
    var points=[];
    var bounds = new google.maps.LatLngBounds();
    for(var j=0; j < dato.features[i].geometry.coordinates[k]["0"].length; j++)
    {

    points.push(new google.maps.LatLng(dato.features[i].geometry.coordinates[k]["0"][j][1], dato.features[i].geometry.coordinates[k]["0"][j][0]));
    bounds.extend(new google.maps.LatLng(dato.features[i].geometry.coordinates[k]["0"][j][1], dato.features[i].geometry.coordinates[k]["0"][j][0]));
   }
  polyCrime = new google.maps.Polygon({paths: points,
  strokeColor: '#322e2e',
 strokeOpacity: 0.8,
 strokeWeight: 1,
 fillColor: 'hsl('+boroCD2+', 100%, 50%)',
 fillOpacity: 0.35});
poli.push(polyCrime);
var center = bounds.getCenter();
var distance = calcRoute(center);

PoliGeneral.push([boroCD,0,0,polyCrime,boroCD,distance]);

//polyCrime.setMap(map);

  }

}

         }

Crimes_NYFinal();
Housing();




poliCrimenesMenor=PoliGeneral.slice();


poliCasasMayor=PoliGeneral.slice();


poliDistanciaMenor=PoliGeneral.slice();



console.log(poliDistanciaMenor);
console.log(poliCasasMayor);
console.log(poliCrimenesMenor);
console.log(123);
function sortByColumn(a, colIndex){

  a.sort(function(a,b)
   {
     return(a[colIndex]-b[colIndex]);
   });

}
function sortByColumnB(a, colIndex){
  a.sort(function(a,b)
   {
     return(a[colIndex]-b[colIndex]);
   });

}
sortByColumn(poliDistanciaMenor,5);
sortByColumn(poliCasasMayor,2);
sortByColumn(poliCrimenesMenor,1);
console.log(poliDistanciaMenor);
console.log(poliCasasMayor);
console.log(poliCrimenesMenor);



map.data.loadGeoJson( 'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/ArcGIS/rest/services/NYC_Community_Districts/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');

map.data.setStyle(function(feature) {
var boroCD = feature.getProperty('BoroCD');
var boroCD2 = Math.floor(boroCD/100)*100;
var boroCD3 = boroCD - Math.floor(boroCD/100)*100;
if(boroCD3 >= 20)
{
 boroCD2 = 0;
}
return {

  fillColor:   'hsl('+boroCD2+', 100%, 50%)',
  strokeWeight: 1
};
});
map.data.addListener('mouseover', function(event) {
  map.data.revertStyle();
  map.data.overrideStyle(event.feature, {strokeWeight: 5});
});

map.data.addListener('mouseout', function(event) {
  map.data.revertStyle();
});
map.data.addListener('click', function(event) {

 var boroCD = event.feature.getProperty('BoroCD');
 var boroCD2 = Math.floor(boroCD/100);
 var BoroFinal;
 if(boroCD2 == 1) //Manhattan
 {
   if(boroCD - boroCD2*100 < 10)
   {
     boroFinal = 'MN-0' + (boroCD - boroCD2*100);
   }
   else {
     boroFinal = 'MN-' + (boroCD - boroCD2*100);
  }

 }
 if(boroCD2 == 2) //Bronx
 {
   if(boroCD - boroCD2*100 < 10)
   {
      boroFinal = 'BX-0' + (boroCD - boroCD2*100);
   }
   else {
     boroFinal = 'BX-' + (boroCD - boroCD2*100);
   }


 }
 if(boroCD2 == 3)  //Brooklyn
 {

   if(boroCD - boroCD2*100 < 10)
   {
      boroFinal = 'BK-0' + (boroCD - boroCD2*100);
   }
   else {
  boroFinal = 'BK-' + (boroCD - boroCD2*100);
}

 }
 if(boroCD2 == 4) //Queens
 {
   if(boroCD - boroCD2*100 < 10)
   {
     boroFinal = 'QN-0' + (boroCD - boroCD2*100);
   }
   else {
    boroFinal = 'QN-' + (boroCD - boroCD2*100);
  }

 }
 if(boroCD2 == 5)//staten island
 {
   if(boroCD - boroCD2*100 < 10)
   {
     boroFinal = 'SI-0' + (boroCD - boroCD2*100);
   }
   else {
      boroFinal = 'SI-' + (boroCD - boroCD2*100);
   }

 }
 var money =  $('.selectMoney option:selected');
 Housing_NY(money.val(),boroFinal,null);
});


map.data.addListener('click', function(event)
{


for (var i = 0; i < 175; i++) {
  if(PoliGeneral[i][0] == event.feature.f.BoroCD)
  {
   var puntajeDistancia =20+ ((100*520)/PoliGeneral[i][5]);
   var puntajeSeguridad = 20+ (100*1)/(PoliGeneral[i][1]+1);
   var puntajePrecio = 30 +((PoliGeneral[i][1]+1)*100)/(179);

  zingchart.exec('myChart', 'setseriesvalues', {
   plotindex:0,
   values: [parseInt(puntajePrecio)]
 });
 zingchart.exec('myChart1', 'setseriesvalues', {
  plotindex:0,
  values: [parseInt(puntajeSeguridad)]
});
zingchart.exec('myChart2', 'setseriesvalues', {
 plotindex:0,
 values: [parseInt(puntajeDistancia)]
});
break;

  }
}

});





                       });

                     }
                     $("#buttonVivienda").on("click",updateTablePrecios);
                     $("#buttonSeguridad").on("click",updateTableCrimenes);
                     $("#buttonDistancia").on("click",updateTableDistancia);





                     var myConfig = {
                      	type: "gauge",
                      	globals: {
                      	  fontSize: 10
                      	},
                      	plotarea:{
                      	  marginTop:10
                      	},
                      	plot:{
                      	  size:'100%',
                      	  valueBox: {
                      	    placement: 'center',
                      	    text:'%v', //default
                      	    fontSize:10,
                      	    rules:[
                      	      {
                      	        rule: '%v >= 80',
                      	        text: '%v<br>EXCELLENT'
                      	      },
                      	      {
                      	        rule: '%v < 80 && %v > 64',
                      	        text: '%v<br>Good'
                      	      },
                      	      {
                      	        rule: '%v < 64 && %v > 58',
                      	        text: '%v<br>Fair'
                      	      },
                      	      {
                      	        rule: '%v <  58',
                      	        text: '%v<br>Bad'
                      	      }
                      	    ]
                      	  }
                      	},
                       tooltip:{
                         borderRadius:5
                       },
                      	scaleR:{
                     	  aperture:180,
                     	  minValue:0,
                     	  maxValue:100,
                     	  step:5,
                     	  center:{
                     	    visible:false
                     	  },
                     	  tick:{
                     	    visible:false
                     	  },
                     	  item:{
                     	    offsetR:0,
                     	    rules:[
                     	      {
                     	        rule:'%i == 9',
                     	        offsetX:15
                     	      }
                     	    ]
                     	  },
                     	  labels:['30','','','','','','58','64','70','75','','85'],
                     	  ring:{
                     	    size:50,
                     	    rules:[
                     	      {
                     	        rule:'%v <= 58',
                     	        backgroundColor:'#E53935'
                     	      },
                     	      {
                     	        rule:'%v > 58 && %v < 64',
                     	        backgroundColor:'#EF5350'
                     	      },
                     	      {
                     	        rule:'%v >= 64 && %v < 70',
                     	        backgroundColor:'#FFA726'
                     	      },
                     	      {
                     	        rule:'%v >= 70',
                     	        backgroundColor:'#29B6F6'
                     	      }
                     	    ]
                     	  }
                      	},
                       refresh:{
                           type:"feed",
                           transport:"js",
                           url:"feed()",
                           interval:1500,
                           resetTimeout:1000
                       },
                     	series : [
                     		{
                     			values : [72], // starting value
                     			backgroundColor:'black',
                     	    indicator:[10,10,10,10,0.75],
                     	    animation:{
                             effect:2,
                             method:1,
                             sequence:4,
                             speed: 900
                          },
                     		}
                     	]
                     };
                     var myConfig1 = {
                      	type: "gauge",
                      	globals: {
                      	  fontSize: 10
                      	},
                      	plotarea:{
                      	  marginTop:10
                      	},
                      	plot:{
                      	  size:'100%',
                      	  valueBox: {
                      	    placement: 'center',
                      	    text:'%v', //default
                      	    fontSize:10,
                      	    rules:[
                      	      {
                      	        rule: '%v >= 80',
                      	        text: '%v<br>EXCELLENT'
                      	      },
                      	      {
                      	        rule: '%v < 80 && %v > 64',
                      	        text: '%v<br>Good'
                      	      },
                      	      {
                      	        rule: '%v < 64 && %v > 58',
                      	        text: '%v<br>Fair'
                      	      },
                      	      {
                      	        rule: '%v <  58',
                      	        text: '%v<br>Bad'
                      	      }
                      	    ]
                      	  }
                      	},
                       tooltip:{
                         borderRadius:5
                       },
                      	scaleR:{
                     	  aperture:180,
                     	  minValue:0,
                     	  maxValue:100,
                     	  step:5,
                     	  center:{
                     	    visible:false
                     	  },
                     	  tick:{
                     	    visible:false
                     	  },
                     	  item:{
                     	    offsetR:0,
                     	    rules:[
                     	      {
                     	        rule:'%i == 9',
                     	        offsetX:15
                     	      }
                     	    ]
                     	  },
                     	  labels:['30','','','','','','58','64','70','75','','85'],
                     	  ring:{
                     	    size:50,
                     	    rules:[
                     	      {
                     	        rule:'%v <= 58',
                     	        backgroundColor:'#E53935'
                     	      },
                     	      {
                     	        rule:'%v > 58 && %v < 64',
                     	        backgroundColor:'#EF5350'
                     	      },
                     	      {
                     	        rule:'%v >= 64 && %v < 70',
                     	        backgroundColor:'#FFA726'
                     	      },
                     	      {
                     	        rule:'%v >= 70',
                     	        backgroundColor:'#29B6F6'
                     	      }
                     	    ]
                     	  }
                      	},
                       refresh:{
                           type:"feed",
                           transport:"js",
                           url:"feed()",
                           interval:1500,
                           resetTimeout:1000
                       },
                     	series : [
                     		{
                     			values : [72], // starting value
                     			backgroundColor:'green',
                     	    indicator:[10,10,10,10,0.75],
                     	    animation:{
                             effect:2,
                             method:1,
                             sequence:4,
                             speed: 900
                          },
                     		}
                     	]
                     };
                     var myConfig2 = {
                      	type: "gauge",
                      	globals: {
                      	  fontSize: 10
                      	},
                      	plotarea:{
                      	  marginTop:10
                      	},
                      	plot:{
                      	  size:'100%',
                      	  valueBox: {
                      	    placement: 'center',
                      	    text:'%v', //default
                      	    fontSize:10,
                      	    rules:[
                      	      {
                      	        rule: '%v >= 80',
                      	        text: '%v<br>EXCELLENT'
                      	      },
                      	      {
                      	        rule: '%v < 80 && %v > 64',
                      	        text: '%v<br>Good'
                      	      },
                      	      {
                      	        rule: '%v < 64 && %v > 58',
                      	        text: '%v<br>Fair'
                      	      },
                      	      {
                      	        rule: '%v <  58',
                      	        text: '%v<br>Bad'
                      	      }
                      	    ]
                      	  }
                      	},
                       tooltip:{
                         borderRadius:5
                       },
                      	scaleR:{
                     	  aperture:180,
                     	  minValue:0,
                     	  maxValue:100,
                     	  step:5,
                     	  center:{
                     	    visible:false
                     	  },
                     	  tick:{
                     	    visible:false
                     	  },
                     	  item:{
                     	    offsetR:0,
                     	    rules:[
                     	      {
                     	        rule:'%i == 9',
                     	        offsetX:15
                     	      }
                     	    ]
                     	  },
                     	  labels:['30','','','','','','58','64','70','75','','85'],
                     	  ring:{
                     	    size:50,
                     	    rules:[
                     	      {
                     	        rule:'%v <= 58',
                     	        backgroundColor:'#E53935'
                     	      },
                     	      {
                     	        rule:'%v > 58 && %v < 64',
                     	        backgroundColor:'#EF5350'
                     	      },
                     	      {
                     	        rule:'%v >= 64 && %v < 70',
                     	        backgroundColor:'#FFA726'
                     	      },
                     	      {
                     	        rule:'%v >= 70',
                     	        backgroundColor:'#29B6F6'
                     	      }
                     	    ]
                     	  }
                      	},
                       refresh:{
                           type:"feed",
                           transport:"js",
                           url:"feed()",
                           interval:1500,
                           resetTimeout:1000
                       },
                     	series : [
                     		{
                     			values : [72], // starting value
                     			backgroundColor:'grey',
                     	    indicator:[10,10,10,10,0.75],
                     	    animation:{
                             effect:2,
                             method:1,
                             sequence:4,
                             speed: 900
                          },
                     		}
                     	]
                     };
window.onload=function(){
                     zingchart.render({
                     	id : 'myChart',
                     	data : myConfig,
                     	height: 300,
                     	width: '100%'
                     });

                     zingchart.render({
                      id : 'myChart1',
                      data : myConfig1,
                      height: 300,
                      width: '100%'
                     });
                     zingchart.render({
                       id : 'myChart2',
                       data : myConfig2,
                       height: 300,
                       width: '100%'
                     });

};




function markLivPlace(lat,lng,titleMarker)
{
  var  myLating = {lat: parseFloat(lng), lng: parseFloat(lat)};

  var marker = new google.maps.Marker({
      position: myLating,
      map: map,
      title: titleMarker
    });
    google.maps.event.addListener(marker, 'click', function() {
        calcRoute(myLating);
    });
    markers.push(marker);
}


function calcRoute(lat1) {
    var start = new google.maps.LatLng(40.7291, -73.9965);

    var end = new google.maps.LatLng(lat1.lat(), lat1.lng());
var calc1 = google.maps.geometry.spherical.computeDistanceBetween(end, start);
return calc1;


  }

function updateTableDistancia()
{
  $("#mainTableBody").children().remove()
  tableReference = $("#mainTableBody")[0];
  var newRow, cantidad, id;
  for (var i = 0; i < 10; i++) {
    newRow = tableReference.insertRow(tableReference.rows.length);
    id = newRow.insertCell(0);
    cantidad = newRow.insertCell(1);

    id.innerHTML = poliDistanciaMenor[i][4];
    cantidad.innerHTML = poliDistanciaMenor[i][5];

  }
}

function updateTableCrimenes()
{
  $("#mainTableBody").children().remove()
  tableReference = $("#mainTableBody")[0];
  var newRow, cantidad, id;
  for (var i = 0; i < 10; i++) {
    newRow = tableReference.insertRow(tableReference.rows.length);
    id = newRow.insertCell(0);
    cantidad = newRow.insertCell(1);

    id.innerHTML = poliCrimenesMenor[i][4];
    cantidad.innerHTML = poliCrimenesMenor[i][1];

  }
}

function updateTablePrecios()
{
  $("#mainTableBody").children().remove()
  tableReference = $("#mainTableBody")[0];
  var newRow, cantidad, id;
  for (var i = 0; i < 10; i++) {
    newRow = tableReference.insertRow(tableReference.rows.length);
    id = newRow.insertCell(0);
    cantidad = newRow.insertCell(1);

    id.innerHTML = poliCasasMayor[i][4];
    cantidad.innerHTML = poliCasasMayor[i][2];

  }
}




function markLivPlace2(myLating,titleMarker)
{


  var marker = new google.maps.Marker({
      position: myLating,
      map: map,
      title: titleMarker
    });
    google.maps.event.addListener(marker, 'click', function() {

        calcRoute(myLating);
    });
    markers.push(marker);
}





function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }

      function clearMarkers() {
        setMapOnAll(null);
      }

function Neighborhood_Names()
{

  $.getJSON('https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD', function(dato) {
                   $.each(dato.data, function(i, data)
                 {
                   var coord = dato.data[i][9];
                   var coord2 = coord.split(' ');
                   var lng = coord2[1].split('(');  //lng[1]  longitud
                   var lat = coord2[2].split(')');  //lat[0] latitud
                  markLivPlace(lng[1],lat[0],lat);


                 });
               });
}

$('.selectMoney, .selectBorouhg').change(function()
{
    var money =  $('.selectMoney option:selected');
    var borouhg =  $('.selectBorouhg option:selected');
    Housing_NY(money.val(),null,borouhg.val());



});


function Crimes_NYFinal()
      {
          $.ajax({
    url: "https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2016-12-31T00:00:00.000",
    type: "GET",
    data: {
      "$limit" : 5000,
      "$$app_token" : "iu5CgTQIcvajmlutWjTQ2aphI"
    }
}).done(function(data) {

for (var i = 3; i < data.length; i++) {

var coor =  new google.maps.LatLng(data[i].lat_lon.coordinates[1],data[i].lat_lon.coordinates[0]);

for (var j = 0; j < 175; j++) {
  if(google.maps.geometry.poly.containsLocation(coor, PoliGeneral[j][3]))
  {
    PoliGeneral[j][1]++;
    break;
  }

}

}

});
      }

function Housing()
{
  $.getJSON('https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD', function(dato) {
    $.each(dato.data, function(i, data)
  {
    var casa = dato.data[i][19].split('-');

    for (var j = 0; j < 175; j++) {

      if(casa[0] == 'MN')
      {
        casa[0] = '1';
      }
      if(casa[0] =='BX')
      {
          casa[0] = '2';
      }
      if(casa[0] =='BK')
      {
          casa[0] = '3';
      }
      if(casa[0] == 'QN')
      {
          casa[0] = '4';
      }
      if(casa[0] =='SI')
      {
          casa[0] = '5';
      }
      var finalCasa = casa.toString();
      finalCasa = finalCasa.replace(',','');

      if(dato.data[i][33] > 0 && finalCasa == PoliGeneral[j][4])
      {

        PoliGeneral[j][2]++;
        break;
      }

    }


  });
               });
}
      function Housing_NY(price,borouhgId,borouhgName)
      {
        clearMarkers();
        $.getJSON('https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD', function(dato) {
          $.each(dato.data, function(i, data)
        {
          if(dato.data[i][price] > 0 && borouhgId == null && dato.data[i][15] == borouhgName)
          {
            markLivPlace(dato.data[i][24],dato.data[i][23],dato.data[i][9]);
          }
          if(dato.data[i][price] > 0 && dato.data[i][19] == borouhgId)
          {

       markLivPlace(dato.data[i][24],dato.data[i][23],dato.data[i][9]);
          }

        });
                     });

      }
