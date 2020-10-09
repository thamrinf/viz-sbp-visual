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