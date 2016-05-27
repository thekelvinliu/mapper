'use strict';

import express from 'express';

// create router
const router = express.Router();
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
// register page
router.get('/register', (req, res, next) => res.render('register', {
  title: '*register*'
}));
router.get('/r1', (req, res, next) => res.render('register', {
  title: '*register*'
}));
router.get('/r2', (req, res, next) => res.render('register', {
  title: '*register*',
  success: true
}));

// export router
module.exports = router;
