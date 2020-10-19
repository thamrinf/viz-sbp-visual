var dimension, group, 
	leftBarChart;

function drawRankingChart(data) {
	var margin = {top: 0, right: 40, bottom: 30, left: 50};
	var width = 300,
		height = 500;
	var barColor = '#009EDB' ;
  	var maxVal = 100;
  	var barHeight = 25;
  	var barPadding = 20;

	// data = [10, 30, 50, 56, 78, 100];

	var maxVal = data[0].value; // data is sorted by value
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
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


	// add the x axis
	svg.append('g')
	    .attr('transform', 'translate(0, '+height+')')
	    .call(d3.axisBottom(x)
	      .tickSizeOuter(0)
	      .ticks(5, 's'));

	// append bars
	bars = svg.selectAll('.bar')
	      .data(data)
	      .enter().append('g')
	      .attr('class', 'bar-container')
	      .attr('transform', function(d, i) { return 'translate(' + 0 + ', ' + (y(d.value)+30) + ')'; });

	bars.append('rect')
	    .attr('class', 'bar')
	    .attr('fill', barColor)
	    .attr('height', barHeight)
	    .attr('width', function(d) {
	    	return d.value;
	    })
	    .on('click', function(d){
	    	updateViz(d.key);
	    });

	 // add min/max labels
	bars.append('text')
	    .attr('class', 'label-num')
	    .attr('x', function(d) {
	      return 200;
	    })
	    .attr('y', function(d) { return barHeight/2 + 4; })
	    .text(function (d) {
	      return d3.format('d')(d.value);
	    });

	bars.append('text')
	    .attr('class', 'label-num')
	    // .attr('text-anchor', 'start')
	    .attr('x', 0)
	    .attr('y', function(d) { return -4; })
	    .text(function (d) {
	      return d.key; //d3.format('.3s')(d.value);
	    });
}

var donutLang, donutGender, donutLevel, donutStatus;

function generatePieChart(data, bind) {
	// piechart lang req

	var chart = c3.generate({
		bindto: '#'+bind,
		size: { width: 190, height: 200},
		data: {
			columns: data,
			type: 'donut'
		},
		color: {
			pattern: ['#1EBFB3', '#71D7CF', '#C7EFEC']
		}
	});

	return chart ;
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
	mapsvg.selectAll('path').each(function(item){
		d3.select(this).transition().duration(500).attr("fill", function(d){
			var color = '#F2F2EF';
            countries.includes(d.properties.ISO_A3) ? color = mapCountryColor : '';
            return color;
          });

	});


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


