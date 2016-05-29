'use strict';

import async from 'async';
import express from 'express';
import mongoose from 'mongoose';
import request from 'request';
import logger from '../helpers/logger';
import {
  contains,
  isEmpty,
  loadUsers,
  newErr
} from '../helpers/functions';

// load models
const Location = mongoose.model('Location');

// create router
const router = express.Router();
// yo api hook
router.get('/', (req, res, next) => {
  const qs = req.query;
  logger.debug(`${JSON.stringify(qs)}\n`);
  return res.status(200);
});
// router.get('/', (req, res, next) => {
//   logger.info('received Yo');
//   const qs = req.query;
//   logger.debug(`query string = ${JSON.stringify(qs)}`);
//   async.waterfall([
//     // send normal 404 if query string is empty
//     cb => (!isEmpty(qs)) ? cb() : cb(newErr(404, 'Not Found')),
//     // ensure query string has 'username' and 'location' fields
//     cb => (['username', 'location'].every(e => contains(qs, e)))
//       ? cb() : cb(newErr(400, 'invalid query string')),
//     // ensure qs.username is in the user database
//     cb => {
//       loadUsers((err, users) => {
//         if (err) return cb(err);
//         return (users.includes(qs.username.toUpperCase()))
//           ? cb() : cb(newErr(400, 'invalid user'));
//       });
//     },
//     // send request to geonames to get metadata on latlng coords
//     cb => {
//       const [lat, lng] = qs.location.split(';');
//       if (!lat || !lng) return cb(newErr(400, 'invalid location'));
//       // send request to geonames
//       request({
//         url: 'http://api.geonames.org/findNearbyPlaceNameJSON',
//         qs: {
//           username: 'kelvinliu',
//           lat,
//           lng
//         },
//         json: true
//       }, (err, response, body) => {
//         if (err) {
//           logger.warn('request to GeoNames failed');
//           return cb(err);
//         } else if (contains(body, 'geonames')) {
//           const data = body.geonames[0];
//           if (!isEmpty(data)) {
//             logger.info('request to GeoNames successful');
//             logger.debug(JSON.stringify(data));
//             return cb(null, data);
//           } else {
//             logger.warn('request to GeoNames failed');
//             return cb(newErr(500, 'GeoNames request failed'));
//           }
//         } else {
//           logger.warn('request to GeoNames failed');
//           return cb(newErr(500, 'GeoNames request failed'));
//         }
//       });
//     },
//     // save location data
//     (data, cb) => {
//       data.user = qs.username;
//       const doc = new Location(data);
//       doc.save(err => {
//         if (err) {
//           logger.warn('failed to save location data');
//           return cb(err);
//         } else {
//           logger.info('successfully saved location data');
//           return cb();
//         }
//       });
//     }
//   ], err => (err) ? next(err) : res.status(200));
// });

// export router
module.exports = router;
