var d3 = window.d3;

module.exports = PieChart;

function PieChart(){

}

// opts
//  - xMax: the max x domain scale
PieChart.prototype.init = function(el, opts){
	var self = this;

	self._opts = opts; // TODO: need to have some default
	
	// Set the dimensions of the canvas / graph
	var margin = self._margin = {top: 30, right: 20, bottom: 30, left: 50};
	var width = self._width = el.clientWidth - margin.left - margin.right;
	var height = self._height = el.clientHeight - margin.top - margin.bottom;

	// Parse the date / time
	self._parseDate = d3.timeParse("%d-%b-%y");

	var radius = Math.min(width, height) / 2 - 20;
	
	self._colors = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	self._pie = d3.pie()
		.sort(null)
		.value(function(d) { return d.population;});

	self._path = d3.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	self._label = d3.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);
		
	// Adds the svg canvas
	self._svg = d3.select(el)
		.append("svg")
			.attr("class", "PieChart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	return self;
};

PieChart.prototype.update = function(data){
	var self = this;

	var arc = self._svg.selectAll(".arc")
		.data(self._pie(data))
		.enter().append("g")
		.attr("x", self._width / 2)
		.attr("y", self._height / 2)
		.attr("class", "arc");

	arc.append("path")
		.attr("fill", function(d) { return self._colors(d.data.age); })
		.transition().duration(1000)
		.attrTween("d", function (d) { 
			var start = {startAngle: 0, endAngle: 0};
			var interpolate = d3.interpolate(start, d);
			return function (t) {
				return self._path(interpolate(t));
			};
		});

	arc.append("text")
		.attr("transform", function(d) { return "translate(" + self._label.centroid(d) + ")"; })
		.attr("dy", "0.35em")
		.text(function(d) { return d.data.age; });



	// arc.append("path")
	// 	.attr("d", d3.arc().outerRadius(50 - 10).innerRadius(0).startAngle(0))
	// 	.attr("class", "test")
	// 	.attr("fill", "red");

	// // // Add 'curtain' rectangle to hide entire graph //
	// var curtainRadius = Math.max(self._width / 2, self._height / 2);
	// var curtain = self._svg.append('rect')
	// 	.attr('x', 0)
	// 	.attr('y', 0)
	// 	.attr('height', self._height)
	// 	.attr('width', self._width)
	// 	.attr('class', 'curtain');

	// var t = self._svg.transition()
	// 	.delay(750)
	// 	.duration(6000)
	// 	.ease(d3.easeLinear)
	// 	.on('end', function() {
	// 		d3.select('rect.curtain')
	// 		.remove();
	// 	});
	
	// t.select('rect.curtain').attr('x', self._margin.left + self._width);

	return self;
};

// --------- /PieChart --------- //