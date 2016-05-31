'use strict';

// return true if obj contains k else false
export function contains(obj, k) {
  return typeof obj[k] !== 'undefined';
}

// return true if s is alphanumeric else false
export function isalnum(s) {
  return /^[A-Z0-9]+$/.test(s.toUpperCase());
}

// return true if obj is empty else false
export function isEmpty(obj) {
  for (const k in obj)
    if (contains(obj, k))
      return false;
  return true;
}
// return a new Error object with status code
export function newErr(code, message) {
  const err = new Error(message);
  err.status = code;
  return err;
}
