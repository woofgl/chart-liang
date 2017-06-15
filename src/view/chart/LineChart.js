var d3 = window.d3;

module.exports = LineChart;

function LineChart(){

}

// opts
//  - xMax: the max x domain scale
LineChart.prototype.init = function(el, opts){
	var self = this;

	self._opts = opts; // TODO: need to have some default
	
	// Set the dimensions of the canvas / graph
	var margin = self._margin = {top: 30, right: 20, bottom: 30, left: 50};
	var width = self._width = el.clientWidth - margin.left - margin.right;
	var height = self._height = el.clientHeight - margin.top - margin.bottom;

	// Parse the date / time
	self._parseDate = d3.timeParse("%d-%b-%y");

	// Set the ranges
	self._x = d3.scaleTime().range([0, width]);
	self._y = d3.scaleLinear().range([height, 0]);

	// Define the axes
	self._xAxis = d3.axisBottom().scale(self._x).ticks(5);

	self._yAxis = d3.axisLeft().scale(self._y).ticks(5);

	// Define the line
	self._valueline = d3.line()
		.x(function(d) { return self._x(d.date); })
		.y(function(d) { return self._y(d.close); });
		
	// Adds the svg canvas
	self._svg = d3.select(el)
		.append("svg")
			.attr("class", "LineChart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", 
				  "translate(" + margin.left + "," + margin.top + ")");
	return self;
};

LineChart.prototype.update = function(data){
	var self = this;

	data.forEach(function(d) {
		d.date = self._parseDate(d.date);
		d.close = + d.close;
	});

	// Scale the range of the data
	self._x.domain(d3.extent(data, function(d) { return d.date; }));
	self._y.domain([0, d3.max(data, function(d) { return d.close; })]);


	// Add the X Axis
	self._svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + self._height + ")")
		.call(self._xAxis);

	// Add the Y Axis
	self._svg.append("g")
		.attr("class", "y axis")
		.call(self._yAxis);

	// Add the valueline path.
	self._svg.append("path")
		.attr("class", "line")
		.transition()
		.attr("d", self._valueline(data));

	// Add 'curtain' rectangle to hide entire graph //
	var curtain = self._svg.append('rect')
		.attr('x', 1)
		.attr('y', -1)
		.attr('height', self._height + 1)
		.attr('width', self._width)
		.attr('class', 'curtain');

	var t = self._svg.transition()
		.delay(750)
		.duration(6000)
		.ease(d3.easeLinear)
		.on('end', function() {
			d3.select('rect.curtain')
			.remove();
		});
	
	t.select('rect.curtain').attr('x', self._margin.left + self._width);

	return self;
};

// --------- /LineChart --------- //