

//a consolidated popup-creation function
function createPopup(properties, attribute, layer, radius){
    if (layer.feature.properties == null) {
      var props = properties
    } else {
      var props = layer.feature.properties
    }


    //add city to popup content string
    var popupContent = "<p><b>Country:</b> " + props.Country + "</p>";

    //add formatted attribute to panel content string
    var year = attribute.split("_")[1];
    popupContent += "<p><b>Percentage in "+ year + ":</b> " + props[attribute] + "</p>";

    //replace the layer popup
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-radius)
    });

    //Example 1.2 line 1...Popup constructor function
    //creating new popup objects to bind popup message to current layer

};

function Popup(properties, attribute, layer, radius){
    this.properties = properties;
    this.attribute = attribute;
    this.layer = layer;
    this.year = attribute.split("_")[1];
    this.population = this.properties[attribute];
    this.content = "<p><b>City:</b> " + this.properties.City + "</p><p><b>Population in " + this.year + ":</b> " + this.population + " million</p>";

    this.bindToLayer = function(){
        this.layer.bindPopup(this.content, {
            offset: new L.Point(0,-radius)
        });
    };
};

    //Example 1.2 line 1...Popup constructor function
    //creating new popup objects to bind popup message to current layer
    function Popup(properties, attribute, layer, radius){
        this.properties = properties;
        this.attribute = attribute;
        this.layer = layer;
        this.year = attribute.split("_")[1];
        this.population = this.properties[attribute];
        this.content = "<p><b>City:</b> " + this.properties.City + "</p><p><b>Population in " + this.year + ":</b> " + this.population + " million</p>";

        this.bindToLayer = function(){
            this.layer.bindPopup(this.content, {
                offset: new L.Point(0,-radius)
            });
        };
    };

};


//Example 1.3 line 1...in pointToLayer()
//create new popup
var popup = new Popup(feature.properties, attribute, layer, options.radius);

//Example 1.1 line 2...in pointToLayer()
createPopup(feature.properties, attribute, layer, options.radius);

//add popup to circle marker
popup.bindToLayer();

...


//Example 1.3 line 6...in UpdatePropSymbols()
var popup = new Popup(props, attribute, layer, radius);

//Example 1.1 line 18...in updatePropSymbols()
createPopup(props, attribute, layer, radius);


//add popup to circle marker
popup.bindToLayer();


//Example 1.4: replacing popup content in main.js
//create new popup
var popup = new Popup(feature.properties, attribute, layer, options.radius);

//change the content
popup.content = "<h2>" + popup.population + " million</h2>";

//add popup to circle marker
popup.bindToLayer();

//Example 1.5: a new type of popup in main.js
//create new popup...Example 1.4 line 1
var popup = new Popup(feature.properties, attribute, layer, options.radius);

//create another popup based on the first
var popup2 = Object.create(popup);

//change the content of popup 2
popup2.content = "<h2>" + popup.population + " million</h2>";

//add popup to circle marker
popup2.bindToLayer();

console.log(popup.content) //original popup content

//Example 2.2: custom control class in main.js
//Create new sequence controls
function createSequenceControls(map, attributes){
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        //only triggered after call map.addControl(new SequenceControl())
        //have to put it after?
        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            // ... initialize other DOM elements, add listeners, etc.
            //create range input element (slider)
            $(container).append('<input class="range-slider" type="range">');

            //disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);

            return container;
        }
    });

    map.addControl(new SequenceControl());

//Example 2.7: adding a legend control in main.js
function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
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

            //add attribute legend svg to container
            $(container).append(svg);

            return container;
        }
    });

    map.addControl(new LegendControl());

    updateLegend(map, attributes[0]);
};
