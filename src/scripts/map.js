'use strict';

// VARIABLES
// the map
let map;
// div containing the map
const MAP_NODE = document.getElementById('map');
// defaults for the map
const MAP_DEFAULTS = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 2
};
// holds all map markers
let markers = [];
// holds all info windows
let windows = [];
// the currently opened info window
let openWindow;
// the currently selected div
let selectedDiv;

// FUNCTIONS
// returns a new map
const createMap = () => new google.maps.Map(MAP_NODE, MAP_DEFAULTS);
// returns a random float in the range [min, max)
const randomFloat = (min, max) => Math.random()*(max - min) + min;
// returns an object with lat and lng keys from loc and slight randomization
const getPosition = loc => ({
  lat: parseFloat(loc.lat) + randomFloat(0.0001, 0.0015),
  lng: parseFloat(loc.lng) + randomFloat(0.0001, 0.0015)
});
// close current window and unselect div
const closeCurrent = () => {
  if (openWindow) {
    openWindow.close();
    selectedDiv = null;
  }
};
// create a map marker for each location in locArray
const dropAllMarkers = locArr => {
  locArr.forEach((e, i, A) => {
    // create marker
    const marker = new google.maps.Marker({
      title: e.user,
      position: getPosition(e),
      map,
      icon: '/img/pin_32.png'
    });
    markers.push(marker);
    // create window
    const info = new google.maps.InfoWindow({
      maxWidth: 200,
      content: e.user
    });
    windows.push(info);
    // add event listeners
    marker.addListener('click', () => {
      // close currently opened info window is it exists
      if (openWindow) openWindow.close();
      // center map on marker and zoom
      map.setCenter(marker.getPosition());
      if (map.zoom < 14) map.setZoom(map.zoom + 2);
      // open window and save reference
      info.open(map, marker);
      openWindow = info;
    });
    info.addListener('closeclick', () => {
      // close currently opened info window is it exists
      if (openWindow) openWindow.close();
    });
  });
};
// callback function for when google maps api script is done
const mapMain = () => {
  map = createMap();
  dropAllMarkers(locations);
};
// reset the whole map
const resetMap = () => {
  if (map) {
    map.setCenter(MAP_DEFAULTS.center);
    map.setZoom(MAP_DEFAULTS.zoom);
  } else map = createMap();
};
