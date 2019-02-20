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

//function to retrieve the data and place it on the map
function getData(map){


  `filter`
  //Example 2.3 line 22...load the data
  $.ajax("data/drinkingwater.geojson", {
      dataType: "json",
      success: function(response){
        //create marker options
        var redColor = {
            radius: 8,
            fillColor: "#d73027",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        // set new color
        var orangeColor = {
            radius: 8,
            fillColor: "#fdae61",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        var yellowColor = {
            radius: 8,
            fillColor: "#ffffbf",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        var blueColor = {
            radius: 8,
            fillColor: "#abd9e9",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        var navyColor = {
            radius: 8,
            fillColor: "#2c7bb6",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
          //create a Leaflet GeoJSON layer and add it to the map
          L.geoJson(response, {
              pointToLayer: function (feature, latlng) {
                  if (feature.properties.year2015 <= 20){
                    return L.circleMarker(latlng, redColor);
                  }
                  if (feature.properties.year2015 > 20 && feature.properties.year2015 <= 40){
                    return L.circleMarker(latlng, orangeColor);
                  }
                  if (feature.properties.year2015 > 40 && feature.properties.year2015 <= 60){
                    return L.circleMarker(latlng, yellowColor);
                  }
                  if (feature.properties.year2015 > 60 && feature.properties.year2015 <= 80){
                    return L.circleMarker(latlng, blueColor);
                  }
                  if (feature.properties.year2015 > 80 && feature.properties.year2015 <= 100){
                    return L.circleMarker(latlng, navyColor);
                  }
              }
          }).addTo(map);

        }
    });
  };

$(document).ready(createMap)
