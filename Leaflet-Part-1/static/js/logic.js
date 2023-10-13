// URL for eq data
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Make call to url
d3.json(url).then(function (data) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

    createData(data.features);
  
  });

// Set origin and zoom level
let mapCoords = [40.09, -105.71];
let mapZoomLevel = 5;

// Create map
function createMap(earthquakes){
  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street
  };

  // Create an overlays object.
  let overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  let myMap = L.map("map", {
    center: mapCoords,
    zoom: mapZoomLevel,
    layers: [street,earthquakes]
  });

  // Create legend for map 
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {

      let div = L.DomUtil.create('div', 'legend');
      div.innerHTML += '<i style="background: rgb(163,246,0)"></i>-10-10<br>';
      div.innerHTML += '<i style="background: rgb(220,244,0)"></i>10-30<br>';
      div.innerHTML += '<i style="background: rgb(247,219,17)"></i>30-50<br>';
      div.innerHTML += '<i style="background: rgb(253,183,42)"></i>50-70<br>';
      div.innerHTML += '<i style="background: rgb(252,163,93)"></i>70-90<br>';
      div.innerHTML += '<i style="background: rgb(255,95,101)"></i>90+<br>';

      return div;
  };
  legend.addTo(myMap);


};

// Create layer to pass into map
function createData(eqData){
    let earthquakes = [];
    for (i=0;i<eqData.length;i++){
        lat = eqData[i].geometry.coordinates[1];
        long = eqData[i].geometry.coordinates[0];
        entry = L.circle([lat,long], {
          stroke: true,
          fillOpacity: 1,
          weight: 1,
          color: 'black',
          fillColor: eqColor(eqData[i].geometry.coordinates[2]),
          radius: eqData[i].properties.mag * 17500
        })
        entry.bindPopup(`<h3>${eqData[i].properties.place}</h3> <p>Depth: ${eqData[i].geometry.coordinates[2]}<br>
        Magnitude: ${eqData[i].properties.mag}<br>
        Time: ${Date(eqData[i].properties.time)}<br>
        </p>`);
        earthquakes.push(entry
          );
      };
      earthquakeLayer = L.layerGroup(earthquakes);

      createMap(earthquakeLayer);

};

// Return color based on depth

function eqColor(depth) {
    if (depth > 90) {
      return 'rgb(255,95,101)'
    } else if (depth > 70) {
      return 'rgb(252,163,93)'
    } else if (depth > 50) {
      return 'rgb(253,183,42)'
    } else if (depth > 30) {
      return 'rgb(247,219,17)'
    } else if (depth > 10) {
      return 'rgb(220,244,0)'
    } else {
      return 'rgb(163,246,0)'
    }
  };

