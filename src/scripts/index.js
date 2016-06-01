'use strict';

// VARIABLES
// the currently opened info window
let openWindow;
// holds all map markers
let markers = [];
// holds all info windows
let windows = [];

// FUNCTIONS
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

// MAIN
dropAllMarkers(locations);
