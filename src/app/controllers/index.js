'use strict';

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
// main page
router.get('/', (req, res, next) => res.render('index', {
  title: 'mapper',
  users: [
    'KLIU78',
    'HAPPYFLOPP',
    '123456789012345',
    '12345678901234567890'
  ]
}));
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

