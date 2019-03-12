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
            // createIcons(response, map, attributes);

            createFilterControls(map, attributes);
            createSequenceControls(map, attributes);
            createLegend(map, attributes);
            createFilterLegend(map, attributes)
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

  circles = L.geoJson(data, {
    pointToLayer: function(feature, latlng){
        return pointToLayer(feature, latlng, attributes);
      }
  }).addTo(map);
};


function pointToLayer(feature, latlng, attributes) {
      // implementing popups in a named pointToLayer() function
      // create variables for markers
        var attribute = attributes[0];

        var LeafIcon = L.Icon.extend({
          options: {}
        });


        //For each feature, determine its value for the selected attribute
        var attValue = Number(feature.properties[attribute]);

        radius = calcPropRadius(attValue);


        //Give each feature's circle marker a radius based on its attribute value
        if (feature.properties.year2000 <= 20){
          var lightestBlueIcon = new LeafIcon({iconUrl: 'img/saddest.png', iconSize: [radius*2]});
          layer = L.marker(latlng, {icon: lightestBlueIcon})
        }

        if (feature.properties.year2000 > 20 && feature.properties.year2000 <= 40){
          var lightBlueIcon = new LeafIcon({iconUrl: 'img/sad.png', iconSize: [radius*2]});
          layer = L.marker(latlng, {icon: lightBlueIcon})
        }

        if (feature.properties.year2000 > 40 && feature.properties.year2000 <= 60){
          var blueIcon = new LeafIcon({iconUrl: 'img/content.png', iconSize: [radius*2]});
          layer = L.marker(latlng, {icon: blueIcon})
        }

        if (feature.properties.year2000 > 60 && feature.properties.year2000 <= 80){
          var darkBlueIcon = new LeafIcon({iconUrl: 'img/happy.png', iconSize: [radius*2]});
          layer = L.marker(latlng, {icon: darkBlueIcon})
        }

        if (feature.properties.year2000 > 80 && feature.properties.year2000 <= 100){
          var darkestBlueIcon = new LeafIcon({iconUrl: 'img/happiest.png', iconSize: [radius*2]});
          layer = L.marker(latlng, {icon: darkestBlueIcon})

        }

        //Example 1.1 line 2...in pointToLayer()
        // createPopup(feature.properties, attribute, layer, radius);

        //add popup to circle marker


        //return the circle marker to the L.geoJson pointToLayer option
        // return layer;
        return layer;

}


// create new sequence controls
function createSequenceControls(map, attributes){
  // adding slider attributes in main.js
  // create range input element (slider)
  var SequenceControl = L.Control.extend({
      options: {
          position: 'bottomleft'
      },
      onAdd: function (map) {

        var container = L.DomUtil.create('div', 'sequence-control-container');

        //$('#panel').append('<input class="range-slider" type="range">');
        $(container).append('<input class="range-slider" type="range">');

         var index = 0

         var slider = container.getElementsByClassName('range-slider')


         // click listener for buttons

         // retrieving the value of the slider
         $(slider).on('input', function(){

             //Step 6: get the new index value
            index = $(this).val();
             curYear = index
             // called in both skip button and slider event listener handlers
              // pass new attribute to update symbols
              var sequenceLabel = String(attributes[index]).substring(4)
              // console.log($("#sliderYear"));
              $("#sliderYear").text("Year: " + sequenceLabel);
              $("#sYear").text("Year: " + sequenceLabel);

              // console.log(index)
              updatePropSymbols(map, attributes[index], curFilter);
              updateLegend(map, attributes[index])
         });

        //set slider attributes
        $(slider).attr({
            max: 15,
            min: 0,
            value: 0,
            step: 1
        });

        var sequenceLabel = String(attributes[index]).substring(4)

        $("#sliderYear").text("Year: " + sequenceLabel);


        L.DomEvent.disableClickPropagation(container);

        return container;
      }
    });

      map.addControl(new SequenceControl());
}

function createFilterControls(map, attributes) {
  var FilterControl = L.Control.extend({
      options: {
          position: 'bottomright'
      },

      onAdd: function (map) {
          // create the control container with a particular class name
          var container = L.DomUtil.create('div', 'filter-control-container');


        $(container).append('<input class="filter-slider" type="range">');
        $(container).append('<div id="filter-legend">')

        var filterslider = container.getElementsByClassName('filter-slider')

        $(filterslider).on('input', function(){
            // get the new index value (filter level)
            var filter = $(this).val();
            curFilter = filter
            $("#sliderPercent").text("Accessibility to safe drinking water less than " + curFilter + "%");
            updatePropSymbols(map, attributes[curYear], curFilter)
        });

       //set slider attributes
       $(filterslider).attr({
           max: 100,
           min: 0,
           value: 100,
           step: 20
       });


       L.DomEvent.disableClickPropagation(container);

       return container;
     }
   });

     map.addControl(new FilterControl());
}


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

    return attributes;
};

// resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute, filter){
    map.eachLayer(function(layer){

      // checking to see if layer.feature and layer.feature.properties exist
      if (layer.feature && layer.feature.properties[attribute]){
          //access feature properties
          var props = layer.feature.properties;

          var icon = layer.options.icon;

          //Check to see if country's water % at year (attribute) is greater than the filter level
          if (props[attribute] > filter) {
            icon.options.iconSize = [0];
            layer.setIcon(icon);

          } else {
            // update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            // keep the point if equal to or less than filter level
            icon.options.iconSize = [radius*2];
            layer.setIcon(icon);

            //Example 1.1 line 2...in pointToLayer()
            createPopup(props, attribute, layer, radius);
          }
        }
      });
    };

//a consolidated popup-creation function
function createPopup(properties, attribute, layer, radius){
  if (layer.feature == null) {
    var props = properties
  } else {
    var props = layer.feature.properties
  }

    //add city to popup content string
    var popupContent = "<p><b>Country:</b> " + props.Country + "</p>";

    //add formatted attribute to panel content string
    var year = attribute.split("year")[1];

    popupContent += "<p><b>Percentage in "+ year + ":</b> " + props[attribute] + "</p>";

    //replace the layer popup
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-radius)
    });
};

//Example 2.7: adding a legend control in main.js
function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');


            //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
            //add temporal legend div to container
            $(container).append('<div id="temporal-legend">')
            //Step 1: start attribute legend svg string
            //can do with Adobe Illustrator
            var svg = '<svg id="attribute-legend" width="180px" height="180px">';

            // array of circle names to base loop on
            // object to base loop on
            // var circles = {
            //     max: 20,
            //     mean: 40,
            //     min: 60
            // };

            var markers = {
                darkestBlueIcon: 20,
                darkBlueIcon: 40,
                blueIcon: 60,
                lightBlueIcon: 80,
                lightestBlueIcon: 100
            };

            var labels = [
              'img/happiest.png',
              'img/happy.png',
              'img/content.png',
              'img/sad.png',
              'img/saddest.png'
            ];

            svg = (" <img src="+ labels[1] +" height='50' width='50'>") +'<br>';

            //loop to add each circle and text to svg string
            for (var i = 0; i < markers.length; i++){
                //circle string
                svg += markers[i] + (" <img src="+ labels[i] +" height='50' width='50'>") +'<br>';
              }

            //close svg string
            svg += "</svg>";

            //add attribute legend svg to container
            var myElement = container.getElementsByTagName("div");
            $(myElement).append(svg);
            return container;
        }
    });
    map.addControl(new LegendControl());
    updateLegend(map, attributes[curYear]);
};

//Calculate the max, mean, and min values for a given attribute
function getMarkerValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var max = Infinity,
        min = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };
};

//Example 3.7 line 1...Update the legend with new attribute
function updateLegend(map, attribute){
    //create content for legend

    var year = attribute.split("year")[1];
    var content = "Year: " + year;

    //replace legend content
    $('#temporal-legend').html(content);
    var markerValues = getMarkerValues(map, attribute);

    for (var key in markerValues){
        //get the radius
        var radius = calcPropRadius(markerValues[key]);

        $('#'+key).attr({
            cy: 59 - radius,
            r: radius
        });

        //Step 4: add legend text
        $('#'+key+'-text').text(Math.round(markerValues[key]*100)/100 + " %");
    };
}
    //get the max, mean, and min values as an object

//Example 2.7: adding a legend control in main.js
function createFilterLegend(map, attributes){
    var FilterLegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            // create the control container with a particular class name
            var container = L.DomUtil.create('div', 'filter-legend-control-container');
            //PUT YOUR SCRIPT TO CREATE THE TEMPORAL LEGEND HERE
            //add temporal legend div to container
            $(container).append('<div id="filter-legend">')
            console.log(container)

            return container;
        }
    });
    map.addControl(new FilterLegendControl());
    updateFilterLegend(map, attributes[curYear]);
};

//Example 3.7 line 1...Update the legend with new attribute
function updateFilterLegend(map, attribute){
    //create content for legend
    var filter = attribute
    var content = "Accessibility to safe drinking water less than " + filter + "%"

    //replace legend content
    $('#filter-legend').html(content);

        //Step 4: add legend text
}
        //g



$(document).ready(createMap);
