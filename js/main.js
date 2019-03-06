/* Map of GeoJSON data from drinkingwater.geojson */

// variables for sequencing sliders
var curYear = 0
var curFilter = 100

// function to instantiate the Leaflet map
function createMap(){
    // create the map
    var map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

    // add base tilelayer
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    	subdomains: 'abcd',
    	minZoom: 2,
    	maxZoom: 20,
    	ext: 'png'
    }).addTo(map);


    // call getData function
    getData(map);
};

// Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/drinkingwater.geojson", {
        dataType: "json",
        success: function(response){
            //creating a variable to hold the attributes array
            var attributes = processData(response);
            //call function to create proportional symbols, sequence
            // createSequenceControls(map);
            createPropSymbols(response, map, attributes);
            createFilterControls(map, attributes);
            createSequenceControls(map, attributes);

        }
    });
};

// dynamically calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    // scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    // area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    // radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};


// add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    // create a Leaflet GeoJSON layer and add it to the map
      marker = L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

function pointToLayer(feature, latlng, attributes) {
  {
      // implementing popups in a named pointToLayer() function
      // create variables for markers
        var attribute = attributes[0];

        var lightestBlue = {
            fillColor: "#f1eef6",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        // set new color
        var lightBlue = {
            fillColor: "#bdc9e1",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        var blue = {
            fillColor: "#74a9cf",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        var darkBlue = {
            fillColor: "#2b8cbe",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        var darkestBlue = {
            fillColor: "#045a8d",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        //For each feature, determine its value for the selected attribute
        var attValue = Number(feature.properties[attribute]);

        radius = 0

        //Give each feature's circle marker a radius based on its attribute value
        if (feature.properties.year2000 <= 20){
          lightestBlue.radius = calcPropRadius(attValue);
          radius = lightestBlue.radius
          //create circle marker layer
          var layer = L.circleMarker(latlng, lightestBlue);
        }
        if (feature.properties.year2000 > 20 && feature.properties.year2000 <= 40){
          lightBlue.radius = calcPropRadius(attValue);
          radius = lightestBlue.radius

          radius = lightestBlue.radius

          var layer = L.circleMarker(latlng, lightBlue);
        }
        if (feature.properties.year2000 > 40 && feature.properties.year2000 <= 60){
          blue.radius = calcPropRadius(attValue);
          radius = lightestBlue.radius

          var layer = L.circleMarker(latlng, blue);
        }
        if (feature.properties.year2000 > 60 && feature.properties.year2000 <= 80){
          darkBlue.radius = calcPropRadius(attValue);
          radius = lightestBlue.radius

          var layer = L.circleMarker(latlng, darkBlue);
        }
        if (feature.properties.year2000 > 80 && feature.properties.year2000 <= 100){
          darkestBlue.radius = calcPropRadius(attValue);
          var layer = L.circleMarker(latlng, darkestBlue);
          radius = lightestBlue.radius

        }


        //add country to popup content string
        var popupContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";

        //add formatted attribute to panel content string
        var year = attribute.split("_")[1];
        popupContent += "<p><b>Percentage in 2000:</b> " + feature.properties[attribute] + "</p>";

        //layer popup to the circle marker
        layer.bindPopup(popupContent, {
            offset: new L.Point(0,-radius)
        });

        //return the circle marker to the L.geoJson pointToLayer option
        // return layer;
        return layer;
  }
}


// create new sequence controls
function createSequenceControls(map, attributes){
  // adding slider attributes in main.js
  // create range input element (slider)
      $('#panel').append('<input class="range-slider" type="range">');

       var index = 0
       // click listener for buttons
       $('.skip').click(function(){
           //get the old index value
           index = $('.range-slider').val();
           curYear = index
           console.log(index);
           var sequenceLabel = String(attributes[index]).substring(4)

           // increment or decrement depending on slider movement
           if ($(this).attr('id') == 'forward'){
               index++;


               // if past the last attribute, wrap around to first attribute
               index = index > 15 ? 0 : index;
               curYear = index
               $("#sliderYear").text("Year: " + sequenceLabel);
               updatePropSymbols(map, attributes[index], curFilter);
           } else if ($(this).attr('id') == 'reverse'){
               index--;

               // if past the first attribute, wrap around to last attribute
               index = index < 0 ? 15 : index;
               curYear = index
               $("#sliderYear").text("Year: " + sequenceLabel);
               updatePropSymbols(map, attributes[index], curFilter);

           };

           // update slider
           $('.range-slider').val(index);
       });

       // retrieving the value of the slider
       $('.range-slider').on('input', function(){
           //Step 6: get the new index value
          index = $(this).val();
           curYear = index

           // called in both skip button and slider event listener handlers
            // pass new attribute to update symbols
            var sequenceLabel = String(attributes[index]).substring(4)

            $("#sliderYear").text("Year: " + sequenceLabel);

            updatePropSymbols(map, attributes[index], curFilter);
       });

      //set slider attributes
      $('.range-slider').attr({
          max: 15,
          min: 0,
          value: 0,
          step: 1
      });
      var sequenceLabel = String(attributes[index]).substring(4)

      $("#sliderYear").text("Year: " + sequenceLabel);

}

function createFilterControls(map, attributes) {
  // filter operator

        $('#filter').append('<input class="filter-slider" type="range">');
        $("#sliderPercent").text("Accessibility to safe drinking water: " + curFilter + "%");

        $('.filter-slider').on('input', function(){
            // get the new index value (filter level)
            var filter = $(this).val();
            curFilter = filter
            $("#sliderPercent").text("Accessibility to safe drinking water: " + curFilter + "%");
            updatePropSymbols(map, attributes[curYear], curFilter)
        });

       //set slider attributes
       $('.filter-slider').attr({
           max: 100,
           min: 0,
           value: 100,
           step: 20
       });


};


// build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with percentage values
        if (attribute.indexOf("year") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    // console.log(attributes);

    return attributes;
};

// resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute, filter){
    map.eachLayer(function(layer){

      // checking to see if layer.feature and layer.feature.properties exist
      if (layer.feature && layer.feature.properties[attribute]){
          //access feature properties
          var props = layer.feature.properties;

          //Check to see if country's water % at year (attribute) is greater than the filter level
          if (props[attribute] > filter) {
            layer.setRadius(0)
          } else {
            // update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            // keep the point if equal to or less than filter level
            layer.setRadius(radius);

            //add country to popup content string
            var popupContent = "<p><b>Country:</b> " + props.Country + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[1];
            year = attribute.substring(4);

            popupContent += "<p><b>Percentage in "+ year + ":</b> " + layer.feature.properties[attribute] + "</p>";

            //layer popup to the circle marker
            layer.bindPopup(popupContent, {
                offset: new L.Point(0,-radius)
            });
          }

          }
    });
};




$(document).ready(createMap);
