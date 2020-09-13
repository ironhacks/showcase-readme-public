//CONSTANTES
const geoShapesURL = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/ArcGIS/rest/services/NYC_Community_Districts/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const crimesURL = "https://data.cityofnewyork.us/resource/9s4h-37hy.json?cmplnt_fr_dt=2015-12-31T00:00:00.000";
const namesURL = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const buildingsURL = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
//---------------------------------------------
//Importando geoShapes
var formas = fetch(geoShapesURL)
  	.then((response) => response.json());
//Importando crimenes
var crimenes = fetch(crimesURL)
  	.then((response) => response.json());
//Importando barrios  
var barrios = fetch(namesURL)
	.then((response) => response.json());
//Importando construcciones
var edificios = fetch(buildingsURL)
  	.then((response) => response.json());
//---------------------------------------------
window.setTimeout(()=>{
	var loader = document.getElementById("loader");
  loader.style.zIndex = -9999;
	document.getElementById("body").removeChild(loader);
},7000);




var averageHTML = document.getElementById("average");
averageHTML.addEventListener("animationiteration", ()=>{
	averageHTML.style.animationPlayState = "paused";
	averageHTML.classList.toggle('activo');
}, false);

var distanceHTML = document.getElementById("distance");
distanceHTML.addEventListener("animationiteration", ()=>{
	distanceHTML.style.animationPlayState = "paused";
	distanceHTML.classList.toggle('activo');
}, false);

var housingHTML = document.getElementById("affordability");
housingHTML.addEventListener("animationiteration", ()=>{
	housingHTML.style.animationPlayState = "paused";
	housingHTML.classList.toggle('activo');
}, false);

var securityHTML = document.getElementById("security");
securityHTML.addEventListener("animationiteration", ()=>{
	securityHTML.style.animationPlayState = "paused";
	securityHTML.classList.toggle('activo');
}, false);



function animar(e){
	var a1 = document.getElementById(e);
	if(averageHTML.classList.contains("activo")){
		averageHTML.style.animationPlayState = "running";
	}
	if(housingHTML.classList.contains("activo")){
		housingHTML.style.animationPlayState = "running";
	}
	if(distanceHTML.classList.contains("activo")){
		distanceHTML.style.animationPlayState = "running";
	}
	if(securityHTML.classList.contains("activo")){
		securityHTML.style.animationPlayState = "running";
	}
	a1.style.animationPlayState = "running";
	drawTopMarkers(e);
}







