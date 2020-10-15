// window.$ = window.jQuery = require('jquery');
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
	      return d3.format('.3s')(d.value);
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
	          	multiline: false
	          }
	      },
	      y: {
	      	tick: {
	      		outer: false,
	      		format: d3.format(','),
	      		count: 5,
	      	}
	      } 
	    },
	    legend: {
	    	show: false
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



function hxlProxyToJSON(input){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}


function createKeyFigure(target, title, className, value) {
  var targetDiv = $(target);
  //<p class='date small'><span>"+ date +"</span></p>
  return targetDiv.append("<div class='key-figure col-4'><div class='inner'><h3>"+ title +"</h3><div class='num " + className + "'>"+ numFormat(value) +"</div></div></div></div>");
}


function getFormattedDataByIndicator(indicator) {
    var data = [];
    var dataByInd = d3.nest()
        .key(function(d){ return d[indicator];})
        .rollup(function(d) { return d.length; })
        .entries(sbpFilteredData).sort(sort_value);

    var total = d3.sum(dataByInd, function(d){ return d.value ;});
    dataByInd.forEach( function(element, index) {
        var pct = (element.value/total)*100 ;
        data.push([element.key, pct]);
    });

   return data; 

}

function getDataByIndicator(indicator) {
    var dataX = ['x'],
        dataY = [];
    var dataByInd = d3.nest()
        .key(function(d){ return d[indicator];})
        .rollup(function(d) { return d.length; })
        .entries(sbpFilteredData).sort(sort_value);

    dataByInd.forEach( function(element, index) {
        dataX.push(element.key);
        dataY.push(element.value);
    });
   return [dataX, dataY]; 

}

var sort_value = function (d1, d2) {
    if (d1.value > d2.value) return -1;
    if (d1.value < d2.value) return 1;
    return 0;
}
var numFormat = d3.format(',');
var percentFormat = d3.format('.0%');
const DATA_URL = 'https://proxy.hxlstandard.org/api/data-preview.json?url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1exDoZsA8UQx-U5YGSS4zxivfPIOUf8-ts2CbavV7Mvg%2Fedit%23gid%3D255428484&format=csv';
let isMobile = $(window).width()<600? true : false;
let geoDataURL = 'data/worldmap.json';

let geomData, 
    sbpData,
    sbpFilteredData;

let dataByAgencies, 
    dataByRoster;

let dataFilterBy = 'Organization'; 

let countries = [],
    dutyStations = [];


let mapCountryColor = '#1EBFB3';//'#71D7CF';//'#C7EFEC';//'#1EBFB3';//'#009EDB';//'#fec44f';

let zoom, g, mapsvg, markerScale;

$( document ).ready(function() {


  function getData() {

    Promise.all([
      d3.json(geoDataURL),
      d3.csv(DATA_URL)
    ]).then(function(data){
      geomData = topojson.feature(data[0], data[0].objects.geom);
      sbpData = data[1];

      sbpData.forEach( function(element, index) {
        countries.includes(element['ISO3 code']) ? '' : countries.push(element['ISO3 code']);
        dutyStations.includes(element['Duty Station']) ? '' : dutyStations.push(element['Duty Station']);
      });


      sbpFilteredData = sbpData;
  
      dataByAgencies = d3.nest()
        .key(function(d){ return d['Organization']; })
        .rollup(function(d) { return d.length; })
        .entries(sbpData).sort(sort_value);

      dataByRoster = d3.nest()
        .key(function(d){ return d['Partner/Organisation']; })
        .rollup(function(d) { return d.length; })
        .entries(sbpData).sort(sort_value);

      initMap();
      drawRankingChart(dataByAgencies);
      initDisplay();
      
      
       // key figures
      var deployments = d3.sum(dataByAgencies, function(d){ return d.value;});
      createKeyFigure("#keyfig", "Deployments", "deployments", deployments);
      createKeyFigure("#keyfig", "Countries", "countries", countries.length);
      createKeyFigure("#keyfig", "Duty Stations", "dutyStations", dutyStations.length);
 
      //remove loader and show vis
      $('.loader').hide();
      $('main, footer').css('opacity', 1);
    });
  } //getData

  function initDisplay() {
    // donut charts
    var langData = getFormattedDataByIndicator('Language Requirements');
    var genderData  = getFormattedDataByIndicator('Gender');
    var levelData  = getFormattedDataByIndicator('Grade');
    var statusData = [
            ['met', 70],
            ['unmet', 30]
        ];

    var pieLangTitle = 'Language Requirements',
        pieGenderTitle = 'Deployments by Gender',
        pieLevelTitle = 'Deployments by Level',
        pieStatusTitle = 'Deployments Status';

    $('#piecharts').append('<div class="pie col-3"><div><h3 class="header">'+pieLangTitle+'</h3><div id="pieLang"></div></div>');
    $('#piecharts').append('<div class="pie col-3"><div><h3 class="header">'+pieGenderTitle+'</h3><div id="pieGender"></div></div>');
    $('#piecharts').append('<div class="pie col-3"><div><h3 class="header">'+pieLevelTitle+'</h3><div id="pieLevel"></div></div>');
    $('#piecharts').append('<div class="pie col-3"><div><h3 class="header">'+pieStatusTitle+'</h3><div id="pieStatus"></div></div>');

    donutLang = generatePieChart(langData, 'pieLang');
    donutGender = generatePieChart(genderData, 'pieGender');
    donutLevel = generatePieChart(levelData, 'pieLevel');
    donutStatus = generatePieChart(statusData, 'pieStatus');

    // bar charts

    var positionData = getDataByIndicator('Functional Area');
    var partnerData = getDataByIndicator('Partner/Organisation');

    // var positionData = getFormattedDataByIndicator('Title/Position/Function');

    var barchartPositionTitle = 'Deployments by Position',
        barchartOrgTitle = 'Deployments by Partner Organization',
        barchartCountriesTitle = 'Deployments by funding';

    $('#barcharts').append('<div class="barchart col-6"><div><h3 class="header">'+barchartPositionTitle+'</h3><div id="barchartPosition"></div></div>');
    $('#barcharts').append('<div class="barchart col-6"><div><h3 class="header">'+barchartOrgTitle+'</h3><div id="barchartOrg"></div></div>');
    // $('#barcharts').append('<div class="barchart col-4"><div><h3 class="header">'+barchartCountriesTitle+'</h3><div id="barchartCountries"></div></div>');

    barchartPosition = generateBarChart(positionData, 'barchartPosition');
    barchartOrg = generateBarChart(partnerData, 'barchartOrg');

  } //initDisplay


  function drawMap(){
    var width = $('#map').width();//viewportWidth;
    var height = 400;//(isMobile) ? viewportHeight * .5 : viewportHeight;
    var mapScale = width/3.5;//(isMobile) ? width/3.5 : width/5.5;
    var mapCenter = [75, 8];//(isMobile) ? [10, 30] : [75, 8];


    var projection = d3.geoMercator()
      .center(mapCenter)
      .scale(mapScale)
      .translate([width / 2, height / 2]);

    // zoom = d3.zoom()
    //   .scaleExtent([1, 8])
    //   .on("zoom", zoomed);

    var path = d3.geoPath().projection(projection);

    mapsvg = d3.select('#map')
               .append('svg')
               .attr("width", width)
               .attr("height", height);
      //.call(zoom)
      // .on("wheel.zoom", null)
      // .on("dblclick.zoom", null);

    mapsvg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%");

    //tooltip
    var maptip = d3.select('#map').append('div').attr('class', 'd3-tip map-tip hidden');

    //draw map
    g = mapsvg.append("g").attr('id', 'pays')
        .selectAll("path")
        .data(geomData.features)
        .enter()
          .append("path")
          .attr("class", "map-regions")
          .attr("id", function(d) {
            return d.properties.ISO_A3;
          })
          .attr("d", path)
          .attr("fill", function(d){
            var color = '#F2F2EF';
            countries.includes(d.properties.ISO_A3) ? color = mapCountryColor : '';
            return color;
          });

    var tipPays = d3.select('#pays').selectAll('path') 
          .on("mousemove", function(d){ 
            var countryData = sbpFilteredData.filter(c => c['ISO3 code'] == d.properties.ISO_A3);
            if (countryData.length != 0) {
              var orgs = [];
              countryData.forEach( function(element, index) {
                orgs.includes(element['Organization']) ? '' : orgs.push(element['Organization']);
              });
              var gender = d3.nest()
                  .key(function(d){ return d['Gender']; })
                  .rollup(function(d){ return d.length; })
                  .entries(countryData).sort(sort_value);

              var content = '<label class="h3 label-header">' + d.properties.NAME_LONG + '</label><br/><br/>';

              content += '# of deployments: ' + numFormat(countryData.length) + '<br/>';
              content += '# of UN agencies: ' + numFormat(orgs.length)+ '<br/>';
              //gender
              content += 'Gender : ' + '<br/>';
              var total = d3.sum(gender, function(d){ return d.value; });
              gender.forEach( function(element, index) {
                var pct = ((element.value/total)*100).toFixed(0) ;
                content += '<ul>'+element.key + ': ' + pct + '%' + '</ul>';
              });

              showMapTooltip(d, maptip, content);
            }

          })
          .on("mouseout", function(d) { 
            hideMapTooltip(maptip); 
          });


      
  }

  /*********************/
  /*** MAP FUNCTIONS ***/
  /*********************/

  function initMap(){
    setTimeout(function() {
      // viewportHeight = $('.panel').height();
      drawMap();
      // createMapLegend();
    }, 100);
  }


  function showMapTooltip(d, maptip, text){
    var mouse = d3.mouse(mapsvg.node()).map( function(d) { return parseInt(d); } );
    maptip
        .classed('hidden', false)
        .attr('style', 'left:'+(mouse[0]+20)+'px;top:'+(mouse[1]+20)+'px')
        .html(text)
  }

  function hideMapTooltip(maptip) {
      maptip.classed('hidden', true) 
  }

  //

$("input[name='agencies']").change(function() {
  if(this.checked) {
      $("input[name='roster']").prop('checked', false);
      dataFilterBy = 'Organization';
      d3.select('#rankingChart').select('svg').remove();
      drawRankingChart(dataByAgencies);
      updateViz();
  }
});

$("input[name='roster']").change(function() {
  if(this.checked) {
      $("input[name='agencies']").prop('checked', false);
      dataFilterBy = 'Partner/Organisation';
      d3.select('#rankingChart').select('svg').remove();
      drawRankingChart(dataByRoster);
      updateViz();
  }
});

  function initTracking() {
    //initialize mixpanel
    let MIXPANEL_TOKEN = '';
    mixpanel.init(MIXPANEL_TOKEN);
    mixpanel.track('page view', {
      'page title': document.title,
      'page type': 'datavis'
    });
  }

  getData();
  //initTracking();
});