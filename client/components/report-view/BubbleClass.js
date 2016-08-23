import d3 from 'd3';

var BubbleClass = function(data) {
  this.bubbles = null;
  this.bubble = null;
  this.nodes = null;
  this.svg; 
  this.color;
}

BubbleClass.prototype.blow = function(element) { // make bubble
  // Only want to create SVG element; no drawing occurs here

  // bubble settings
  var diameter = 1080,
      format = d3.format(',d');
  this.color = d3.scale.category20();

  this.bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, diameter])
      .value(function(d) {
        // console.log('inside', d);
        return d.score;
      })
      .padding(1.5)

// create svg element
  this.svg = d3.select(element).append('svg')
      .attr('width', diameter)
      .attr('height', diameter)
      .attr('class', 'bubble');
};

BubbleClass.prototype.update = function(data) {

  // format data
  this.nodes = this.bubble.nodes({children: data})
                    .filter(function(d) { 
                      return !d.children; 
                    });

  //setup the chart
  this.bubbles = this.svg.append('g')
    .attr('transform', 'translate(0,0)')
    .selectAll('.bubble') // TODO: add onClick here?
    .data(this.nodes)
    .enter(); // appends extra nodes to data

  //create the bubbles
  this.bubbles.append('circle')
    .attr('r', function(d){ 
      // console.log('dINBUBBLECLASS', d);
      return d.r; 
    })
    .attr('cx', function(d){ return d.x; })
    .attr('cy', function(d){ return d.y; })
    .style('fill', (d) => (this.color(d.value)) )
    .on('click', function(bubl) { window.open(bubl.wikiURL); });

  // format the text displayed for each bubble
  this.bubbles.append('text')
    .attr('x', function(d){ return d.x; })
    .attr('y', function(d){ return d.y + 5; })
    .attr('text-anchor', 'middle')
    .text(function(d) { return d.topic.substring(0, d.r / 5); })
    .style({
      'fill':'white', 
      'font-family':'Roboto, Helvetica Neue, Helvetica, Arial, san-serif',
      'font-size': '16px'
    });
};

module.exports = BubbleClass;