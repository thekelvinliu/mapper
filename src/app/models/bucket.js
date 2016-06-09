'use strict';

import mongoose from 'mongoose';

// single minute in ms
const MINUTE = 60*1000;
// allow up to 10 hits per ttl
const MAX_HITS = 10;

// create new schema
const schema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    // set ttl as 10 minutes
    expires: 10*MINUTE
  },
  ip: {
    type: String,
    required: true,
    trim: true,
    match: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  },
  hits: {
    type: Number,
    required: true,
    default: 1,
    min: 0,
    max: MAX_HITS
  }
});
// assign schema to 'Bucket'
mongoose.model('Bucket', schema);
