//d3.select("input[value=\"total\"]").property("checked", true);

// svg.append("g")
	// .attr("class", "slices");

//set dimensinons for pie chart
var margin = {top: 20, right: 20, bottom: 30, left: 50};

var width2 = 960,
  height2 = 500
  radius = Math.min(width2, height2), 2;

var v2_svg = d3.select("#vis2").append("svg")
      .attr("width", width2)
      .attr("height", height2)
    .append("g")
      .attr("transform", "translate(" + width2 / 2  + "," + height2 / 2 + ")");
  
  
var pie = d3.pie()
  .sort(null)
  .value(function(d) {return d.total;} ); //data format(Category: "", value: #)
  
var arc = d3.arc()
  .innerRadius(radius - 170)
  .outerRadius(radius - 20);
  
var v2_legendRectSize = radius * 0.05;
var v2_legendSpacing = radius * 0.02;

//var div = d3.select("#vis2").append("div").attr("class", "toolTip");

var v2_colors = d3.scaleOrdinal(d3.schemeCategory20);

//upload csv

function v2_render(data) {
  var path = v2_svg.datum(data).selectAll("path")
      .data(pie)
    .enter().append("path")
      .attr("fill", function(d, i) {return v2_colors(i);}) //fill pie chart with colors
      .attr("d", arc)
      .each(function(d) {this._current = d; }); //store initial angles
  
  d3.selectAll("input")
    .on("change", change);

  function change() {
    var val;
    if (this.value == "male") {
      val = m;
    }
    else if (val == "female") {
      val = f;
    }
    else if (val == "total") {
      val = total;
    }
    console.log(data[val]);
    pie.value(function(d) { return d[val]; }); //change values to new ones
    path = path.data(pie); //compute new angles
    path.transition().duration(1000).attrTween("d", arcTween); //redraw aarcs
  }
}

function v2_convert(d) {
  d.f = +d.f;
  d.m = +d.m;
  d.total = +d.total;
  return d;
}

d3.csv("crime_data_sex_crimes.csv", v2_convert, v2_render);

function arcTween(a) {
  this._current = this._current || d;
  var interpolate = d3.interpolate(this._current, d);
  this._current = interpolate(0);
  return function(t) {
      return arc(interpolate(t));
  };
}
