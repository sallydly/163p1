//set dimensions and margins of the graph
var v2_margin = {top: 20, right: 20, bottom: 30, left: 50}
  width2 = 960 - v2_margin.left - v2_margin.right,
  height2 = 500 - v2_margin.top - v2_margin.bottom;
  
//set the axes (set the domains later when we upload the data sans color)
var v2_x = d3.scaleBand() //Months
  .rangeRound([0, width2]) //length of x-axis
  .padding(0.2) //spacing between bars
  .align(0.5);
  
var v2_y = d3.scaleLinear() //count
  .range([height2, 0]);
  
var v2_colors = d3.scaleOrdinal()
  .range(["#4286f4", "#ff4d88", "#a3a3c2"]);
  
var v2_legendRectSize = 15;
var v2_legendXSpacing = 10;
var v2_legendYSpacing = 3;
var v2_legendBox = width2 - 5 * v2_margin.top

//making the svg object in the html
var v2_svg = d3.select("#vis2").append("svg")
    .attr("width", width2 + v2_margin.left + v2_margin.right)
    .attr("height", height2 + v2_margin.top + v2_margin.bottom);
  
var v2_g = v2_svg.append("g") //the inner canvas
          .attr("transform", "translate(" + v2_margin.left + "," + v2_margin.top + ")"); //origin at top left
    
//upload the data with d3 and edit appropriately

function v2_render(data) {
  //render data so data can be stacked
  var stack = d3.stack()
    .keys(["male", "female", "unknown"])
    .order(d3.stackOrderNone);
    
  var series = stack(data);
  
  //make the domains for variables x and y
  v2_x.domain(data.map(function(d) { return d.month;} ) ); //Jan-Dec
  v2_y.domain([0, d3.max(data, function(d) { return d.tot_crimes; } ) ]);
  
  //add the axises onto the page
  //x-axis
  v2_g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, " + height2 + ")")
    .call(d3.axisBottom(v2_x).tickSize(0).tickPadding(13));

  //y-axis
  v2_g.append("g")
      .attr("class", "axis")  
      .call(d3.axisLeft(v2_y))
    .append("text")
      .attr("x", -50)
      .attr("y",-13)
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Total Recorded # of Crimes")

  v2_g.append("text")
    .attr("class", "txt")
    .attr("x", -49)
    .attr("y",-3)
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .text("in Kansas City");  

  //add a g tag to each layer (male, female, unknown)
  var layers = v2_g.selectAll("v2_g.layer")
    .data(series, function(d) { return d.key; })
    .enter()
      .append("g")
        .attr("class", "layer")
        .attr("fill", function(d) { return v2_colors(d.key); }); //diff colors
        
  //finally! bind rectangles to each layer
  layers.selectAll("rect")
    .data(function(d) { return d; })
    .enter()
      .append("rect")
        .attr("width", v2_x.bandwidth())
        .attr("x", function(d) { return v2_x(d.data.month); })
        .attr("y", function(d) { return v2_y(d[1]); })
        .attr("height", function(d) { return v2_y(d[0]) - v2_y(d[1]); });
        
  //add legend
  var v2_legend = v2_g.selectAll(".legend") //add border via css
    .data(["male", "female", "unknown"])
    .enter()
      .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate("+ v2_legendBox + "," + i * 20 + ")"; });
        
  v2_legend.append("rect")
    .attr("width", v2_legendRectSize)
    .attr("height", v2_legendRectSize)
    .style("fill", v2_colors);
    
  v2_legend.append("text")
    .attr("x", v2_legendRectSize + v2_legendXSpacing)
    .attr("y", v2_legendRectSize - v2_legendYSpacing)
    .text(function(d) { return d; });
    
}
        
function v2_convert(d) {
  d.female = +d.female;
  d.male = +d.male;
  d.unknown = +d.unknown;
  d.tot_crimes = +d.tot_crimes;
  
  return d;
}
       
d3.csv("crime_data_aggregated_month.csv", v2_convert, v2_render);
  
  