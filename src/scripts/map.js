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
  // get time as a string in the form 'hh:mm'
  const time = d.toTimeString().slice(0, 5);
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
  // the containing div for sidebar information, null for the index page
  const container = document.getElementById('location-list');
  // create sidebar element, map marker, info window for locations
  locations.forEach((e, i, A) => {
    // create div only for user-specific view (container is not null)
    let div;
    if (container) {
      div = document.createElement('div');
      // give it text
      div.innerHTML = [
        formatDate(new Date(e.date)),
        '<br>',
        e.flag,
        getToponym(e)
      ].join(' ');
      // add separator and div to sidebar
      let separator = document.createElement('div');
      separator.style.borderTop = '1px dashed #333';
      container.appendChild(separator);
      container.appendChild(div);
      // put div in array
      divs.push(div);
    }
    // create marker
    const marker = new google.maps.Marker({
      title: e.user,
      position: getPosition(e),
      map,
      icon: '/img/pin_32.png'
    });
    // save marker
    markers.push(marker);
    // create window
    const info = new google.maps.InfoWindow({
      maxWidth: 200,
      content: (container) ? div.cloneNode(true) : e.user
    });
    // save info window
    windows.push(info);

    // set event listeners
    if (container) {
      div.addEventListener('click', () => {
        google.maps.event.trigger(marker, 'click', {});
      });
    }
    marker.addListener('click', () => {
      if (openWindow) openWindow.close();
      // center map on marker and zoom
      map.setCenter(marker.getPosition());
      if (map.zoom < 10) map.setZoom(map.zoom + 2);
      // open window and save reference
      info.open(map, marker);
      openWindow = info;
    });
    info.addListener('closeclick', () => {
      if (openWindow) openWindow.close();
    });
  });
  // display total
  if (container) {
    const totalDiv = document.createElement('div');
    totalDiv.innerHTML = `Total: ${locations.length}`;
    container.appendChild(totalDiv);
    totalDiv.style.borderTop = '1px solid #333';
  }
};
