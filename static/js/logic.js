// logic.js

//console.log("Loading...");

let features;
let depthArray = [];

// Create map object with openstreetmap with latitiude and longitude and zoom at where you can see most data points

let map = L.map('map').setView([15, -67], 2.3);
//Create tile layer with open street attribution 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 13,
    attribution: '© OpenStreetMap'
}).addTo(map);

//construct url to use for json retrieval and data to place data

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//collect the data with D3 and call url for geojson to plot points
d3.json(url).then(function(data) {

  features = data.features;  

  // Iterate over features in th geojson to create points for viz

  for (let i=0; i<features.length; i++) 
  {

      // Use for placing circles on map by collecting points and coordinates to display data

      let coords = features[i].geometry.coordinates;
      let lon = coords[0];
      let lat = coords[1];

      // Use for size of circles, color of circles, and popup text

      let depth = parseInt(coords[2]);
      if (!Number.isNaN(depth)) {
        depthArray.push(depth);
      }
      let mag = parseFloat(features[i].properties.mag);
      if (mag < 0) {
        mag = Math.abs(mag);
      }  
      if (depth < 0) {
        depth = Math.abs(depth);
      }  
      let title = features[i].properties.title;
      let magnitude = features[i].properties.mag;
      let place = features[i].properties.place;

      // adjust size of circles based on magnitude to use viz advantages
      
      let radius = (200000 * mag) / Math.PI;

      // assign color based on the data for the depth of the earthquake
    
      if (depth <= 15) {
        color = "#26a300";
      } else if (depth <= 35) {
        color = "#91e600";
      } else if (depth <= 55) {
        color = "#fff30a";
      } else if (depth <= 75) {
        color = "#f59f00";
      } else if (depth <= 95) {
        color = "#ff0f0f";
      } else {
        color = "#721d1d";
      }
      //create and draw circle using the Leaflet library 
      let circle = L.circle([lat, lon], {
        color: color,
        fillColor: color,
        fillOpacity: 0.4,
        radius: radius,
        weight: 0.5
      }).addTo(map);     
      //Have pop-up text with Title of incident, depth, magnitude, and location
      let popupText = title + "<br><b>Depth: </b>" + depth + "<br><b>Magnitude: </b>" + magnitude + "<br><b>Location: </b>" + place;
     
      circle.bindPopup(popupText);
            
  }

  let ascDepthArray = depthArray.sort(function(a, b){return a-b});

//creation of the legend
  let legend = L.control({position: "bottomright"});
//Legend showing the colors from above and their correlation to what depth collection they belong to
  legend.onAdd = function(map) {
      let div = L.DomUtil.create("div", "legend");      
      div.innerHTML += "<h4>Depth</h4>";
      div.innerHTML += '<i style="background: #26a300"></i><span><=15</span><br>';
      div.innerHTML += '<i style="background: #91e600"></i><span>16-35</span><br>';
      div.innerHTML += '<i style="background: #fff30a"></i><span>36-55</span><br>';
      div.innerHTML += '<i style="background: #f59f00"></i><span>56-75</span><br>';
      div.innerHTML += '<i style="background: #ff0f0f"></i><span>76-95</span><br>';
      div.innerHTML += '<i style="background: #721d1d"></i><span>>95</span><br>';
      
      return div;   

  };
  
  legend.addTo(map);

});