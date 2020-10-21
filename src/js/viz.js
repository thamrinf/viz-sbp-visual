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
            ['Met', 70],
            ['Unmet', 30]
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
          .attr("d", path);
          // .attr("fill", function(d){
          //   var color = '#F2F2EF';
          //   countries.includes(d.properties.ISO_A3) ? color = mapCountryColor : '';
          //   return color;
          // });
    
    //fill
    choroplethMap();

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

              var content = '<label class="h3 label-header">' + d.properties.NAME_LONG.toUpperCase() + '</label><br/>';

              content += '# Deployments: ' + numFormat(countryData.length) + '<br/>';
              content += '# UN agencies: ' + numFormat(orgs.length)+ '<br/>';
              //gender
              content += 'Gender : <ul>';
              var total = d3.sum(gender, function(d){ return d.value; });
              gender.forEach( function(element, index) {
                var pct = ((element.value/total)*100).toFixed(0) ;
                content += '<li>'+element.key + ': ' + pct + '%' + '</li>';
              });
              content += '</ul>';
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

      // reset select to default
      var select = $('#rankingSelect').val();
      select != 'months' ? $('#rankingSelect').val('months') : '';

      updateViz();
  }
});

$("input[name='roster']").change(function() {
  if(this.checked) {
      $("input[name='agencies']").prop('checked', false);
      dataFilterBy = 'Partner/Organisation';
      d3.select('#rankingChart').select('svg').remove();
      drawRankingChart(dataByRoster);
      

      // reset select to default
      var select = $('#rankingSelect').val();
      select != 'months' ? $('#rankingSelect').val('months') : '';

      updateViz();
  }
});

$('#rankingSelect').on('change', function(e){
  var select = $('#rankingSelect').val();
  var data = (dataFilterBy == 'Organization') ? dataByAgencies : dataByRoster ; 
  
  if (select == "days") {
    data = d3.nest()
        .key(function(d){ return d[dataFilterBy]; })
        .rollup(function(v) { return d3.sum(v, function(d){ return Number(d['Total Days']);})})
        .entries(sbpData).sort(sort_value);
  }
  d3.select('#rankingChart').select('svg').remove();
  drawRankingChart(data);
  updateViz();
})

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