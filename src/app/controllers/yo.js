'use strict';

import async from 'async';
import express from 'express';
import mongoose from 'mongoose';
import logger from '../helpers/logger';

// load models
// const Location = mongoose.model('Location');

// create router
const router = express.Router();
// yo api hook
router.get('/', (req, res, next) => {});

// export router
module.exports = router;

