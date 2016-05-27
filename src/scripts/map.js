'use strict';

let map;

const initMap = () => {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 0,
      lng: 0
    },
    zoom: 2
  });
};
