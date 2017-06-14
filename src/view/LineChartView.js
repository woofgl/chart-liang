var d = window.mvdom; // external/global lib
var d3 = window.d3;

var render = require("../js-app/render.js").render;
var ajax = require("../js-app/ajax.js");
var LineChart = require("./chart/LineChart.js");

// --------- View Controller --------- //
d.register("LineChartView",{
	create: function(data, config){
		return render("LineChartView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first. 


		view._chart = new LineChart().init(view.el);

		ajax.get("/data/data.json").then(function(data){
			view._chart.update(data);
		});
	}

});
// --------- /View Controller --------- //