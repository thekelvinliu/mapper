'use strict';

import async from 'async';
import express from 'express';
import mongoose from 'mongoose';
import logger from '../helpers/logger';

// load models
// const Location = mongoose.model('Location');
const User = mongoose.model('User');

// create router
const router = express.Router();
// load other routes
router.use('/register', require('./register'));
router.use('/yo', require('./yo'));

// main page
router.get('/', (req, res, next) => {
  // async.parallel({
  //   getUsers: cb => {
  //     User.find({}, (err, docs) => {
  //       if (err) logger.error(err);
  //       let users = docs.map((v, i) => v.user);
  //       logger.info(users);
  //     })
  //   },
  //   getLocations: cb => {

  //   }
  // }, (err, results) => {

  // });
  User.find({}, (err, docs) => {
    if (err) logger.error(err);
    let users = docs.map(d => d.user);
    logger.info(users);
    return res.render('index', {
      title: 'mapper',
      users
    });
  });
});
// user page
router.get('/users/:user', (req, res, next) => res.render('users', {
  title: `${req.params.user}`,
  data: [{
    lat: 0,
    lng: 0
  }, {
    lat: 1,
    lng: 1
  }, {
    lat: 2,
    lng: 2
  }]
}));
// about page
router.get('/about', (req, res, next) => res.render('about', {
  title: '*about*'
}));

// export router
module.exports = router;

