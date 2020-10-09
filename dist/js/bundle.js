// window.$ = window.jQuery = require('jquery');
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
var numFormat = d3.format(',');
const DATA_URL = 'https://proxy.hxlstandard.org/api/data-preview.json?url=https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fd%2F1exDoZsA8UQx-U5YGSS4zxivfPIOUf8-ts2CbavV7Mvg%2Fedit%23gid%3D255428484&format=csv';
let isMobile = $(window).width()<600? true : false;
let geoDataURL = 'data/worldmap.json';

let geomData, 
    sbpData;

$( document ).ready(function() {

  function getData() {
    Promise.all([
      d3.json(geoDataURL),
      d3.csv(DATA_URL)
    ]).then(function(data){
      geomData = topojson.feature(data[0], data[0].objects.geom);
      sbpData = data[1];

      initMap();
      createKeyFigure("#keyfig", "Deployments", "className", 768);
      createKeyFigure("#keyfig", "Duty Stations", "className", 249);
      createKeyFigure("#keyfig", "Countries", "className", 138);
      generatePieChart();
      generateBarChart();
      drawLeftChart();
      //remove loader and show vis
      $('.loader').hide();
      $('main, footer').css('opacity', 1);
    });
  } //getData



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

        
    //draw map
    g = mapsvg.append("g")
        .selectAll("path")
        .data(geomData.features)
        .enter()
          .append("path")
          .attr("class", "map-regions")
          .attr("id", function(d) {
            return d.properties.ISO_A3;
          })
          .attr("d", path)
          .attr("fill", '#CCC');

  }

  /*********************/
  /*** MAP FUNCTIONS ***/
  /*********************/
  var zoom, g, mapsvg, markerScale;

  function initMap(){
    setTimeout(function() {
      // viewportHeight = $('.panel').height();
      drawMap();
      // createMapLegend();
    }, 100);
  }

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