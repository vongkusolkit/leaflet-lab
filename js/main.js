/* Map of GeoJSON data from drinkingwater.geojson */

// Global variables to keep track of the current year index and filter
var curYearIndex = 0
var curFilter = 100

// function to instantiate the Leaflet map
function createMap(){
    // create the map
    var map = L.map('map', {
        center: [-3, 20],
        zoom: 2
    });

    // add base tilelayer
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    	subdomains: 'abcd',
    	minZoom: 2,
    	maxZoom: 5,
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
            //call function to create proportional symbols
            createPropSymbols(response, map, attributes);
            //Create control for % filter
            createFilterControls(map, attributes);
            //Create control for year sequences
            createSequenceControls(map, attributes, response);
            //create title
            createTitle(map);
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


// add custom icons to the map
function createPropSymbols(data, map, attributes){
    // create a Leaflet GeoJSON layer and add it to the map
  circles = L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      //Get the icon points (to add to the map)
        return pointToLayer(feature, latlng, attributes);
      }
  }).addTo(map);
};

//gets custom icons and popup info
function pointToLayer(feature, latlng, attributes) {
      // implementing popups in a named pointToLayer() function
      // create variables for markers
        var attribute = attributes[0];
      //Leaficon object
        var LeafIcon = L.Icon.extend({
          options: {}
        });
        //For each feature, determine its value for the selected attribute
        var attValue = Number(feature.properties[attribute]);
        //Get the radius, which is value corresponding to the attribute value
        radius = calcPropRadius(attValue);

        //Give each feature's icon a size and image based on its attribute value
        if (feature.properties.year2000 <= 20){
          var lightestBlueIcon = new LeafIcon({iconUrl: 'img/saddest.png', iconSize: [radius*1.25]});
          layer = L.marker(latlng, {icon: lightestBlueIcon})
        }

        if (feature.properties.year2000 > 20 && feature.properties.year2000 <= 40){
          var lightBlueIcon = new LeafIcon({iconUrl: 'img/sad.png', iconSize: [radius*1.25]});
          layer = L.marker(latlng, {icon: lightBlueIcon})
        }

        if (feature.properties.year2000 > 40 && feature.properties.year2000 <= 60){
          var blueIcon = new LeafIcon({iconUrl: 'img/content.png', iconSize: [radius*1.25]});
          layer = L.marker(latlng, {icon: blueIcon})
        }

        if (feature.properties.year2000 > 60 && feature.properties.year2000 <= 80){
          var darkBlueIcon = new LeafIcon({iconUrl: 'img/happy.png', iconSize: [radius*1.25]});
          layer = L.marker(latlng, {icon: darkBlueIcon})
        }

        if (feature.properties.year2000 > 80 && feature.properties.year2000 <= 100){
          var darkestBlueIcon = new LeafIcon({iconUrl: 'img/happiest.png', iconSize: [radius*1.25]});
          layer = L.marker(latlng, {icon: darkestBlueIcon})

        }

        //Create variable containing year and its attribute value for a certain country
        var props = feature.properties;
        //Create popup info based on the year and the country
        createPopup(props, attribute, layer, radius);

        return layer;
}


//create new sequence controls to control the years
function createSequenceControls(map, attributes, features){
  //Create a SequenceControl object
  var SequenceControl = L.Control.extend({
      options: {
          position: 'bottomleft'
      },
      onAdd: function (map) {
        //Create a DOM container to append to on to the map
        var container = L.DomUtil.create('div', 'legend-control-container');
        //Append the year info
        $(container).append('<div id="temporal-legend" >Year: 2000</div>')

        //Append the attribute value info
        info = ("<p id = 'allVals'>Max: 100 || Mean: 54.20 || Min: 8.40</p>")
        $(container).append(info);        //$('#panel').append('<input class="range-slider" type="range">');

        //Append the legend symbols
        image1 = ("<img id = 'raindropmax' src = img/happiest.png height='1000' width='45' > </img>")
        image2 = ("<img id = 'raindropmean' src = img/content.png height='1' width='1' > </img>")
        image3 = ("<img id = 'raindropmin' src = img/saddest.png height='1' width='1' > </img> </br>")
        $(container).append(image1);
        $(container).append(image2);
        $(container).append(image3);

        //Append the slider to control the year
        $(container).append('<input class="range-slider" type="range">');

        //Initialize the slider value to 0
         var index = 0
         //Get the slider html object
         var slider = container.getElementsByClassName('range-slider')
         //retrieving the value of the slider
         $(slider).on('input', function(){
             //get the new index value
            index = $(this).val();
            //Update the global year index value so the attribute filter can adjust accordingly
             curYearIndex = index
              //Update the symbols and legend on the map
              updatePropSymbols(map, attributes[index], curFilter);
              updateLegend(map, attributes[index]);
         });

        //set slider attributes
        $(slider).attr({
            max: 15,
            min: 0,
            value: 0,
            step: 1
        });
        //Prevent the mouse to move the map when moving the slider
        L.DomEvent.disableClickPropagation(container);

        return container;
      }
    });

    //create the raindrops for the legend
    map.addControl(new SequenceControl());
    initialVal={min: 8.55, mean: 54.27, max: 100};
    for (key in initialVal) {
      var radius = calcPropRadius(initialVal[key]) * 1.25;
      $('#raindrop'+key).attr('width', radius*0.9).attr('height', radius*1.25);
    }
}

function createFilterControls(map, attributes) {
  var FilterControl = L.Control.extend({
      options: {
          position: 'bottomright'
      },

      onAdd: function (map) {
        // create the control container with a particular class name
        var container = L.DomUtil.create('div', 'filter-control-container');

        //Add legend title
        $(container).append('<div id="filter-legend">Accessibility to safe drinking water less than 100%</div>')
        $(container).append('<input class="filter-slider" type="range">');

        //get the filterslider html object
        var filterslider = container.getElementsByClassName('filter-slider')
        //get the input value of the slider
        $(filterslider).on('input', function(){
            // get the new index value (filter level)
            var filter = $(this).val();
            //update the global filter value so the years will act appropriately
            curFilter = filter
            //update the maps icons and legend
            updatePropSymbols(map, attributes[curYearIndex], curFilter)
            updateFilterLegend(map)
        });

       //set slider attributes
       $(filterslider).attr({
           max: 100,
           min: 0,
           value: 100,
           step: 20
       });

       //prevent the map to be moved from the mouse when adjusting the slider
       L.DomEvent.disableClickPropagation(container);

       return container;
     }
   });
   //add filter slider to map
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
          //variable for feature properties
          var props = layer.feature.properties;
          //variable for icon
          var icon = layer.options.icon;

          //Check to see if country's water % at year (attribute) is greater than the filter level
          if (props[attribute] > filter) {
            //hide the icon
            icon.options.iconSize = [0];
            layer.setIcon(icon);
          } else {
            // update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            // keep the point if equal to or less than filter level
            icon.options.iconSize = [radius*1.25];
            layer.setIcon(icon);
            //add appropriate popup info to the new layer
            createPopup(props, attribute, layer, radius);
          }
        }
      });
    };

//a create and add popup info to the icon
function createPopup(properties, attribute, layer, radius){

  //if layer exist, get appropriate values from the layer. otherwise get it from properties
  if (layer.feature == null) {
    var props = properties
  } else {
    var props = layer.feature.properties
  }
    //add country to popup content string
    var popupContent = "<p><b>Country:</b> " + props.Country + "</p>";
    //add formatted attribute (year) to panel content string
    var year = attribute.split("year")[1];
    value = props[attribute].toFixed(2)
    popupContent += "<p><b>Percentage in "+ year + ":</b> " + value + "</p>";
    //replace the layer popup
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-radius)
    });
};


//Calculate the max, mean, and min values for a given attribute
function getIconValues(map, attribute, all_attributes){
    //start with min at highest possible and max at lowest possible number
    var max = -Infinity,
        min = Infinity;
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

//Update the legend with new attribute
function updateLegend(map, attribute){
    //create content for legend (year info)
    var year = attribute.split("year")[1];
    var content = "Year: " + year;
    //replace legend content
    $('#temporal-legend').html(content);
    //get the min, mean, and max attribute values of all the current icons
    var iconValues = getIconValues(map, attribute);
    //console.log(iconValues);
    for (var key in iconValues){
        //get values to help scale the icon appropriately
        var scale = calcPropRadius(iconValues[key]) * 1.25;
        //get the values for the legend
        maxStr = iconValues['max'].toString()
        meanStr = iconValues['mean'].toFixed(2).toString()
        minStr = iconValues['min'].toFixed(2).toString()
        //adjust the raindrop image size on the legend
        $('#raindrop'+key).attr('width', scale*0.9).attr('height', scale*1.25);
        //adjust the values for the legend
        $('#allVals').text("Max: "+ maxStr + " || Mean: " + meanStr+ " || Min: " + minStr);
    };
}

//update the legend info
function updateFilterLegend(map){
    //create content for legend
    var content = "Accessibility to safe drinking water less than " + curFilter + "%"
    //replace legend content
    $('#filter-legend').html(content);
}

//create and add the title to the leaflet map
function createTitle(map) {

  //create title object
  var mapTitle = L.Control.extend({
      options: {
          position: 'topright'
      },

      onAdd: function (map) {
          //add the title to the map
          var container = L.DomUtil.create('div', 'title-control-container');
          $(container).append('<div>Got Agua?')

       return container;
     }
   });
    //Add the title to the map
     map.addControl(new mapTitle());
}

//Creates the map to the html page
$(document).ready(createMap);
