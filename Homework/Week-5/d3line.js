/* Charlotte Tiems 10774971
Multseries Line Graph in D3 
Shows the minimal, maximum and average temperature in the year 2000 and 2010 in the Bilt
*/

window.onload = function() {
// set the domains 
var margin = {top: 20, right: 40, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;   

// set x, y and r scale 
var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var parseDate = d3.time.format("%Y%m%d").parse;

var color = d3.scale.ordinal()
    .range(["#308e22", "#1b5fe8","#fc0202"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%b"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
	.interpolate("basis")
    .x(function(d) { return x(d.dates); })
    .y(function(d) { return y(d.temperaturen); });

// define and append g element to SVG
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// que the 2 json files 
queue()
.defer(d3.json, 'KNMI2000.json')
.defer(d3.json, 'KNMI2010.json')
.await(loaddata);

//function to draw the axis, the lines, and add the cross hair dot function
function loaddata(error, KNMI2000, KNMI2010){

 	KNMI2000.forEach(function(d){
 		if (error) throw error;

 		d.Datum = parseDate(d.Datum);
 		d.Gem = +d.Gem / 10;
      	d.Min = +d.Min / 10;
      	d.Max = +d.Max / 10;  
 	})

  	// create lists for gem/max/min containing date and temp
    var all_00 = d3.keys(KNMI2000[0]).filter(function (key) { return key !== "Datum";}).map(function(id) {
      return {
        id: id,
        values: KNMI2000.map(function(d) {
          return {dates: d.Datum, temperaturen: d[id]};
        })
      };
    });

       KNMI2010.forEach(function(d) {
 		if (error) throw error;
 		 d.Datum = parseDate(d.Datum);
 		 d.Gem = +d.Gem / 10;
      	d.Min = +d.Min / 10;
      	d.Max = +d.Max / 10;  

	})

	// create lists for gem/max/min containing date and temp
    var all_10 = d3.keys(KNMI2010[0]).filter(function (key) { return key !== "Datum";}).map(function(id) {
      return {
        id: id,
        values: KNMI2010.map(function(d) {
          return {dates: d.Datum, temperaturen: d[id]};
        })
      };
    });
  	
x.domain(d3.extent(KNMI2000, function(d) { return d.Datum; }));
y.domain([d3.min(KNMI2000, function(d) { return d.Min; }), d3.max(KNMI2000, function(d) { return d.Max; })]);

 color.domain(all_00.map(function(c) { return c.id; }));

 // make legend
  var legend = svg.selectAll('g')
      .data(all_00)
      .enter()
      .append('g')
      .attr('class', 'legend');

// set rect for legend
legend.append('rect')
  .attr('x', width - 20)
  .attr('y', function(d, i) {
    return i * 20;
  })
  .attr('width', 10)
  .attr('height', 10)
  .style('fill', function(d) {
    return color(d.id);
  });

// append text to legend
legend.append('text')
  .attr('x', width - 8)
  .attr('y', function(d, i) {
    return (i * 20) + 9;
  })
  .text(function(d) {
    return d.id;
  });

// draw x axis
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
.append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Datum");

// draw y axis
svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("class", "label")
  .attr("transform", "rotate(-90)")
  .attr("y", 12)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Temperatuur")

// add the data 
var temp_00 = svg.selectAll(".temp_00")
	.data(all_00)
	.enter().append("g")
	.attr("class", "temp_00")


// draw the line 
temp_00.append("path")
	.attr("class", "line")
	.attr("fill", "none")
	.attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { return color(d.id); });

// add text at and of lines 
temp_00.append("text")
      .datum(function(d) {
        return {
          id: d.id,
          value: d.values[d.values.length - 1]
        };
      })
      .attr("transform", function(d) {
        return "translate(" + x(d.value.dates) + "," + y(d.value.temperaturen) + ")";
      })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) {
        return d.id;
      });

// interactive corss hair
var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

// add black line to follow mouse 
// based on https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
mouseG.append("path") 
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");


// select datalines
var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(all_00)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

// add circles
mousePerLine.append("circle")
  .attr("r", 7)
  .style("stroke", function(d) {
    return color(d.id);
  })
  .style("fill", "none")
  .style("stroke-width", "1px")
  .style("opacity", "0");

// add text to line
mousePerLine.append("text")
  .attr("transform", "translate(10,3)");

// append a rect to catch mouse movements (can't catch mouse event on a g element)
mouseG.append('svg:rect') 
  .attr('width', width) 
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')

  // on mouse out hide line, circles and text
  .on('mouseout', function() { 
    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })

	// on mouse in show line, circles and text
	.on('mouseover', function() { 
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
	// mouse moving over canvas
	.on('mousemove', function() { 
	    var mouse = d3.mouse(this);
	    d3.select(".mouse-line")
	      .attr("d", function() {
	        var d = "M" + mouse[0] + "," + height;
	        d += " " + mouse[0] + "," + 0;
	        return d;
	      });

	// determine the position and get start and ending
    d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {

         	var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

      	// find target position
        while (true) {
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
            }
            if (pos.x > mouse[0]) end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break;
        }
        // add text at right position with one decimal
        d3.select(this).select("text")
            .text(y.invert(pos.y).toFixed(1));

        // translate crosshair location
        return "translate(" + mouse[0] + "," + pos.y + ")";
        });
      });

//button to swap over datasets
d3.select("body").append("button")
    .text("change data")
    .on("click",function(){
        //select new data
           update_to_10();
    });       
  };
}
