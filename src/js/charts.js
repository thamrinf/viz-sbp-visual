var dimension, group, 
	leftBarChart;

function drawLeftChart (argument) {
	var cf = crossfilter(sbpData);

	dimension = cf.dimension(function(d){ return d['Partner/Organisation'];});
	
}

var pieLang, pieGender, pieLevel;

var pieLangTitle = 'Language Requirements',
	pieGenderTitle = 'Deployments by Gender',
	pieLevelTitle = 'Deployments by Level';

$('#piecharts').append('<div class="pie"><div><h3>'+pieLangTitle+'</h3><div id="pieLang"></div></div>');
$('#piecharts').append('<div class="pie"><div><h3>'+pieGenderTitle+'</h3><div id="pieGender"></div></div>');
$('#piecharts').append('<div class="pie"><div><h3>'+pieLevelTitle+'</h3><div id="pieLevel"></div></div>');

function generatePieChart(data) {
	// piechart lang req
	if (pieLang == undefined) {
		pieLang = c3.generate({
			bindto: '#pieLang',
			size: { width: 250, height: 200},
			data: {
				columns: [
					['FR', 20],
					['EN', 50],
					['ES', 30]
				],
			type: 'donut'
			}
		});
	} else {
		//update
	}

	// piechart gender
	if (pieGender == undefined) {
		pieGender = c3.generate({
			bindto: '#pieGender',
			size: { width: 250, height: 200},
			data: {
				columns: [
					['Male', 50],
					['Female', 50]
				],
			type: 'donut'
			}
		});
	} else {
		//update
	}

	// piechart deployment level
	if (pieLevel == undefined) {
		pieLevel = c3.generate({
			bindto: '#pieLevel',
			size: { width: 250, height: 200},
			data: {
				columns: [
					['P3', 50],
					['P4', 10],
					['P5', 30],
					['P3/P4', 10]
				],
			type: 'donut'
			}
		});
	} else {
		//update
	}
	 
}

var barchartPosition,
	barchartOrg,
	barchartCountries;

var barchartPositionTitle = 'Deployments by Position',
	barchartOrgTitle = 'Deployments by Gender',
	barchartCountriesTitle = 'Deployments by Level';

$('#barcharts').append('<div class="barchart"><div><h3>'+barchartPositionTitle+'</h3><div id="barchartPosition"></div></div>');
$('#barcharts').append('<div class="barchart"><div><h3>'+barchartOrgTitle+'</h3><div id="barchartOrg"></div></div>');
$('#barcharts').append('<div class="barchart"><div><h3>'+barchartCountriesTitle+'</h3><div id="barchartCountries"></div></div>');

function generateBarChart() {
	//barchart deployment by position
	barchartPosition = c3.generate({
		bindto: '#barchartPosition',
		size: { width: 250, height: 200 },
		// padding: {right: 15},
	    data: {
	        x: 'x',
	        columns: [
	        	['x', 'IMO', 'HAO', 'Education Officer', 'GBV Specialist'],
	        	[413, 233, 123, 90]
	        ],
	        type: 'bar',

	    },

	    axis: {
	        rotated : true,
	      x: {
	          type : 'category',
	          tick: {
	          	outer: false
	          }
	      },
	      y: {
	      	tick: {
	      		outer: false,
	      		format: d3.format('.2s'),
	      		count: 5,
	      	}
	      } 
	    }
	}); 

	//barchart deployment by partner org
	barchartOrg = c3.generate({
		bindto: '#barchartOrg',
		size: { width: 250, height: 200 },
		// padding: {right: 15},
	    data: {
	        x: 'x',
	        columns: [
	        	['x', 'IMO', 'HAO', 'Education Officer', 'GBV Specialist'],
	        	[413, 233, 123, 90]
	        ],
	        type: 'bar',

	    },

	    axis: {
	        rotated : true,
	      x: {
	          type : 'category',
	          tick: {
	          	outer: false
	          }
	      },
	      y: {
	      	tick: {
	      		outer: false,
	      		format: d3.format('.2s'),
	      		count: 5,
	      	}
	      } 
	    }
	});

	//barchart deployment by position
	barchartCountries = c3.generate({
		bindto: '#barchartCountries',
		size: { width: 250, height: 200 },
		// padding: {right: 15},
	    data: {
	        x: 'x',
	        columns: [
	        	['x', 'IMO', 'HAO', 'Education Officer', 'GBV Specialist'],
	        	[413, 233, 123, 90]
	        ],
	        type: 'bar',

	    },

	    axis: {
	        rotated : true,
	      x: {
	          type : 'category',
	          tick: {
	          	outer: false
	          }
	      },
	      y: {
	      	tick: {
	      		outer: false,
	      		format: d3.format('.2s'),
	      		count: 5,
	      	}
	      } 
	    }
	});
}//generateBarChart




