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

$('#piecharts').append('<div class="pie col-4"><div><h3 class="header">'+pieLangTitle+'</h3><div id="pieLang"></div></div>');
$('#piecharts').append('<div class="pie col-4"><div><h3 class="header">'+pieGenderTitle+'</h3><div id="pieGender"></div></div>');
$('#piecharts').append('<div class="pie col-4"><div><h3 class="header">'+pieLevelTitle+'</h3><div id="pieLevel"></div></div>');

function generatePieChart(data) {
	// piechart lang req
	if (pieLang == undefined) {
		pieLang = c3.generate({
			bindto: '#pieLang',
			size: { width: 250, height: 200},
			data: {
				columns: [
					['EN', 50],
					['ES', 30],
					['FR', 20]
				],
				type: 'donut'
			},
			color: {
				pattern: ['#1EBFB3', '#71D7CF', '#C7EFEC']
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
			},
			color: {
				pattern: ['#9C27B0', '#DEB8E5']
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
			},
			color: {
				pattern: ['#2AA02C', '#79C37A', '#52B153', '#CAE7CA']
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

$('#barcharts').append('<div class="barchart col-4"><div><h3 class="header">'+barchartPositionTitle+'</h3><div id="barchartPosition"></div></div>');
$('#barcharts').append('<div class="barchart col-4"><div><h3 class="header">'+barchartOrgTitle+'</h3><div id="barchartOrg"></div></div>');
$('#barcharts').append('<div class="barchart col-4"><div><h3 class="header">'+barchartCountriesTitle+'</h3><div id="barchartCountries"></div></div>');

function generateBarChart() {
	//barchart deployment by position
	barchartPosition = c3.generate({
		bindto: '#barchartPosition',
		size: { height: 200 },
		padding: {right: 15, left: 60},
	    data: {
	        x: 'x',
	        columns: [
	        	['x', 'IMO', 'HAO', 'Education Officer', 'GBV Specialist'],
	        	[413, 233, 123, 90]
	        ],
	        type: 'bar',

	    },
	    color: {
	    	pattern: ['#009EDB']
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
		size: { height: 200 },
		padding: {right: 15, left: 60},
	    data: {
	        x: 'x',
	        columns: [
	        	['x', 'IMO', 'HAO', 'Education Officer', 'GBV Specialist'],
	        	[413, 233, 123, 90]
	        ],
	        type: 'bar',
	    },
	    color: {
	    	pattern: ['#009EDB']
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
		size: { height: 200 },
		padding: {right: 15, left: 60},
	    data: {
	        x: 'x',
	        columns: [
	        	['x', 'IMO', 'HAO', 'Education Officer', 'GBV Specialist'],
	        	[413, 233, 123, 90]
	        ],
	        type: 'bar',

	    },
	    color: {
	    	pattern: ['#009EDB']
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




