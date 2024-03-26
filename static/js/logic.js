let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let plates_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(url).then(function(response)
{
    //console.log(response.features);
    createMarkers(response);
})

//manual color scale
function getColor(num)
{
  if (num <= 10)
  {
    return "#ffff66";
  }else if (num <= 30)
  {
    return "#ffcc66";
  }else if (num <= 50)
  {
    return "#ff9933";
  }else if (num <= 70)
  {
    return "#ff5c33";
  }else if (num <= 90)
  {
    return "#ff0000";
  }else
  {
    return "#cc0000";
  }
}

function createMarkers(response)
{
  //read features
    const array = response.features;
    let allMarkers = [];
    
    //looping through earthquakes
    for (data of array)
    {
      //times 2.5 to make the circle bigger
        let radius = data.properties.mag * 2.5;
        let color = getColor(data.geometry.coordinates[2])

        //console.log(color);

        //create marker
        let marker = L.circleMarker([data.geometry.coordinates[1], data.geometry.coordinates[0]], 
            {
                color: 'black',
                opacity: 0.3,
                fillColor: color,
                fillOpacity: 1,
                radius: radius
            }).bindPopup(`<h3>Magitude: ${data.properties.mag}</h3><hr><p>${data.properties.place}</p><hr><p>Depth(km): ${data.geometry.coordinates[2]}</p>`);

        allMarkers.push(marker);
    }

    //console.log(allMarkers);

    createMap(L.layerGroup(allMarkers));
}

function createMap(markers)
{
      // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = 
  {
    "Street Map": streetmap,
    "Topographic Map": topo
  };

        // Our style object
let mapStyle = 
{
  color: "yellow",
  weight: 1.5
};

let platesLayer = L.layerGroup([]);

// Getting our GeoJSON data
  d3.json(plates_url).then(function(data) 
  {
  // Creating a GeoJSON layer with the retrieved data
  let plates = L.geoJson(data, {
    // Passing in our style object
    style: mapStyle
  })
  platesLayer.addLayer(plates);
});

  // Create an overlayMaps object to hold the bikeStations layer.
  let overlayMaps = 
  {
    "Earthquakes": markers
  };

  overlayMaps["Tectonic Plates"] = platesLayer;

    // Create the map object with options.
    let myMap = L.map("map", 
  {
    center: [-2.87, 90.77],
    zoom: 3,
    layers: [streetmap, markers, platesLayer]
  });

   // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
   L.control.layers(baseMaps, overlayMaps).addTo(myMap);
   
    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() 
  {
    let div = L.DomUtil.create("div", "info legend");
    let limits = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
    let colors = ["#ffff66", "#ffcc66", "#ff9933", "#ff5c33", "#ff0000", "#cc0000"];

    //pair color and limits together
    let legendInfo = "<h3>Depth(km)</h3>";
    limits.forEach(function (limit, index) 
    {
      legendInfo += `
      <div class="limit-color-pair">
      <li style="background-color: ${colors[index]}"></li>
      <div class="limit">${limit}</div>
      </div>`;
    });

    div.innerHTML = legendInfo;

    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);

}
  