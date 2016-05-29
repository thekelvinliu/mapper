'use strict';

import mongoose from 'mongoose';

// load models
const User = mongoose.model('User');

// returns true if k is in obj
export const contains = (obj, k) => typeof obj[k] !== 'undefined';

// check if object is empty
export const isEmpty = obj => {
  for (const k in obj)
    if (contains(obj, k))
      return false;
  return true;
};

// load all users
export const loadUsers = cb => User.find({}, (err, docs) => (err) ? cb(err) : cb(null, docs.map(d => d.user)));

// return a new Error object with status code
export const newErr = (code, message) => {
  const err = new Error(message);
  err.status = code;
  return err;
};
