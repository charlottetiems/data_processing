// Name: Charlotte Tiems 
// Student number: 10774971
// Barchart average monthly temperature in 2015 in the Bilt 


// Setting chart margin
var margin = {top: 25, right: 100, bottom: 25, left: 50},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Set the ranges x and y
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
var y = d3.scale.linear().range([height, 0]);

// setting xAxis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// setting yAxis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(12);
    

// defining the d3 tip toolbox to show temperatuur at each bar       
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return "<strong>Gemiddelde temperatuur:</strong> <span \
                    style='color:turquoise'>" + d.Temperatuur + "</span>" });
   

// adding the svg element and giving it his attributes
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// call the tooltip on the svg
svg.call(tip);

// load the json data 
d3.json("temperaturen.json", function(error, data) {
    data.forEach(function(d) {
        d.Month = d.Month;
        d.Temperatuur = +d.Temperatuur;
    });
  
  // scale the domain for x and y
  x.domain(data.map(function(d) { return d.Month; }));
  y.domain([0, d3.max(data, function(d) { return d.Temperatuur; })]);


  // add x-axis with 'month' at the end 
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
        .attr("y", 8)
        .attr("x", 500)
        .style("text-anchor", "end")
        .text("Month");


  // add y-axis and add 'Temperatuur (Celcius)'
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperatuur (Celcius)");

  // add bar chart and create width rectangles and add tip function 
  var bars = svg.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Month); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Temperatuur); })
      .attr("height", function(d) { return height - y(d.Temperatuur); })
      
      // shows data when mouse is at a bar
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
  
});
