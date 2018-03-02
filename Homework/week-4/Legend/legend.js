// Charlotte Tiems (#10774971)
// This file makes an legend of the Happy Planet life Index by using an SVG element 


// set the text, colors, and dimensions
var color = d3.scale.ordinal()
    .domain(["36.7 > ", "32.7 - 36.6", "28.7 - 32.6", "24.8 - 28.6", "20.8 - 24,7", "< 20.8", "Unknown Data"])
    .range(["#1a9850", "#66bd63","#a6d96a","#fae110","#fa7f10","#ed0d10", "#a8a0a0"]);
var dimension = {width: 15, height: 15, padding: 2};

// define the legend element and append g 
var legend = d3.select('svg')
    .append("g")
    .selectAll("g")
    .data(color.domain())
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        return "translate(0," + i * 20 + ")"; });
    
// add color to rect
      legend.append('rect')
    .attr('width', dimension.width)
    .attr('height', dimension.height)
    .style('fill', color)
    .style('stroke', color);

// add text to legend
legend.append('text')
    .attr('x', dimension.width + dimension.padding)
    .attr('y', dimension.height - dimension.padding)
    .text(function(d) { return d; });