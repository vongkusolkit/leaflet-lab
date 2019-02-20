/* Map of GeoJSON data from MegaCities.geojson */

// geojson.js script to create a Leaflet map with the MegaCities.geojson data
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

//function to retrieve the data and place it on the map
function getData(map){
    //load the data
//     $.ajax("data/MegaCities.geojson", {
//         dataType: "json",
//         success: function(response){
//             //create a Leaflet GeoJSON layer and add it to the map
//             // L.geoJson(response).addTo(map);
//         }
//     });
// };


// Example 2.4: applying pointToLayer to AJAX data in geojson.js
//Example 2.3 line 22...load the data
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){
            //create marker options
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            //create a Leaflet GeoJSON layer and add it to the map
            // creates orange circle markers
            L.geoJson(response, {
                pointToLayer: function (feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
            }).addTo(map);
        }
    });
};

$(document).ready(createMap);

// // Example 2.5: applying onEachFeature to AJAX data in geojson.js
// //added at Example 2.3 line 20...function to attach popups to each mapped feature
// function onEachFeature(feature, layer) {
//     //no property named popupContent; instead, create html string with all properties
//     var popupContent = "";
//     if (feature.properties) {
//         //loop to add feature property names and values to html string
//         for (var property in feature.properties){
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         layer.bindPopup(popupContent);
//     };
// };
//
// //function to retrieve the data and place it on the map
// function getData(map){
//     //load the data
//     $.ajax("data/MegaCities.geojson", {
//         dataType: "json",
//         success: function(response){
//
//             //create a Leaflet GeoJSON layer and add it to the map
//             // Leaflet map showing a popup bound to a marker using
//             // shows the population throughout the years
//             L.geoJson(response, {
//                 onEachFeature: onEachFeature
//             }).addTo(map);
//         }
//     });
// };
//
// // Example 2.6: applying filter to AJAX data in geojson.js
// //Example 2.3 line 22...load the data
//     $.ajax("data/MegaCities.geojson", {
//         dataType: "json",
//         success: function(response){
//
//             //create a Leaflet GeoJSON layer and add it to the map
//             L.geoJson(response, {
//                 //use filter function to only show cities with 2015 populations greater than 20 million
//                 filter: function(feature, layer) {
//                     return feature.properties.Pop_2015 > 20;
//                 }
//             }).addTo(map);
//         }
//     });
