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
// holds all divs
let divs = [];
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
// returns given date as a formatted string 'DD Mon. YY hh:mm'
const formatDate = d => {
  let dayOfMonth = d.getDate();
  if (dayOfMonth < 10) dayOfMonth = `0${dayOfMonth}`;
  const months = [
    'Jan.',
    'Feb.',
    'Mar.',
    'Apr.',
    'May',
    'Jun.',
    'Jul.',
    'Aug.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.'
  ];
  const time = [d.getHours(), d.getMinutes()].join(':');
  return [
    dayOfMonth,
    months[d.getMonth()],
    d.getYear() % 100,
    time
  ].join(' ');
};
// returns a usable toponym from loc
const getToponym = loc => {
  switch (loc.countryCode) {
    case 'US': return `${loc.toponymName}, ${loc.adminCode1}`;
    case 'GB': return `${loc.toponymName}, ${loc.adminName1}`;
    default: return `${loc.adminName1}, ${loc.countryName}`;
  }
};
// callback function for when google maps api script is done
const mapMain = () => {
  // create the map
  map = createMap();
  // create sidebar element, map marker, info window, etc. for locations
  locations.forEach((e, i, A) => {
    // declare a div that is only used for user-specific view (simple is false)
    let div;
    if (!simple) {
      // actually create div
      div = document.createElement('div');
      // give it text
      div.innerHTML = [
        formatDate(new Date(e.date)),
        '<br>',
        e.flag,
        getToponym(e)
      ].join(' ');
      // add some style
      div.style.borderTop = "1px dashed #333";
      // append to location list
      document.getElementById('location-list').appendChild(div);
      // add div
      divs.push(div);
    }

    // create marker
    const marker = new google.maps.Marker({
      title: e.user,
      position: getPosition(e),
      map,
      icon: '/img/pin_32.png'
    });
    // add marker
    markers.push(marker);

    // create window
    const info = new google.maps.InfoWindow({
      maxWidth: 200,
      content: (simple) ? e.user : div
    });
    // add window
    windows.push(info);

    // add event listeners
    marker.addListener('click', () => {
      closeCurrent();
      // center map on marker and zoom
      map.setCenter(marker.getPosition());
      if (map.zoom < 14) map.setZoom(map.zoom + 2);
      // open window and save reference
      info.open(map, marker);
      openWindow = info;
    });
    info.addListener('closeclick', () => {
      closeCurrent();
    });
  });
};
// reset the whole map
const resetMap = () => {
  if (map) {
    map.setCenter(MAP_DEFAULTS.center);
    map.setZoom(MAP_DEFAULTS.zoom);
  } else map = createMap();
};
