var d = window.mvdom; // external/global lib
var d3 = window.d3;

var render = require("../js-app/render.js").render;
var ajax = require("../js-app/ajax.js");
var PieChart = require("./chart/PieChart.js");

// --------- View Controller --------- //
d.register("PieChartView",{
	create: function(data, config){
		return render("PieChartView");
	}, 

	postDisplay: function(){
		var view = this; // best practice, set the view variable first. 


		view._chart = new PieChart().init(view.el);

		ajax.get("/data/pie-data.json").then(function(data){
			view._chart.update(data);
		});
	}

});
// --------- /View Controller --------- //