'use strict';

import async from 'async';
import express from 'express';
import mongoose from 'mongoose';
import request from 'request';
import logger from '../helpers/logger';
import {
  contains,
  isEmpty,
  newErr
} from '../helpers/functions';

// load models
const Location = mongoose.model('Location');
const User = mongoose.model('User');

// create router
const router = express.Router();
// yo api hook
router.get('/', (req, res, next) => {
  logger.info('received Yo');
  const qs = req.query;
  logger.debug(`query string: ${JSON.stringify(qs)}`);
  async.waterfall([
    // send normal 404 if query string is empty
    cb => (!isEmpty(qs)) ? cb() : cb(newErr(404, 'Not Found')),
    // ensure query string has 'username' and 'location' fields
    cb => (['username', 'location'].every(e => contains(qs, e)))
      ? cb() : cb(newErr(400, 'invalid query string')),
    // ensure user is registered and hasn't updated in past 3 mins
    cb => {
      // find the user
      const user = qs.username.toUpperCase();
      User.findOne({
        user
      }, (err, doc) => {
        if (err) return cb(newErr(400, 'invalid user'));
        else if (Date.now() < doc.lastUpdated.getTime() + 3*60*1000)
          return cb(newErr(400, `${user} was already updated recently`));
        else return cb(null, doc);
      });
    },
    // send request to geonames to get metadata on latlng coords
    (userDoc, cb) => {
      // unpack lat lng
      const [lat, lng] = qs.location.split(';');
      if (!lat || !lng) return cb(newErr(400, 'invalid location'));
      // send request to geonames
      request({
        url: 'http://api.geonames.org/findNearbyPlaceNameJSON',
        qs: {
          username: 'kelvinliu',
          lat,
          lng
        },
        json: true
      }, (err, response, body) => {
        if (err) return cb(err);
        else if (contains(body, 'geonames')) {
          const data = body.geonames[0];
          if (isEmpty(data)) return cb(newErr(500, 'GeoNames request failed'));
          else return cb(null, userDoc, data);
        }
        else return cb(newErr(500, 'GeoNames request failed'));
      });
    },
    // update user and save location data
    (userDoc, data, cb) => {
      async.parallel([
        // update userDoc.lastUpdated
        cb => {
          userDoc.lastUpdated = Date.now();
          userDoc.save(err => (err) ? cb(err) : cb());
        },
        // save location data
        cb => {
          data.user = userDoc.user;
          logger.debug(`location data: ${JSON.stringify(data)}`);
          const doc = new Location(data);
          doc.save(err => (err) ? cb(err) : cb());
        }
      ], err => (err) ? cb(err) : cb(null, userDoc.user));
    }
  ], (err, user) => {
    if (err) logger.error(`encountered ${err.status} error: '${err.message}'`);
    else logger.info(`'${user}' successfully uploaded loation`);
    return (err) ? next(err) : res.status(200).end();
  });
});

// export router
module.exports = router;
