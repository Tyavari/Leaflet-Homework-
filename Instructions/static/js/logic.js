// Create the map 
var myMap = L.map("map", {
    center: [40, 0],
    zoom: 2.3
  });
  
  // Adding the tile layer
  var tile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Geojason data link
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Create color scale
function chooseColor(depth){
  switch(true){
    case depth > 80:
      return "#993300";
    case depth > 60:
      return "#ff3300";
    case depth > 40:
      return "#ff6600";
    case depth > 20:
      return "#ff6666";
    case depth > 10:
      return "#ff9999";
    default:
      return "#ffcccc";

  }
}

function chooseRadius(m){
  if (m == 0){
    var mag = 1;
    return mag;
  }
  var mag = m * 3.75;
  return mag;
}


// d3 git request 
d3.json(link).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {

    pointToLayer: function(features, coords){
      return L.circleMarker(coords);
    },

    //marker stle based on earth quate severity
    style: function(f){
    
      return {
      opacity: 0.6,
      fillOpacity: 1,
      fillColor: chooseColor(f.geometry.coordinates[2]),
      color: "#000000",
      radius: chooseRadius(f.properties.mag),
      stroke: true,
      weight: 0.5
      };
    },

    // Offer additional quake info when marker is clicked
    onEachFeature: function(features, l){
      l.bindPopup("Located at: " + features.properties.place + "<br>Magnitude: " + features.properties.mag + "<br>Alert: " + features.properties.alert);
    }
  }).addTo(myMap);
  
  // Create Legend
  var Map_Legend = L.control({
    position: "bottomright"
  });

  Map_Legend.onAdd = function() {
    let depthrange = [0, 10, 20, 40, 60, 80];
    let colors = ["#ffcccc", "#ff9999", "#ff6666", "#ff6600","#ff3300", "#993300"];
    var div = L.DomUtil.create("div", "legend");
    for (var i = 0; i<depthrange.length -1 ; i++) {
      div.innerHTML +=
      "<i style='background: " + colors[i] + "'></i> " +
      depthrange[i] + "&ndash;"+ depthrange[i + 1]  + "<br>" ;
    }
    div.innerHTML += "<i style='background: " + colors[depthrange.length-1] + "'></i> " +
    depthrange[depthrange.length-1] + "+";
    return div;
   
  };

Map_Legend.addTo(myMap)

});