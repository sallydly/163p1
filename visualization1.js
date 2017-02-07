//set margins, width, and height
var margin = {top: 20, right: 20, bottom: 30, left: 50},
  height = 500 - margin.left - margin.right,
  width = 960 - margin.top - margin.bottom;
  
//set ranges
var x = d3.scaleLinear() //age
  .range([0, width])
  
var y = d3.scaleLinear() //count of incidents
  .range([height, 0]);

var colors = d3.scaleOrdinal()
  .range(["#e62e00", "#00ffbf"]);
  
//set legend attributes
var legendRectSize = 15;
var legendXSpacing = 10;
var legendYSpacing = 3;

//define lines
var arr_line = d3.line()
  .x(function(d) { return x(d.age); })
  .y(function(d) { return y(d.arr); });
  
var vic_line = d3.line()
  .x(function(d) { return x(d.age); })
  .y(function(d) { return y(d.vic); });
  
//create svg object
var svg = d3.select("#vis1").append("svg")
    .attr("width", width + margin.top + margin.bottom)
    .attr("height", height + margin.left + margin.right)
 
var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
//get the data
function render(data) {
  //add domains to variables x and y
  x.domain([0, d3.max(data, function(d) { return d.age; })]);
  y.domain([0, d3.max(data, function(d) { return Math.max(d.arr, d.vic); })]); //get the max number of recorded incidents from either col

  //append axes
  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(d3.axisBottom(x))
    .append("text")
      .attr("x", width / 2 - margin.right - margin.left)
      .attr("y", 2 * margin.top)
      .attr("fill", "#000")
      .attr("font-size", 15)
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Age");
    
  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("x", -1.7 * margin.right)
      .attr("y", -10)
      .attr("fill", "#000")
      .attr("font-size", 10)
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Number of Recorded Crimes");
  
  //draw lines
  //draw arr path
  g.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "#e62e00")
    .attr("d", arr_line);
    
  //draw vic path
  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("class", "line")
    .attr("stroke", "#00ffbf")
    .attr("stroke-width", 2)
    .attr("d", vic_line);
    
  //make a legend
  var legend = g.selectAll(".legend")
      .data(["arrested", "victims"])
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        var height = legendRectSize + legendYSpacing;
        var offset =  height * .5;
        var horz = width - margin.right -  2 * margin.left;
        var vert = i * height - offset;
        return "translate(" + horz + "," + vert + ")";
      });
  
  legend.append("rect")
    .attr("height", legendRectSize)
    .attr("width", legendRectSize)
    .style("fill", colors);
    
  legend.append("text") 
    .attr("x", legendRectSize + legendXSpacing - 3)
    .attr("y", legendRectSize + legendYSpacing - 7)
    .text(function(d) { return d; });
}

function convert(d) {
  d.age = +d.age;
  d.arr = +d.arr;
  d.vic = +d.vic;
  
  if (d.arr == "") {
    d.arr = 0;
  }
  if (d.vic == "") {
    d.vic = 0;
  }
  
  return d;
}

d3.csv("crime_data_age.csv", convert, render);