/* Map of GeoJSON data from drinkingwater.geojson */

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

    //add base tilelayer
    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    	subdomains: 'abcd',
    	minZoom: 0,
    	maxZoom: 20,
    	ext: 'png'
    }).addTo(map);

    //call getData function
    getData(map);
};

// //function to retrieve the data and place it on the map
// function getData(map){
//
//
//   `filter`
//   //Example 2.3 line 22...load the data
//   $.ajax("data/drinkingwater.geojson", {
//       dataType: "json",
//       success: function(response){
//         //create marker options
//         var redColor = {
//             radius: 8,
//             fillColor: "#d73027",
//             color: "#000",
//             weight: 1,
//             opacity: 1,
//             fillOpacity: 0.8
//         };
//         // set new color
//         var orangeColor = {
//             radius: 8,
//             fillColor: "#fdae61",
//             color: "#000",
//             weight: 1,
//             opacity: 1,
//             fillOpacity: 0.8
//         };
//         var yellowColor = {
//             radius: 8,
//             fillColor: "#ffffbf",
//             color: "#000",
//             weight: 1,
//             opacity: 1,
//             fillOpacity: 0.8
//         };
//         var blueColor = {
//             radius: 8,
//             fillColor: "#abd9e9",
//             color: "#000",
//             weight: 1,
//             opacity: 1,
//             fillOpacity: 0.8
//         };
//         var navyColor = {
//             radius: 8,
//             fillColor: "#2c7bb6",
//             color: "#000",
//             weight: 1,
//             opacity: 1,
//             fillOpacity: 0.8
//         };
//           //create a Leaflet GeoJSON layer and add it to the map
//           L.geoJson(response, {
//               pointToLayer: function (feature, latlng) {
//                   if (feature.properties.year2015 <= 20){
//                     return L.circleMarker(latlng, redColor);
//                   }
//                   if (feature.properties.year2015 > 20 && feature.properties.year2015 <= 40){
//                     return L.circleMarker(latlng, orangeColor);
//                   }
//                   if (feature.properties.year2015 > 40 && feature.properties.year2015 <= 60){
//                     return L.circleMarker(latlng, yellowColor);
//                   }
//                   if (feature.properties.year2015 > 60 && feature.properties.year2015 <= 80){
//                     return L.circleMarker(latlng, blueColor);
//                   }
//                   if (feature.properties.year2015 > 80 && feature.properties.year2015 <= 100){
//                     return L.circleMarker(latlng, navyColor);
//                   }
//               }
//           }).addTo(map);
//
//         }
//     });
//   };
// ------------------------------------------------------------

//Step 2: Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/drinkingwater.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, map);
        }
    });
};

// `Example 1.5: dynamically calculating each circle marker radius in main.js`
//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

    //Example 1.3 line 1...Step 3: Add circle markers for point features to the map
function createPropSymbols(data, map){
    //Step 4: Determine which attribute to visualize with proportional symbols
    var attribute = "year2015";

    //Example 1.2 line 13...create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
          // `Example 2.1: implementing popups in a named pointToLayer() function in main.js`
          //function to convert markers to circle markers
              //Determine which attribute to visualize with proportional symbols
              var attribute = "year2015";

              //create marker options
              var options = {
                  fillColor: "#ff7800",
                  color: "#000",
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.8
              };

              //For each feature, determine its value for the selected attribute
              var attValue = Number(feature.properties[attribute]);

              //Give each feature's circle marker a radius based on its attribute value
              options.radius = calcPropRadius(attValue);

              //create circle marker layer
              var layer = L.circleMarker(latlng, options);

              //build popup content string
              
              var popupContent = "<p><b>Country:</b> " + feature.properties.Country +
              "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";

              //bind the popup to the circle marker
              layer.bindPopup(popupContent);

              //return the circle marker to the L.geoJson pointToLayer option
              return layer;

            // return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};




// //Add circle markers for point features to the map
// function createPropSymbols(data, map){
//     //create a Leaflet GeoJSON layer and add it to the map
//     L.geoJson(data, {
//         pointToLayer: pointToLayer
//     }).addTo(map);
// };
//
// `Example 2.2: formatting the popups in main.js`
// //build popup content string starting with city...Example 2.1 line 24
//  var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p>";
//
//  //add formatted attribute to popup content string
//  var year = attribute.split("_")[1];
//  popupContent += "<p><b>Population in " + year + ":</b> " +
//  feature.properties[attribute] + " million</p>";
//
// `Implement well-formatted popups for the features on your Leaflet map.`
//
// `Example 2.4: using a title marker option in main.js`
// //create marker layer...Example 2.1 line 21
//     var layer = L.marker(latlng, {
//         title: feature.properties.City
//     });
//
// `Example 2.5: adding event listeners to each circle marker in main.js`
// //Example 2.1 line 27...bind the popup to the circle marker
//     layer.bindPopup(popupContent);
//
//     //event listeners to open popup on hover
//     layer.on({
//         mouseover: function(){
//             this.openPopup();
//         },
//         mouseout: function(){
//             this.closePopup();
//         }
//     });
//
// `Example 2.6: adding an offset to each circle marker`
// //Example 2.5 line 1...bind the popup to the circle marker
//     layer.bindPopup(popupContent, {
//         offset: new L.Point(0,-options.radius)
//     });
//
// `Example 2.9: adding a click listener to each circle marker in main.js`
// ///event listeners to open popup on hover and fill panel on click...Example 2.5 line 4
//     layer.on({
//         mouseover: function(){
//             this.openPopup();
//         },
//         mouseout: function(){
//             this.closePopup();
//         },
//         click: function(){
//             $("#panel").html(popupContent);
//         }
//     });
//
// `Example 2.10: implementing an information panel and tooltip-like popups in main.js`
// //original popupContent changed to panelContent...Example 2.2 line 1
// var panelContent = "<p><b>City:</b> " + feature.properties.City + "</p>";
//
// //add formatted attribute to panel content string
// var year = attribute.split("_")[1];
// panelContent += "<p><b>Population in " + year + ":</b> " +
// feature.properties[attribute] + " million</p>";
//
// //popup content is now just the city name
// var popupContent = feature.properties.City;
//
// //bind the popup to the circle marker
// layer.bindPopup(popupContent, {
//     offset: new L.Point(0,-options.radius),
//     closeButton: false
// });
//
// //event listeners to open popup on hover and fill panel on click
// layer.on({
//     mouseover: function(){
//         this.openPopup();
//     },
//     mouseout: function(){
//         this.closePopup();
//     },
//     click: function(){
//         $("#panel").html(panelContent);
//     }
// });
//
// `For your Leaflet Lab, you may implement either full popups—with or
// without the hover events—or an information panel and tooltips.`
//
// `Example 3.3: creating an HTML range slider in main.js`
// //Step 1: Create new sequence controls
// function createSequenceControls(map){
//     //create range input element (slider)
//     $('#panel').append('<input class="range-slider" type="range">');
// };
//
// //Import GeoJSON data
// function getData(map){
//     //load the data
//     $.ajax("data/MegaCities.geojson", {
//         dataType: "json",
//         success: function(response){
//
//             createPropSymbols(response, map);
//             createSequenceControls(map);
//
//         }
//     });
// };
//
// `Example 3.4: adding slider attributes in main.js`
// //Example 3.3 line 1...create range input element (slider)
//     $('#panel').append('<input class="range-slider" type="range">');
//
//     //set slider attributes
//     $('.range-slider').attr({
//         max: 6,
//         min: 0,
//         value: 0,
//         step: 1
//     });
//
//   `Example 3.5: adding skip buttons in main.js`
//   //below Example 3.4...add skip buttons
//     $('#panel').append('<button class="skip" id="reverse">Reverse</button>');
//     $('#panel').append('<button class="skip" id="forward">Skip</button>');
//
//   `Example 3.6: replacing button content with images in main.js`
//   //Below Example 3.5...replace button content with images
//    $('#reverse').html('<img src="img/reverse.png">');
//    $('#forward').html('<img src="img/forward.png">');
//
// `In your main.js script, create a slider for sequencing your Leaflet map.
// Optionally, you may also add skip buttons.`
//
// `Example 3.8: creating a variable to hold the attributes array in main.js`
// //Example 3.3 line 8...load the data
//     $.ajax("data/MegaCities.geojson", {
//         dataType: "json",
//         success: function(response){
//             //create an attributes array
//             var attributes = processData(response);
//
//             createPropSymbols(response, map, attributes);
//             createSequenceControls(map, attributes);
//         }
//     });
//
// `Example 3.9: building the attributes array in main.js`
// //Above Example 3.8...Step 3: build an attributes array from the data
// function processData(data){
//     //empty array to hold attributes
//     var attributes = [];
//
//     //properties of the first feature in the dataset
//     var properties = data.features[0].properties;
//
//     //push each attribute name into attributes array
//     for (var attribute in properties){
//         //only take attributes with population values
//         if (attribute.indexOf("Pop") > -1){
//             attributes.push(attribute);
//         };
//     };
//
//     //check result
//     console.log(attributes);
//
//     return attributes;
// };
//
// `Example 3.10: calling pointToLayer() with three parameters in main.js`
// //Example 2.1 line 34...Add circle markers for point features to the map
// function createPropSymbols(data, map, attributes){
//     //create a Leaflet GeoJSON layer and add it to the map
//     L.geoJson(data, {
//         pointToLayer: function(feature, latlng){
//             return pointToLayer(feature, latlng, attributes);
//         }
//     }).addTo(map);
// };
//
// `Example 3.11: dynamically assign first attribute in main.js`
// //Example 2.1 line 1...function to convert markers to circle markers
// function pointToLayer(feature, latlng, attributes){
//     //Step 4: Assign the current attribute based on the first index of the attributes array
//     var attribute = attributes[0];
//     //check
//     console.log(attribute);
//
// `Example 3.12: adding event listeners for sequence inputs in main.js`
// //Below Example 3.6 in createSequenceControls()
//     //Step 5: click listener for buttons
//     $('.skip').click(function(){
//         //sequence
//     });
//
//     //Step 5: input listener for slider
//     $('.range-slider').on('input', function(){
//         //sequence
//     });
//
// `Example 3.13: retrieving the value of the slider in main.js`
// //Example 3.12 line 7...Step 5: input listener for slider
//     $('.range-slider').on('input', function(){
//         //Step 6: get the new index value
//         var index = $(this).val();
//     });
//
// `Example 3.14: changing the index value and
// upating the slider when a button is clicked in main.js`
// //Example 3.12 line 2...Step 5: click listener for buttons
//     $('.skip').click(function(){
//         //get the old index value
//         var index = $('.range-slider').val();
//
//         //Step 6: increment or decrement depending on button clicked
//         if ($(this).attr('id') == 'forward'){
//             index++;
//             //Step 7: if past the last attribute, wrap around to first attribute
//             index = index > 6 ? 0 : index;
//         } else if ($(this).attr('id') == 'reverse'){
//             index--;
//             //Step 7: if past the first attribute, wrap around to last attribute
//             index = index < 0 ? 6 : index;
//         };
//
//         //Step 8: update slider
//         $('.range-slider').val(index);
//     });
//
// `Example 3.15: calling a function to update the proportional symbols in main.js`
// //Called in both skip button and slider event listener handlers
//         //Step 9: pass new attribute to update symbols
//         updatePropSymbols(map, attributes[index]);
//
// `Example 3.16: using eachLayer() to update each circle marker in main.js`
// //Step 10: Resize proportional symbols according to new attribute values
// function updatePropSymbols(map, attribute){
//     map.eachLayer(function(layer){
//         if (layer.feature && layer.feature.properties[attribute]){
//             //update the layer style and popup
//         };
//     });
// };
//
// `Finally, we need script that will update each circle marker's radius
// based on the new attribute values and replace the popup (or info panel)
// content with the new data (example 3.17).
//
// Example 3.17: resetting each circle marker's radius and popup in main.js`
// //Example 3.16 line 4
//         if (layer.feature && layer.feature.properties[attribute]){
//             //access feature properties
//             var props = layer.feature.properties;
//
//             //update each feature's radius based on new attribute values
//             var radius = calcPropRadius(props[attribute]);
//             layer.setRadius(radius);
//
//             //add city to popup content string
//             var popupContent = "<p><b>City:</b> " + props.City + "</p>";
//
//             //add formatted attribute to panel content string
//             var year = attribute.split("_")[1];
//             popupContent += "<p><b>Population in " + year + ":</b> " + props[attribute] + " million</p>";
//
//             //replace the layer popup
//             layer.bindPopup(popupContent, {
//                 offset: new L.Point(0,-radius)
//             });
//         };
//
// `Integrate your sequencing controls with your map to resymbolize the features
// correctly and change the popup or information panel content on each retrieve interaction.`
//
// `Choose a fifth interaction operator that you will implement for your Leaflet Lab.
// Make sure the operator you choose fits the nature of your data and the purpose of your map.`




$(document).ready(createMap)
