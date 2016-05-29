'use strict';

import async from 'async';
import express from 'express';
import mongoose from 'mongoose';
import {
  loadLocations,
  loadUsers
} from '../helpers/functions';

// load models
const Location = mongoose.model('Location');

// create router
const router = express.Router();
// load other routes
router.use('/register', require('./register'));
router.use('/yo', require('./yo'));

// main page
router.get('/', (req, res, next) =>
  async.parallel([
    loadLocations,
    loadUsers
  ], (err, results) => (err) ? next(err) : res.render('index', {
    title: 'mapper',
    locations: results[0],
    users: results[1]
  }))
);

// user page
router.get('/users/:user', (req, res, next) =>
  Location.find({
    user: req.params.user
  }).sort('-date').exec((err, docs) => res.render('users', {
    title: `${req.params.user}`,
    locations: docs
  }))
);

// about page
router.get('/about', (req, res, next) => res.render('about', {
  title: '*about*'
}));

// export router
module.exports = router;

