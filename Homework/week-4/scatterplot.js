/* Charlotte Tiems (#10774971)
Scaterplot of the Life expectancy and Happy Life years, 
The colors of the dots define the rank of the Happy Lfe Index of each country
The size of the dots represent the size of the population
*/


window.onload=function(){

//set the domains 
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
   

// set x, y and r scale 
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var r_scale = d3.scale.linear()
    .range([0, 70])

// give dots color for which HPI content the dot is in
var color = d3.scale.ordinal()
    .domain(["36.7 > ", "32.7 - 36.6", "28.7 - 32.6", "24.8 - 28.6", "20.8 - 24,7", "< 20.8", "Unknown Data"])
    .range(["#1a9850", "#66bd63","#a6d96a","#fae110","#fa7f10","#ed0d10", "#a8a0a0"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

//define and append g element to SVG
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//set tooltip element 
var tooltip = svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");


// load json data in 
d3.json("scatterplot.json", function(error, data) {
	console.log(data)
  data.forEach(function(d) {  
  	d.Average_life_expectancy = +d.Average_life_expectancy
    d.Happy_life_year = +d.Happy_life_year; 
    d.Population = +d.Population;
   });

  // set x and y scale 
  x.domain(d3.extent(data, function(d) { return d.Happy_life_year; })).nice();
  y.domain(d3.extent(data, function(d) { return d.Average_life_expectancy; })).nice();
  r_scale.domain(d3.extent(data, function(d) { return d.Population; })).nice();

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


    // set place dots and size (size dots + 3 to see each dote) 
    svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return r_scale(d.Population) + 3; }) 
      .attr("cx", function(d) { return x(d.Happy_life_year); })
      .attr("cy", function(d) { return y(d.Average_life_expectancy); })
      .style("fill", function(d) { return color(d.HPI); })

      // add tooltip at mouse over bar
      .on("mouseover", function() {
        tooltip.style("display", null);
         d3.select(this).attr("r", function(d) { return r_scale(d.Population) + 7; })
         .style("fill", "#3412cc") 
  
        })
      // when the mouse is off the bar
      .on("mouseout", function() {
        tooltip.style("display", "none");
        d3.select(this).attr("r", function(d) { return r_scale(d.Population) + 3; })
        .style("fill", function(d) { return color(d.HPI); });
        })

      // add position and text to tooltip
      .on("mousemove", function(d) {
        var x_pos = d3.mouse(this)[0] - 15;
        var y_pos = d3.mouse(this)[1] - 20;
        tooltip.attr("transform", "translate(" + x_pos + "," + y_pos + ")");   
        tooltip.select("text").text(d.Country +  ", Population: "
                                    + d.Population);
        });

//append the text to tooltip
tooltip.append("text")
    .attr("x", 20)
    .attr("dy", "1em")
    .style("font-size", "1em")
    .attr("font-weight", "bold");


// define the legend element and append g 
var legend = d3.select('svg')
    .append("g")
    .selectAll("g")
    .data(["36.7 > ", "32.7 - 36.6", "28.7 - 32.6", "24.8 - 28.6", "20.8 - 24,7", "< 20.8", "Unknown Data"])
    .enter()
    .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")"; });

    
// add color to rect
  legend.append("rect")
    .attr("x", width - 18)
    .attr("y", 150)
    .attr("width", 18 )
    .attr("height", 18)
    .style('fill', color)
 
// add text to legend
legend.append("text")
    .attr("x", width - 24)
    .attr("y", 158)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return d; });

   });

}