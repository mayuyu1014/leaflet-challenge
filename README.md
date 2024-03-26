# leaflet-challenge

# Part 1: Earthquake Markers

* Collect API returned data through D3 library.
* Create a function to assign colors to each marker based on their earthquake depth.
* Create a maker function, use L.circleMarker from Leaflet library to make markers circle shape.
* The radius of each marker is 2.5x of its magnitude.
* Use L.layerGroup() function to generate a layer group of markers, which is passed to createMap function.

* In createMap() function, the two base map layers are street and topo from leaflet library.
* Create a map object and a layer controller.
* Pass the base map layer which consists of street and topo, and overlay layer that contains markers to the layer controller.
* Add layer controller to the map.

* Create a legend that display the color info.
* Mannually create collections of limits(tags) and colors(hex code).
* Loop through the collections and add limit and its associated color one by one to the legend box.
* Adjust css codes to make the legend look nicer.

# Part 2: Tectonic Plates

* In createMap function, before overlay maps are created, do the API call to collect geoJson data of tectonic plates.
* Create an empty layer group, and inside of the API call function, use L.geoJson() from leaflet library to process each dataset.
* Use the empty layer group to collect the L.geoJson() data, which becomes the plates layer group
* Add plates layer group to overlay maps and the controller.