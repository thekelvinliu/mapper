'use strict';

import mongoose from 'mongoose';

// load bucket model
const Bucket = mongoose.model('Bucket');

export default function(req, res, next) {
  // get client's ip address
  const ip = req.ip ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
}
