/*jshint esversion: 6 */
function borDistrictBubbleChart(districts){
  
  var data = [{bor : "Bronx",count : 0},
           {bor : "Queens",count : 0},
           {bor : "Brooklyn",count : 0},
           {bor : "Staten Island",count : 0},
           {bor: "Manhattan",count : 0}];

  for(var j=0;j<districts.length;j++){
    var distBor = districts[j].borough;
    switch(distBor){
      case "Brooklyn":
        data[0].count++;
        break;
      case "Manhattan":
        data[1].count++;
        break;
      case "Queens":
        data[2].count++;
        break;
      case "Staten Island":
        data[3].count++;
        break;
      case "Bronx":
        data[4].count++;
        break;
      default:
        break;    
    }
  }
  
  var chart = bubbleChart();
  d3.select('#exampleChart').datum(data).call(chart);
  
  function bubbleChart() {
    var width = 600,
        height = 400,
        maxRadius = 90,
        columnForColors = "bor",
        columnForRadius = "count";

    function chart(selection) {
        var data = selection.datum();
        var div = selection,
            svg = div.selectAll('svg');
        svg.attr('width', width).attr('height', height);

        var tooltip = selection
            .append("div")
            .style("visibility", "hidden")
            .style("color", "white")
            .style("padding", "8px")
            .style("background-color", "#626D71")
            .style("border-radius", "6px")
            .style("text-align", "center")
            .style("font-family", "Lato")
            .style("width", "600px")
            .text("");

        var simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength([-700]))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", ticked);
        function ticked(e) {
            node.attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        }

        var colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
        var scaleRadius = d3.scaleLinear().domain([d3.min(data, function(d) {
            return +d[columnForRadius];
        }), d3.max(data, function(d) {
            return +d[columnForRadius];
        })]).range([30, 90]);
				
        var node = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr('r', function(d) {
                return scaleRadius(d[columnForRadius]);
            })     
            .style("fill", function(d) {
                return colorCircles(d[columnForColors]);
            })
            .attr('transform', 'translate(' + [width / 2, height / 2] + ')')
        		.attr('opacity', "0.6")
        		.attr('stroke', function(d) {
                return colorCircles(d[columnForColors]);
            })
        		.attr('stroke-opacity','2')
            .on("mouseover", function(d) {
              d3.select(this)
							.transition().duration(200)
							.style("opacity", "2");
                tooltip.html(d[columnForColors] + "<br>" + d[columnForRadius] + " districts");
                return tooltip.style("visibility", "visible");
            })           
            .on("mouseout", function() {
              d3.select(this)
							.transition().duration(200)
							.style("opacity", "0.6");
              	tooltip.html("Hover over a bubble!");
                return tooltip.style("visibility", "hidden");
            });
    }
    return chart;
	}  
}

function districtRadarChart(district){
    
  var parentSelector = '#districtDetailChart';
  
  var datos = [{
    name : "MyDistrict",
    axes : [
      {axis: "Transport Access", value : 59-district.transportRankPos},
      {axis: "Closeness to NYU", value : 59-district.distanceRankPos},
      {axis: "Safety", value : 59-district.safetyRankPos},
      {axis: "Farmers' markets", value : 59-district.marketsRankPos},
      {axis: "Art Galleries", value : 59-district.galleriesRankPos},
      {axis: "Affordability", value : 59-district.housingRankPos},
      {axis: "Childcare Access", value : 59-district.childcareRankPos}
    ]	
  }];  
	
  var radarChartOptions = {
  w: 400,
  h: 300,
  margin: { top: 5, right: 0, bottom: 5, left: 0 },
  maxValue: 5,
  levels: 5,
  roundStrokes: true,
  color: d3.scaleOrdinal().range(["#6d7379", "#ff6600"]),
  format: '.0f',  
  unit: '°',
    labelFactor : 0.9
  			};
  
  RadarChart(parentSelector, datos,radarChartOptions);
  
  function RadarChart(parent_selector, data, options) {
  const max = Math.max;
	const sin = Math.sin;
	const cos = Math.cos;
	const HALF_PI = Math.PI / 2;
	//Wraps SVG text - Taken from http://bl.ocks.org/mbostock/7555321
	const wrap = (text, width) => {
	  text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

			while (word = words.pop()) {
			  line.push(word);
			  tspan.text(line.join(" "));
			  if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			  }
			}
	  });
	};//wrap

	const cfg = {
	 w: 600,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scaleOrdinal(d3.schemeCategory10),	//Color function,
	 format: '.2%',
	 unit: '',
	 legend: false
	};

	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if

	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	// var maxValue = max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	let maxValue = 0;
	for (let j=0; j < data.length; j++) {
		for (let i = 0; i < data[j].axes.length; i++) {
			data[j].axes[i]['id'] = data[j].name;
			if (data[j].axes[i]['value'] > maxValue) {
				maxValue = data[j].axes[i]['value'];
			}
		}
	}
	maxValue = max(cfg.maxValue, maxValue);

	const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format(cfg.format),			 	//Formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

	//Scale for the radius
	const rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);

	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////
	const parent = d3.select(parent_selector);

	//Remove whatever chart with the same id/class was present before
	parent.select("svg").remove();

	//Initiate the radar chart SVG
	let svg = parent.append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar");

	//Append a g element
	let g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

	//Filter for the outside glow
	let filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	//Wrapper for the grid & axes
	let axisGrid = g.append("g").attr("class", "axisWrapper");

	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", d => radius / cfg.levels * d)
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", d => -d * radius / cfg.levels)
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(d => Format(59-maxValue * d / cfg.levels) + cfg.unit);

	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => rScale(maxValue *1.1) * cos(angleSlice * i - HALF_PI))
		.attr("y2", (d, i) => rScale(maxValue* 1.1) * sin(angleSlice * i - HALF_PI))
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", (d,i) => rScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI))
		.attr("y", (d,i) => rScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI))
		.text(d => d)
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////

	//The radial line function
	const radarLine = d3.radialLine()
		.curve(d3.curveLinearClosed)
		.radius(d => rScale(d.value))
		.angle((d,i) => i * angleSlice);

	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed);
	}

	//Create a wrapper for the blobs
	const blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");

	//Append the backgrounds
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", d => radarLine(d.axes))
		.style("fill", (d,i) => cfg.color(i))
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function(d, i) {
			//Dim all blobs
			parent.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1);
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);
		})
		.on('mouseout', () => {
			//Bring back all blobs
			parent.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});

	//Create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d.axes); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", (d,i) => cfg.color(i))
		.style("fill", "none")
		.style("filter" , "url(#glow)");

	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(d => d.axes)
		.enter()
		.append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice * i - HALF_PI))
		.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
		.style("fill", (d) => cfg.color(d.id))
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////

	//Wrapper for the invisible circles on top
	const blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");

	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(d => d.axes)
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius * 1.5)
		.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice*i - HALF_PI))
		.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice*i - HALF_PI))
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			tooltip
				.attr('x', this.cx.baseVal.value - 10)
				.attr('y', this.cy.baseVal.value - 10)
				.transition()
				.style('display', 'block')
				.text(Format(d.value) + cfg.unit);
		})
		.on("mouseout", function(){
			tooltip.transition()
				.style('display', 'none').text('');
		});

	const tooltip = g.append("text")
		.attr("class", "tooltip")
		.attr('x', 0)
		.attr('y', 0)
		.style("font-size", "12px")
		.style('display', 'none')
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em");

	if (cfg.legend !== false && typeof cfg.legend === "object") {
		let legendZone = svg.append('g');
		let names = data.map(el => el.name);
		if (cfg.legend.title) {
			let title = legendZone.append("text")
				.attr("class", "title")
				.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY})`)
				.attr("x", cfg.w - 70)
				.attr("y", 10)
				.attr("font-size", "12px")
				.attr("fill", "#404040")
				.text(cfg.legend.title);
		}
		let legend = legendZone.append("g")
			.attr("class", "legend")
			.attr("height", 100)
			.attr("width", 200)
			.attr('transform', `translate(${cfg.legend.translateX},${cfg.legend.translateY + 20})`);
		// Create rectangles markers
		legend.selectAll('rect')
		  .data(names)
		  .enter()
		  .append("rect")
		  .attr("x", cfg.w - 65)
		  .attr("y", (d,i) => i * 20)
		  .attr("width", 10)
		  .attr("height", 10)
		  .style("fill", (d,i) => cfg.color(i));
		// Create labels
		legend.selectAll('text')
		  .data(names)
		  .enter()
		  .append("text")
		  .attr("x", cfg.w - 52)
		  .attr("y", (d,i) => i * 20 + 9)
		  .attr("font-size", "11px")
		  .attr("fill", "#737373")
		  .text(d => d);
	}
 }
}

function criteriaBarChart(criteria,districts){
  var units;
  var requiredProperty;
  var order = "descendent";
  switch(criteria){
    case "housing":
      requiredProperty = "affordableUnits";
      units = "affordable units";
      break;
    case "safety":
      requiredProperty = "crimes";
      units = "crimes";
      order = "ascendent";
      break;
    case "distance":
      requiredProperty = "distanceToNyu";
      units = "meters";
      order = "ascendent";
      break;
    case "triple":
      requiredProperty = "tripleRankPos";
      units = "(3-way rank)";
      break;
    case "markets":
      requiredProperty = "markets";
      units = "markets";
      break;
    case "galleries":
      requiredProperty = "galleries";
      units = "galleries";
      break;
    case "childcare":
      requiredProperty = "childCarePrograms";
      units = "childcare programs";
      break;
    case "transport":
      requiredProperty = "subEntrances";
      units = "subway entrances";
      break;
    default:
      return;
  }
  
  var colorBar = function(data){
    switch(data.borough){
      case "Manhattan":
        return "#942994";
      case "Bronx":
        return "#3503ff";
      case "Staten Island":
        return "#f00d05";
      case "Brooklyn":
        return "#20730b";
      case "Queens":
        return "#eb7703";        
    }
  };
var div = d3.select("#chartSectionchart");
div.select("svg").remove();  
div.select("div").remove();
  
var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 750 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.25);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x)
							.tickFormat(function(d){return d.BoroCd;});

var yAxis = d3.axisLeft(y);    

var svg = div.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

  x.domain(districts.map(function(d) { return d.BoroCd; }));
  y.domain([0, d3.max(districts, function(d) { return +d[requiredProperty]; })]);

var tooltip = d3.select("#chartSectionchart")
			.append("div")
			.style("visibility", "hidden")
			.style("color", "white")
			.style("padding", "8px")
			.style("background-color", "#626D71")
			.style("border-radius", "6px")
			.style("text-align", "center")
			.style("font-family", "Lato")
			.style("width", "750px")
			.text("");
  
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

  svg.selectAll("bar")
    .data(districts)
    .enter().append("rect")
    .style("fill", function(d){return colorBar(d);})
    .attr("x", function(d) { return x(d.BoroCd); })
    .attr("width", x.bandwidth())
    .attr("y", function(d) { return y(d[requiredProperty]); })
    .attr("height", function(d) { return height - y(d[requiredProperty]); })
    .attr('opacity', "0.6")    
    .on("mouseover", function(d) {
    		d3.select(this)
        .transition().duration(200)
        .style("opacity", "2");
    		tooltip.html(d.BoroCd + "<br>" +d.borough+"<br>"+ d[requiredProperty] + " "+units);
    		return tooltip.style("visibility", "visible");
  })           
    .on("mouseout", function() {
    	d3.select(this)
      .transition().duration(200)
      .style("opacity", "0.6");
    	tooltip.html("Hover over a bar!");
    	return tooltip.style("visibility", "hidden");
  });

  
  //barchart
}