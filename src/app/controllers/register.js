'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from '../helpers/logger';
import {
  contains,
  isalnum
} from '../helpers/functions';

// load models
const User = mongoose.model('User');

// create router
const router = express.Router();
// register page
router.get('/', (req, res, next) => res.render('register', {
  title: '*register*'
}));
router.post('/', (req, res, next) => {
  // check if req.body.user exists
  if (!contains(req.body, 'user')) return next(new Error('No data'));
  // make user upper case
  const user = req.body.user.toUpperCase();
  // create payload object for rendering
  const payload = {
    title: '*register*',
    user
  };
  payload.message = (payload.success = isalnum(user))
    ? 'Now get out there, and start sending your locations to \'MAPPER\'!'
    : 'Something went wrong. Ensure that you\'re entering your Yo username correctly. Remember, it can only be alphanumeric!';
  // insert user to db
  if (payload.success) {
    const doc = new User({
      user
    });
    doc.save(err => {
      if (err) {
        payload.success = false;
        if (err.code === 11000) payload.message = `'${user}' is already registered.`;
        else logger.error(err);
      }
      return res.render('register_post', payload);
    });
  } else return res.render('register_post', payload);
});

// export router
export default router;
