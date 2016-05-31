'use strict';

import async from 'async';
import express from 'express';
import mongoose from 'mongoose';

// load models
const Location = mongoose.model('Location');
const User = mongoose.model('User');

// create router
const router = express.Router();
// load other routes
router.use('/register', require('./register'));
router.use('/yo', require('./yo'));

// main page
router.get('/', (req, res, next) =>
  async.parallel([
    // load all locations
    cb => Location.find((err, docs) => (err) ? cb(err) : cb(null, docs)),
    // load all users
    cb => User.find((err, docs) => (err) ? cb(err) : cb(null, docs.map(d => d.user)))
  ], (err, results) => (err) ? next(err) : res.render('index', {
    title: 'mapper',
    locations: JSON.stringify(results[0]),
    users: results[1]
  }))
);

// user page
router.get('/users/:user', (req, res, next) =>
  Location.find({
    user: req.params.user
  }).sort('-date').exec((err, docs) => res.render('users', {
    title: `${req.params.user}`,
    locations: JSON.stringify(docs)
  }))
);

// about page
router.get('/about', (req, res, next) => res.render('about', {
  title: '*about*'
}));

// export router
module.exports = router;

