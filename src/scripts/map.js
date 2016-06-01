'use strict';

// VARIABLES
const MAP_DEFAULTS = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 2
};
let map;

// FUNCTIONS
// initializes the map (called when google maps api script is completed)
const initMap = () => {
  map = new google.maps.Map(document.getElementById('map'), MAP_DEFAULTS);
};
// reset the whole map
const resetMap = () => {
  if (map) {
    map.setCenter(MAP_DEFAULTS.center);
    map.setZoom(MAP_DEFAULTS.zoom);
  } else initMap();
};
// returns a random float in the range [min, max)
const randomFloat = (min, max) => Math.random()*(max - min) + min;
// returns an object with lat and lng keys from loc and slight randomization
const getPosition = loc => ({
  lat: parseFloat(loc.lat) + randomFloat(0.0001, 0.0015),
  lng: parseFloat(loc.lng) + randomFloat(0.0001, 0.0015)
});
