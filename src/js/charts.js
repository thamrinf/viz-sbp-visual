var dimension, group, 
	leftBarChart;
var mapColorRange = ['#1EBFB3', '#71D7CF', '#C7EFEC'];//['#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#005a32'];

function drawRankingChart(data) {
	var margin = {top: 30, right: 40, bottom: 0, left: 14};
	var width = $('#rankingChart').width() + margin.left;
	var barColor = '#009EDB';
  	var barHeight = 8;
  	var barPadding = 45;
  	var height = (barHeight + barPadding) * data.length;
  	var labelOffset = 8;

	// data = [10, 30, 50, 56, 78, 100];

	var maxVal = data[0].value; 
	var divide = (maxVal > 1000) ? 1000 : 1;
	var x = d3.scaleLinear()
	    .domain([0, maxVal])
	    .range([0, width - margin.left - margin.right]);

	  // set the ranges
	var y = d3.scaleBand().range([0, height]);
	  y.domain(data.map(function(d) { return d.value; }));

	var svg = d3.select('#rankingChart').append('svg')
				.attr('width', width)
				.attr('height', height)
				.append('g')
				.attr('transform', 'translate('+ margin.left + ',' + margin.top +')');

	// append bars
	bars = svg.selectAll('.bar')
		.data(data)
		.enter().append('g')
		.attr('class', function(d,i) {
			var className = (i==0) ? 'bar-container selected' : 'bar-container';
			return className;
		})
		.attr('transform', function(d, i) { return 'translate(' + 0 + ', ' + (i*(barHeight+barPadding)) + ')'; });

	bars.append('rect')
	    .attr('class', 'bar-button')
	    .attr('fill', '#FFF')
	    .attr('height', barHeight+barPadding)
	    .attr('width', width)
		.attr('transform', function(d, i) { return 'translate(-15,-30)'; })
		.on('mouseover', function(d) {
			$(this).parent().addClass('active');
		})
		.on('mouseout', function(d) {
			console.log('out');
			$(this).parent().removeClass('active');
		})
	    .on('click', function(d){
	    	updateViz(d.key);
	    	$('.bar-container').removeClass('selected');
			$(this).parent().addClass('selected');
	    });

	bars.append('rect')
	    .attr('class', 'bar')
	    .attr('fill', barColor)
	    .attr('height', barHeight)
	    .attr('width', function(d) {
	    	var w = x(d.value);
      		if (w<0) w = 0;
      		return w;
	    });

	 // add min/max labels
	bars.append('text')
	    .attr('class', 'label-num')
	    .attr('x', function(d) {
	      return 200;
	    })
	    .attr('y', function(d) { return -labelOffset; })
	    .text(function (d) {
	      return d3.format('d')(d.value);
	    });

	bars.append('text')
	    .attr('class', 'label-num')
	    // .attr('text-anchor', 'start')
	    .attr('x', 0)
	    .attr('y', function(d) { return -labelOffset; })
	    .text(function (d) {
	      return d.key; //d3.format('.3s')(d.value);
	    });
}

var donutLang, donutGender, donutLevel, donutStatus;
var colorArray = {
	pieLang: ['#FF9D4D','#FEAC68','#FEBA83','#FDC99D','#FDD7B8','#FCE6D3'],
	pieGender: ['#9C27B0','#BD70CB','#DEB8E5'],
	pieLevel: ['#28A02C','#43AC46','#5EB861','#79C47B','#94CF95','#AFDBB0','#CAE7CA'],
	pieStatus: ['#1EBFB3', '#C7EFEC'],
};

function generatePieChart(data, bind) {
	console.log(colorArray[bind])
	var chart = c3.generate({
		bindto: '#'+bind,
		size: { width: 190, height: 200},
		data: {
			columns: data,
			type: 'donut'
		},
		color: {
			pattern: colorArray[bind]
		},
		legend: {
			hide: getLegendItemToHide(data)
		}
	});

	return chart ;
}

function getLegendItemToHide(data) {
	var items = [];
	for (var i = data.length - 1; i > 1; i--) {
	 	items.push(data[i][0]);
	 } 
	 return items;
}

var barchartPosition,
	barchartOrg,
	barchartCountries;


function generateBarChart(data, bind) {
	var chart = c3.generate({
		bindto: '#'+bind,
		size: { height: 500 },
		padding: {right: 10, left: 180},
	    data: {
	        x: 'x',
	        columns: data,
	        type: 'bar'
	    },
	    color: {
	    	pattern: ['#009EDB']
	    },
	    axis: {
	        rotated : true,
	      x: {
	          type : 'category',
	          tick: {
	          	outer: false,
	          	multiline: false,
	          	culling: false
	          }
	      },
	      y: {
	      	tick: {
	      		outer: false,
	      		format: d3.format('d'),
	      		count: 5,
	      	}
	      } 
	    },
	    grid: {
	      	y: {
	      		show: true
	      	}
	    },
	    legend: {
	    	show: false
	    },
	    tooltip: {
	    	format: {
	    		value: function(value){
	    			return d3.format('d')(value)
	    		}
	    	}
	    }
	}); 
	return chart;

}//generateBarChart

function updateViz(filter) {
	if (filter == undefined) {
		sbpFilteredData = sbpData;
	} else {
		sbpFilteredData = sbpData.filter(function(d){
		  return d[dataFilterBy] == filter ;
		});
	}

	var countries = [],
		dutyStations = [];
	sbpFilteredData.forEach( function(element, index) {
		countries.includes(element['ISO3 code']) ? '' : countries.push(element['ISO3 code']);
        dutyStations.includes(element['Duty Station']) ? '' : dutyStations.push(element['Duty Station']);
	});

	// update key figures
	// createKeyFigure("#keyfig", "Deployments", "deployments", deployments);
    d3.select('.deployments').text(sbpFilteredData.length);
    d3.select('.countries').text(countries.length);
    d3.select('.dutyStations').text(dutyStations.length);

	//update map
	// mapsvg.selectAll('path').each(function(item){
	// 	d3.select(this).transition().duration(500).attr("fill", function(d){
	// 		var color = '#F2F2EF';
 //            countries.includes(d.properties.ISO_A3) ? color = mapCountryColor : '';
 //            return color;
 //          });

	// });
	choroplethMap();


	//update donuts 
	var langData = getFormattedDataByIndicator('Language Requirements');
	var genderData  = getFormattedDataByIndicator('Gender');
    var levelData  = getFormattedDataByIndicator('Grade');

	donutLang.load({columns: langData, unload: true });
	donutGender.load({columns: genderData, unload: true });
	donutLevel.load({columns: levelData, unload: true });

	var positionData = getDataByIndicator('Functional Area');
	var partnerData = getDataByIndicator('Partner/Organisation');

	barchartPosition.load({columns: positionData, unload: true });
	barchartOrg.load({columns: partnerData, unload: true });
}


function choroplethMap() {
	var data = d3.nest()
			.key(function(d){ return d['ISO3 code']; })
			.rollup(function(d){ return d.length; })
			.entries(sbpFilteredData).sort(sort_value);

	var select = $('#rankingSelect').val();

	if (select == "days") {
		data = d3.nest()
			.key(function(d){ return d['ISO3 code']; })
			.rollup(function(v) { return d3.sum(v, function(d) { return d['Total Days']; }); })
			.entries(sbpFilteredData).sort(sort_value);
	}

	var max = data[0].value;

	var mapScale = d3.scaleQuantize()
			.domain([0, max])
			.range(mapColorRange);
    
    mapsvg.selectAll('path').each( function(element, index) {
        d3.select(this).transition().duration(500).attr('fill', function(d){
            var filtered = data.filter(pt => pt.key== d.properties.ISO_A3);
            var num = (filtered.length != 0) ? filtered[0].value : null ;
            var clr = (num == null) ? '#F2F2EF' : mapScale(num);
            return clr;
        });
    });

} //choroplethMap

