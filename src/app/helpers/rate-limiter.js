'use strict';

import mongoose from 'mongoose';
import * as bucket from '../models/bucket';
import { newErr } from './functions';
import logger from './logger';

// load bucket model
const Bucket = mongoose.model('Bucket');

// rate limiting middleware
const limiter = (req, res, next) => {
  // get client's ip address
  const ip = req.ip ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  // increment bucket corresponding to this ip or create a new one
  Bucket.findOneAndUpdate({
    ip
  }, {
    $inc: {
      hits: 1
    }
  }, {
    upsert: false
  }, (err, doc) => {
    if (err) return next(err);
    // create and save a new bucket if doc doesn't exist
    if (!doc) {
      doc = new Bucket({
        ip
      });
      doc.save((err, doc) => {
        if (err) return next(err);
        // return a new error if the doc still isn't saved
        if (!doc) return next(newErr(500, 'failed to create new Bucket'));
        logger.info(`successfully created new bucket for ${ip}`);
        return next();
      });
    } else if (doc.hits >= bucket.MAX_HITS) {
      return next(newErr(429, 'too many requests'));
    } else {
      logger.info(`updated existing bucket for ${ip}`);
      return next();
    }
  });
};

export default limiter;
