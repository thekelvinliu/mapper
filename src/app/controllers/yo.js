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
        if (err) {
          logger.error(err);
          return cb(newErr(400, 'invalid user'));
        } else if (Date.now() < doc.lastUpdated.getTime() + 3*60*1000) {
          logger.warn(`${user} already updated in the past 3 minutes`);
          return cb(newErr(400, 'user has updated in the past 3 minutes'));
        } else {
          return cb(null, doc);
        }
      });
    },
    // send request to geonames to get metadata on latlng coords
    (userDoc, cb) => {
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
        if (err) {
          logger.warn('request to GeoNames failed');
          return cb(err);
        } else if (contains(body, 'geonames')) {
          const data = body.geonames[0];
          if (!isEmpty(data)) {
            logger.info('request to GeoNames successful');
            return cb(null, userDoc, data);
          } else {
            logger.warn('request to GeoNames failed');
            return cb(newErr(500, 'GeoNames request failed'));
          }
        } else {
          logger.warn('request to GeoNames failed');
          return cb(newErr(500, 'GeoNames request failed'));
        }
      });
    },
    // update user and save location data
    (userDoc, data, cb) => {
      async.parallel([
        // update userDoc.lastUpdated
        cb => {
          userDoc.lastUpdated = Date.now();
          userDoc.save(err => {
            if (err)
              logger.warn(`failed to update ${userDoc.user}`);
            else
              logger.info(`successfully updated ${userDoc.user}`);
            return cb(null, (err) ? false : true);
          });
        },
        // save location data
        cb => {
          data.user = userDoc.user;
          logger.debug(`location data: ${JSON.stringify(data)}`);
          const doc = new Location(data);
          doc.save(err => {
            if (err)
              logger.warn('failed to save location data');
            else
              logger.info('successfully saved location data');
            return cb(null, (err) ? false : true);
          });
        }
      ], (err, results) => {
        if (err) return cb(err);
        else if (results.every(e => e)) return cb();
        else return cb(newErr(500, 'database operation failed'));
      });
    }
  ], err => (err) ? next(err) : res.status(200));
});

// export router
module.exports = router;
