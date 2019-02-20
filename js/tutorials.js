//LEAFLET TUTORIAL

// set view to chosen geographical coordinates and zoom level
// creates an empty map - calls the map method from leaflet
// and add it to mapid section with the zooming level of 13
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

//add tile layer to map (Mapbox Streets tile layer)
// add basemap to our empty mapid
// call the tileLayer function and defines a bunch of attributes
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    // specifies maxZoom level to 18
    maxZoom: 18,
    // what type of map we want to retrieve from mapbox
    id: 'mapbox.streets',
    // access token required to use base map
    accessToken: 'pk.eyJ1IjoiamFtcHYiLCJhIjoiY2pyejN6YzkyMHA5ejQ5bzlmb3p2eGFoMyJ9.higCxy-3PIqw5gqByFk5VQ'
}).addTo(mymap); // add all these basemaps to mymap we created from first command


//add other things to your map, including markers, polylines, polygons, circles, and popups

//add marker
var marker = L.marker([51.5, -0.09]).addTo(mymap);

//add circle
var circle = L.circle([51.508, -0.11], {
    // set color
    color: 'red',
    fillColor: '#f03',
    // set transparency
    fillOpacity: 0.5,
    // set size of circleMarker
    radius: 500
//add to basemap
}).addTo(mymap);

//add polygon to map from array of latlng points
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
//add to basemap
]).addTo(mymap);

//add popups to marker, circle, and polygon
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

//popups as layers (when you need something more than attaching a popup to an object)
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

//clicking on the map and you will see the coordinates in a popup
var popup = L.popup();

// map click event object 'e' has
// latlng property which is a location at which the click occurred
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

mymap.on('click', onMapClick);

// creates popup variable to use a popup instead of an alert
var popup = L.popup();
// function to show coordinates in a popup when map is clicked on
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        // adds popup to the map and closes the previous one
        .openOn(mymap);
}

mymap.on('click', onMapClick);


// GEOJSON TUTORIAL

// example of a simple GeoJSON feature
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

//create geoJSON and add it to a map
L.geoJSON(geojsonFeature).addTo(map);

// objects passed as an array of valid GeoJSON objects
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

// create an empty GeoJSON layer and assign it to a variable
// to add more features to it later.
var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);

// styles all paths (polylines and polygons) the same way
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);

// styles individual features based on their properties
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];
// check the "party" property and style polygons accordingly by color
L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);

// using the pointToLayer option to create a CircleMarker
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
// passed a latlng and return a circleMarker
L.geoJSON(someGeojsonFeature, {
  //create a marker using specified configuration (geojsonMarkerOptions)
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
// add to map
}).addTo(map);

// attach a popup to features when they are clicked
function onEachFeature(feature, layer) {
    // displays properties as popup if they exist
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

// adds geojsonFeature variable to the map
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);

// filter option can be used to control the visibility
// by returning true or false
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, { //"Busch Field" will not be shown on the map
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

// adds someFeatures variable to the map
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);
