/* Charlotte Tiems 10774971
KNMI plot of gem, max and min temperaturen van de jaren 2000 en 2010
*/

window.onload = function() {
	queue()
	.defer(d3.json, 'KNMI2000.json')
	.defer(d3.json, 'KNMI2010.json')
	.await(loaddata);
 function loaddata(error, KNMI2000, KNMI2010){
    console.log(KNMI2000, KNMI2010)
  }
};