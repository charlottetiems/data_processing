/*
Charlotte Tiems #10774971
linked view of scatterplot and worldmap 
*/


window.onload = function() {


	queue()
	.defer(d3.json, 'Data/datascatter1.json')
	.defer(d3.json, 'Data/dataworldmap1.json')
	.await(make_view);

	function make_view(error, datascatter1, dataworldmap1) {

    if (error) throw error;
    make_map(dataworldmap1);
    draw(datascatter1);
    interactive(datascatter1);
}

	var svg; 
	var x; 
	var y; 
	var tooltip; 

}

// draw the data
function draw(datascatter1){

	// set the domains 
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

	// define and append g element to SVG
	svg = d3.select("body").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// set tooltip element 
	tooltip = svg.append("g")
	  .attr("class", "d3-tip")
	  .style("display", "none");
	 	
  	// transform datatypes
	datascatter1.forEach(function(d){
		d.Country = d.Country
		d.id = d.id
		d.ALE = +d.ALE 
		d.HLY = +d.HLY
		d.HPI = +d.HPI
	});

	// set x and y scale 
	x.domain([0, d3.max(datascatter1, function(d) { return d.HLY; })]).nice();
	y.domain([0, d3.max(datascatter1, function(d) { return d.ALE; })]).nice();


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
function interactive(datascatter1){	

	svg.selectAll(".dot")
	.data(datascatter1)
	.enter().append("circle")
	  .attr("class", function(d) { return "dot" + d.id; })
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
        tooltip.select("text").text(d.Country +  ", HLY: "
                                    + d.HLY  + ", ALE: " + d.ALE);

        });

	// append the text to tooltip
	tooltip.append("text")
	    .attr("x", 20)
	    .attr("dy", "1em")
	    .style("font-size", "1em")
	    .style("z-index", 9999)
	    .attr("font-weight", "bold");	    

	}

function make_map(dataworldmap1){
    // color scale for map
    var color = d3.scale.quantize()
        .range(["#990000", "#A62430", "#D63030", "#EB5C1C", "#FFC912", "#FCEB12", "#BAD15E", "#2EAB66", "#006600"]);
	worlddata = dataworldmap1
	var series = [];

	worlddata.forEach(function(d) {		
		
		 // get the minimum and maximum quality of life index
        var idxMax = d3.max(worlddata, function(d) {
            return d.HPI;
        });
        var idxMin = d3.min(worlddata, function(d) {
            return d.HPI;
        });

        // scale colors accordingly
        colorDomain = color.domain([idxMin, idxMax]);

        // create new array with prefered format
	    series.push([d["id"], d["Population"], d["Country"], colorDomain(d.HPI), d.HPI]);
		
		});	  
	 	
	var dataset = {};

	    // fill dataset in appropriate format
	series.forEach(function(item){ 
        var iso = item[0],
        	population = item[1],
            country = item[2],
            fillColor = item[3],
            hpi = item[4];
           
        dataset[iso] = {Population: population, fillColor: fillColor, Country: country, HPI: hpi  
    	};
    
	});

 // render datamap
	var map = new Datamap({element: document.getElementById('container'), 		
		projection: 'mercator',
		scope: 'world',
    	projection: 'mercator',
    	data: dataset,
    	fills: {
    		defaultFill:"#a8a49f"
    	},

		/*
		when a country on the map is clicked, highlight it and scroll down to the scatterplot,
		highlighting the dot for that country
		*/ 

		done: function(datamap) {
        	datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
				window.scrollTo(0, 640);
				d3.selectAll('.dot')
						.style('fill','#ffdd75')
						.attr("r", 5);

				var currentCountry = d3.select(this).attr("class").split(" ")[1];
				d3.select(".dot" + currentCountry).attr("r", 50)
					.style("fill", "#3412cc")
					.attr("r", 10);	
        });

    },      

        geographyConfig: {
    	borderOpacity: 1,
    	highlightBorderWidth: 2,
    	highlightFillColor: function(geo) {
        return geo['fillColor'] || '#605e5c';
      },

    	highlightBorderOpacity: 1,

    	// change border on mouse hover
    	highlightBorderColor: '#000000',
   
        // show desired information in tooltip	
		popupTemplate: function(geo, data) {

            // show special tooltip if country is not in dataset
            if (!data) { return ['<div class="hoverinfo">',
            	'No data available for this country',
            	'</div>'].join('');}

            // include country and raw data in tooltip
            return ['<div class="hoverinfo">',
                '<strong>', geo.properties.name, '</strong>',
                '<br> Population: <strong>', data.Population, '</strong>',
					'<br>Happy Planet Index: <strong>', data.HPI, '</strong>',
					'</div>'].join('');

        	}    	
    	}
	});				
}
	


	