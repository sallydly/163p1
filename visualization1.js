//set dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 50}
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
  
//set the axes (set the domains later when we upload the data sans color)
var x = d3.scaleBand() //Months
  .rangeRound([0, width]) //length of x-axis
  .padding(0.2) //spacing between bars
  .align(0.5);
  
var y = d3.scaleLinear() //count
  .range([height, 0]);
  
var colors = d3.scaleOrdinal()
  .range(["#4286f4", "#ff4d88", "#a3a3c2"]);
  
var legendRectSize = 15;
var legendXSpacing = 10;
var legendYSpacing = 3;
var legendBox = width - 5 * margin.top

//making the svg object in the html
var svg = d3.select("#vis1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  
var g = svg.append("g") //the inner canvas
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //origin at top left
    
//upload the data with d3 and edit appropriately

function render(data) {
  //render data so data can be stacked
  var stack = d3.stack()
    .keys(["male", "female", "unknown"])
    .order(d3.stackOrderNone);
    
  var series = stack(data);
  
  //make the domains for variables x and y
  x.domain(data.map(function(d) { return d.month;} ) ); //Jan-Dec
  y.domain([0, d3.max(data, function(d) { return d.tot_crimes; } ) ]);
  
  //add the axises onto the page
  //x-axis
  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(d3.axisBottom(x).tickSize(0).tickPadding(13));

  //y-axis
  g.append("g")
      .attr("class", "axis")  
      .call(d3.axisLeft(y))
    .append("text")
      .attr("x", -50)
      .attr("y",-13)
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Total Recorded # of Crimes")

  g.append("text")
    .attr("class", "txt")
    .attr("x", -49)
    .attr("y",-3)
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text("in Kansas City");  

  //add a g tag to each layer (male, female, unknown)
  var layers = g.selectAll("g.layer")
    .data(series, function(d) { return d.key; })
    .enter()
      .append("g")
        .attr("class", "layer")
        .attr("fill", function(d) { return colors(d.key); }); //diff colors
        
  //finally! bind rectangles to each layer
  layers.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
      .append("rect")
        .attr("width", x.bandwidth())
        .attr("x", function(d) { return x(d.data.month); })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); });
        
  //add legend
  var legend = g.selectAll(".legend") //add border via css
    .data(["male", "female", "unknown"])
    .enter()
      .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate("+ legendBox + "," + i * 20 + ")"; });
        
  legend.append("rect")
    .attr("height", 40)
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .style("fill", colors);
    
  legend.append("text")
    .attr("x", legendRectSize + legendXSpacing)
    .attr("y", legendRectSize - legendYSpacing)
    .text(function(d) { return d; });
    
}
        
function convert(d) {
  d.female = +d.female;
  d.male = +d.male;
  d.unknown = +d.unknown;
  d.tot_crimes = +d.tot_crimes;
  
  return d;
}
       
d3.csv("crime_data_aggregated_month.csv", convert, render);
  
  