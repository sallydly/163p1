d3.select("input[value=\"total\"]").property("checked", true);

//set dimensinons for pie chart
var width3 = 960,
  height3 = 500
  radius = Math.min(width3, height3) / 2; 

var v3_svg = d3.select("#vis3").append("svg")
      .attr("width", width3)
      .attr("height", height3)
    .append("g")
      .attr("transform", "translate(" + width3 / 2  + "," + height3 / 2 + ")");
  
  
var pie = d3.pie() //default value
  .sort(null)
  .value(function(d) {return d.total;} ); //data format(d.rows, d.f, d.m, d.total)
  
var arc = d3.arc()
  .innerRadius(radius - 100)
  .outerRadius(radius - 20);
  
var v3_legendRectSize = radius * 0.05;
var v3_legendSpacing = radius * 0.02;

var v3_colors = d3.scaleOrdinal(d3.schemeCategory20);

//upload csv

function v3_render(data) {
  var path = v3_svg.datum(data).selectAll("path")
      .data(pie)
    .enter().append("path")
      .attr("fill", function(d, i) {return v3_colors(i);}) //fill pie chart with colors
      .attr("d", arc)
      .each(function(d) {this._current = d; }); //store initial angles
      
  var v3_legend = v3_svg.selectAll(".legend")
    .data(data)
  .enter()
    .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        var height = v3_legendRectSize + v3_legendSpacing;
        var offset =  height * v3_colors.domain().length / 2;
        var horz = -8 *  v3_legendRectSize;
        var vert = i * height - offset;
        return "translate(" + horz + "," + vert + ")";
      });
  
  v3_legend.append("rect") //the color boxes
    .data(v3_colors.domain())
    .attr("width", v3_legendRectSize)
    .attr("height", v3_legendRectSize)
    .style("fill", v3_colors) 
    .style("stroke", v3_colors);
    
  v3_legend.append("text") 
    .style("stroke", function(d, i) { return v3_colors(i); })
    .attr("x", v3_legendRectSize + v3_legendSpacing + 1)
    .attr("y", v3_legendRectSize - v3_legendSpacing + 4)
    .text(function(d) {return d.row;});
  
  d3.selectAll("input")
    .on("change", change);

  function change() {
    if (this.value == "male") {
      pie.value(function(d) { return d.m; }); //change values to new ones
    }
    else if (this.value == "female") {
      pie.value(function(d) { return d.f; }); 
    }
    else if (this.value == "total") {
      pie.value(function(d) { return d.total; }); 
    }
    path = path.data(pie); //compute new angles
    path.transition().duration(1000).attrTween("d", arcTween); //redraw aarcs
  }
}

function v3_convert(d) { //convert strings to numbers
  d.f = +d.f;
  d.m = +d.m;
  d.total = +d.total;
  return d;
}

d3.csv("crime_data_sex_crimes.csv", v3_convert, v3_render);

function arcTween(d) {
  this._current = this._current || d;
  var interpolate = d3.interpolate(this._current, d);
  this._current = interpolate(0);
  return function(t) {
      return arc(interpolate(t));
  };
}
