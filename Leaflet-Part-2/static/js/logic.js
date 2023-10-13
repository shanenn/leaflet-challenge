// URL for eq data
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
// URL for tectnoic data
let geoUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'

// Make nested call to URLs
d3.json(url).then(function (data) {
  let eqData = data.features
  d3.json(geoUrl).then(function (data) {
    let tectonicData = data.features
    createMap(eqData,tectonicData)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    });

  
  });

// Set origin and zoom level

let mapCoords = [40.09, -105.71];
let mapZoomLevel = 5;



function createMap(eqData,tectonicData){
  

  let earthquakes = createEqData(eqData);
  let tectonics = createTectonicData(tectonicData);

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
    "Satellite Map": satellite
  };

  // Create an overlays object.
  let overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonics": tectonics
  };

  // Create a new map.
  // Edit the code to add the earthquake data to the layers.
  let myMap = L.map("map", {
    center: mapCoords,
    zoom: mapZoomLevel,
    layers: [street,earthquakes]
  });

  // Create a layer control that contains our baseMaps.
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

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

// Use eqdata to make layer for earthquake
function createEqData(eqData){
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

      return earthquakeLayer;

};

// Use tectonicdata to make layer for tectonic boundaries
function createTectonicData(tectonicData) {
  let tectonics = L.geoJson(tectonicData, {
        style: function(feature) {
          return {
            color: "orange",
            weight: 3
          };
        }
      })
  return tectonics

}

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
