/*
Charlotte Tiems #10774971
linked view of scatterplot and worldmap 
*/


window.onload = function() {

	queue()
	.defer(d3.json, 'ALE_HLY.json')
	.defer(d3.json, 'Population.json')
	.await(make_view);

	function make_view(error, ALE_HLY, Population) {

    if (error) throw error;
    make_map(Population);
    draw(ALE_HLY);
    interactive(ALE_HLY);
}

var svg; 
var x; 
var y; 
var tooltip; 

}

//draw the data
function draw(ALE_HLY){

//set the domains 
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom
    radius = 4;
   
// set x, y scale 
x = d3.scale.linear()
    .range([0, width]);

y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

//define and append g element to SVG
svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//set tooltip element 
tooltip = svg.append("g")
  .attr("class", "d3-tip")
  .style("display", "none");
	


  	//transform datatypes
	ALE_HLY.forEach(function(d){
		d.Country = d.Country
		d.ALE = +d.ALE 
		d.HLY = +d.HLY

	});

	// set x and y scale 
	x.domain([0, d3.max(ALE_HLY, function(d) { return d.HLY; })]).nice();
	y.domain([0, d3.max(ALE_HLY, function(d) { return d.ALE; })]).nice();


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
	  .text("Happy Life year");

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
	  .text("Average life expectancy")
	};

	 
// add dots in scatterplot and add interactivity 	
function interactive(ALE_HLY){
	console.log(ALE_HLY)

	svg.selectAll(".dot")
	.data(ALE_HLY)
	.enter().append("circle")
	  .attr("class", "dot")
	  .attr("r", 3)
	  .attr("cx", function(d) { return x(d.HLY); })
	  .attr("cy", function(d) { return y(d.ALE); })
	  .style("fill", "gold")
	  .style("stroke", "black")
   
   // add tooltip at mouse over bar
      .on("mouseover", function() {
        tooltip.style("display", null);
         d3.select(this).attr("r", 8)
         .style("fill", "#3412cc") 
  
        })
      // when the mouse is off the bar
      .on("mouseout", function() {
        tooltip.style("display", "none");
        d3.select(this).attr("r", 3)
        .style("fill", "gold");
        })

      // add position and text to tooltip
      .on("mousemove", function(d) {
        var x = d3.mouse(this)[0] - 15;
        var y = d3.mouse(this)[1] - 20;
        tooltip.attr("transform", "translate(" + x + "," + y + ")");   
        tooltip.select("text").text(d.Country +  ", Happy life years: "
                                    + d.HLY  + ", Average life expectancy: " + d.ALE);

        });

	//append the text to tooltip
	tooltip.append("text")
	    .attr("x", 20)
	    .attr("dy", "1em")
	    .style("font-size", "1em")
	    .attr("font-weight", "bold");

	}

function make_map(Population){
 // Render datamap
var map = new Datamap({element: document.getElementById('container'), 		
		projection: 'mercator',
		fills: {
			defaultFill: 'lightgrey'
		}, 
		// data: Population,
		// geographyConfig: {
		// 	// show country information in the tooltip
		// 	popupTemplate: function(geo, data) {
		// 		console.log(geo, data)
		// 		// don't show tooltip if a country is not in the dataset
		// 		if (!data) { return ; }
		// 		// tooltip content
		// 		return ['<div class="hoverinfo">',
		// 			'<strong>', geo.properties.name, '</strong>',
		// 			'<br>Population: <strong>', data.Population, '</strong>',
		// 			'<br>Population: <strong>', data.Population, '</strong>',
		// 			'</div>'].join('');

					
		})
	}


	