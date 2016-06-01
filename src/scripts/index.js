'use strict';

// GLOBAL VARIABLES
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
      position: {
        lat: parseFloat(e.lat),
        lng: parseFloat(e.lng)
      },
      map,
      icon: '/img/pin_32.png'
    });
    markers.push(marker);
    // create window
    const info = new google.maps.InfoWindow({
      maxWidth: 200,
      content: JSON.stringify(e)
    });
    windows.push(info);
  });
};

// reset the whole map
const resetMap = () => {

};

// MAIN
dropAllMarkers(locations);
