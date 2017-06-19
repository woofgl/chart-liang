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
	var rx = self._width / 2;
	var ry = self._height / 2;

	var arc = self._svg.selectAll(".arc")
		.data(self._pie(data))
		.enter().append("g")
		.attr("x", rx)
		.attr("y", ry)
		.attr("class", "arc")
		.on("click", function(d){
			var part = d3.select(this);
			var distance = 50;
			var midAngle = (d.endAngle + d.startAngle) / 2;
			var x = 0, y = 0;
			if(midAngle <= Math.PI / 2){
				x = Math.sin(midAngle) * distance;
				y = -1 * Math.cos(midAngle) * distance;
			}else if(midAngle > Math.PI / 2 && midAngle <= Math.PI){
				x = Math.cos(midAngle - Math.PI / 2) * distance;
				y = Math.sin(midAngle - Math.PI / 2) * distance;
			}else if(midAngle > Math.PI && midAngle <= Math.PI * 3 / 2){
				x = -1 * Math.sin(midAngle - Math.PI) * distance;
				y = Math.cos(midAngle - Math.PI) * distance;
			}else{
				x = -1 * Math.cos(midAngle - Math.PI * 3 / 2) * distance;
				y = -1 * Math.sin(midAngle - Math.PI * 3 / 2) * distance;
			}
			part.transition().duration(1000).attr("transform", "translate(" + x + ", " + y + ")");
		});

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

	return self;
};

// --------- /PieChart --------- //