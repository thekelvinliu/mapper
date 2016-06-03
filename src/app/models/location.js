'use strict';

import mongoose from 'mongoose';

// create new schema
const schema = new mongoose.Schema({
  adminCode1: String,
  adminName1: String,
  countryCode: String,
  countryId: String,
  countryName: String,
  distance: String,
  flag: String,
  geonameId: Number,
  lat: String,
  lng: String,
  name: String,
  population: Number,
  toponymName: String,
  user: String
});
// virtual date attribute
schema.virtual('date').get(function() {
  return this._id.getTimestamp();
});
// assign schema to 'Location'
mongoose.model('Location', schema);
