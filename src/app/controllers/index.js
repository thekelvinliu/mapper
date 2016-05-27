'use strict';

import express from 'express';
// import logger from '../helpers/logger';

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
router.post('/register', (req, res, next) => {
  // check if req.body.user exists
  if (!req.body.hasOwnProperty('user')) return new Error('No data');
  // make user upper case
  const user = req.body.user.toUpperCase();
  // create payload object for rendering
  const payload = {
    title: '*register*',
    user
  };
  payload.message = (payload.success = /^[a-zA-Z0-9]+$/.test(user))
    ? 'Now get out there, and start sending your locations to \'MAPPER\'!'
    : 'Something went wrong. Ensure that you\'re entering your Yo username correctly. Remember, it can only be alphanumeric!';
  // TODO: insert user to db
  return res.render('register_post', payload);
});

// export router
module.exports = router;
