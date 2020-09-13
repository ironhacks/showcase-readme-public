window.setTimeout(()=>{
  districts.sort((a,b)=> Math.round((a.rankingAffordability+a.rankingSecurity+a.rankingDistance)/3) - Math.round((b.rankingAffordability+b.rankingSecurity+b.rankingDistance)/3));
  districts.forEach((e,i)=>{
    e.rankingAverage = i;
  });
  console.timeEnd("carga");
  districts.sort((a,b)=>a.rankingAverage-b.rankingAverage);
  console.log(districts);
  var AVERAGE = districts.slice(0,10);
  districts.sort((a,b)=>a.rankingSecurity-b.rankingSecurity);
  var SECURITY = districts.slice(0,10);
  districts.sort((a,b)=>a.rankingDistance-b.rankingDistance);
	var DISTANCE = districts.slice(0,10);
  districts.sort((a,b)=>a.rankingAffordability-b.rankingAffordability);
  var AFFORDABILITY = districts.slice(0,10);
  console.log(DISTANCE);
  console.log(AVERAGE);
  console.log(SECURITY);
  console.log(AFFORDABILITY);
	dashboard('#average-graph',AVERAGE);
  dashboard('#security-graph',SECURITY);
  dashboard('#distance-graph',DISTANCE);
  dashboard('#affordability-graph',AFFORDABILITY);
},7000);

function dashboard(id, fData){
    var barColor = 'black';
    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b:30, l: 0};
        hGDim.w = 300 - hGDim.l - hGDim.r, 
        hGDim.h = 300 - hGDim.t - hGDim.b;
            
        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("transform", "translate(" + hGDim.l + "," + (hGDim.t-100) + ")");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + (hGDim.h+50) + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar")
        				.attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");
        
        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor);
            
        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "middle")
    			  .attr("font-size", "10px")

    }    
    // calculate total frequency by state for all segment.
    switch(id){
      case '#average-graph':
    		var sF = fData.map(function(d){
          var ave = Math.round((d.rankingSecurity+d.rankingDistance+d.rankingAffordability)/3);
          return [d.shape.getProperty("BoroCD"),ave];
        });    
        break;
      case '#security-graph':
      	var sF = fData.map(function(d){
          var secu = d.crimes.length;
          return [d.shape.getProperty("BoroCD"),secu];
        });    
        break;
      case '#distance-graph':
        var sF = fData.map(function(d){
          var dis = Math.round(google.maps.geometry.spherical.computeDistanceBetween(d.center,map.getCenter()));
          return [d.shape.getProperty("BoroCD"),dis];
        });    
        break;
      case '#affordability-graph':
        var sF = fData.map(function(d){
         	var aff = 0;
          d.buildings.forEach((e)=>{
     		 		aff += parseInt(e.lowIncomeUnits); 
    			});
          return [d.shape.getProperty("BoroCD"),aff];
        });    
    }
  	

    var hG = histoGram(sF);
}




