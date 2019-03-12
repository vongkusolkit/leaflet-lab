
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
  }









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

            //array of circle names to base loop on
            //object to base loop on
            // var circles = {
            //     max: 20,
            //     mean: 40,
            //     min: 60
            // };

            var markers = [
                darkestBlueIcon: 20,
                darkBlueIcon: 40,
                blueIcon: 60,
                lightBlueIcon: 80,
                lightestBlueIcon: 100
            ];

            var labels = [
              'img/happiest.png',
              'img/happy.png',
              'img/content.png',
              'img/sad.png',
              'img/saddest.png'
            ];

            // //loop to add each circle and text to svg string
            // for (var circle in circles){
            //     //circle string
            //     svg += '<circle class="legend-circle" id="' + circle + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="30"/>';
            //
            //     //text string
            //     svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
            // };
            //
            //
            // //loop to add each circle and text to svg string
            // for (var marker in markers){
            //     //circle string
            //     svg += '<circle class="legend-circle" id="' + circle + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="30"/>';
            //
            //     //text string
            //     svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
            // };

            //loop to add each circle and text to svg string
            for (var i = 0; i < markers.length; i++){
                //circle string
                svg += markers[i] + (" <img src="+ labels[i] +" height='50' width='50'>") +'<br>';
    }
            //     '<circle class="legend-circle" id="' + circle + '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="30"/>';
            //
            //     //text string
            //     svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
            // };
            //


            //close svg string
            svg += "</svg>";

            //add attribute legend svg to container
            $(container).append(svg);

            return container;
        }
    });

    map.addControl(new LegendControl());

    updateLegend(map, attributes[0]);
};


//Calculate the max, mean, and min values for a given attribute
function getMarkerValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

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
    var year = attribute.split("_")[1];
    var content = "Year: " + sequenceLabel;

    //replace legend content
    $('#temporal-legend').html(content);

    //get the max, mean, and min values as an object
    var markerValues = getMarkerValues(map, attribute);
};

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
