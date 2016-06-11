import d3 from 'd3';

export default BubbleChart = function(data) {
  this.data = data;
  this.bubbles = null;
  this.nodes = null;
  this.svg; 
  this.color;
}

BubbleChart.prototype.blow = function(element) {
  var diameter = 500,
      format = d3.format(",d");
  this.color = d3.scale.category20();
  console.log('this.color', this.color);

  var bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, diameter])
      .value(function(d) {
        console.log('inside', d);
        return d.score;
      })
      .padding(1.5)

  this.svg = d3.select(element).append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

  this.nodes = bubble.nodes({children: this.data})
                .filter(function(d) { 
                  return !d.children; 
                });
};

BubbleChart.prototype.update = function() {
  //setup the chart
  this.bubbles = this.svg.append("g")
    .attr("transform", "translate(0,0)")
    .selectAll(".bubble") // TODO: add onClick here?
    .data(this.nodes)
    .enter(); // appends extra nodes to data

  //create the bubbles
  this.bubbles.append("circle")
    .attr("r", function(d){ return d.r; })
    .attr("cx", function(d){ return d.x; })
    .attr("cy", function(d){ return d.y; })
    .style("fill", (d) => (this.color(d.value)) )
    .on("click", function(bubl) { window.open(bubl.wikiURL); });

  // format the text for each bubble
  this.bubbles.append("text")
    .attr("x", function(d){ return d.x; })
    .attr("y", function(d){ return d.y + 5; })
    .attr("text-anchor", "middle")
    .text(function(d){ return d.topic; })
    .style({
      "fill":"white", 
      "font-family":"Roboto, Helvetica Neue, Helvetica, Arial, san-serif",
      "font-size": "16px"
    });
};

// TODO: How to destroy?
BubbleChart.prototype.pop = function() {

};