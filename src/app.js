'use strict';

import path from 'path';
import bodyParser from 'body-parser';
import compress from 'compression';
import express from 'express';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import jade from 'jade';
import jadeBabel from 'jade-babel';
import mongoose from 'mongoose';
import logger from './app/helpers/logger';

// BASIC CONFIG
const config = {
  // address of mongodb
  db: process.env.MAPPER_MONGOURI || 'mongodb://localhost:27017/mapper',
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  // environment
  env: process.env.NODE_ENV || 'development',
  // port on which to listen
  port: 5001,
  // path to root directory of this app
  root: path.normalize(__dirname)
};

// EXPRESS SET-UP
// create app
const app = express();
// use jade and set views and static directories
jade.filters.babel = jadeBabel();
app.set('view engine', 'jade');
app.set('views', path.join(config.root, 'app/views'));
app.use(express.static(path.join(config.root, 'static')));
//add middlewares
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(compress());
app.use(favicon(path.join(config.root, 'static/img/pin.png')));
app.use(helmet());
// load all models
require(path.join(config.root, 'app/models'));
// load all controllers
app.use('/', require(path.join(config.root, 'app/controllers')));
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  return next(err);
});
// general errors
app.use((err, req, res, next) => {
  const sc = err.status || 500;
  res.status(sc);
  return res.render('error', {
    title: '*error*',
    status: sc,
    message: err.message,
    stack: config.env === 'development' ? err.stack : ''
  });
});

// MONGOOSE SET-UP
// warn if MONGOURI is being used and pass is undefined
if (config.db === process.env.MONGOURI && !config.pass)
  logger.warn(`bad credientials for ${config.db} -- check env.`);
mongoose.connect(config.db, {
  user: config.user,
  pass: config.pass
});
const db = mongoose.connection;
db.on('error', () => {
  throw new Error(`unable to connect to database at ${config.db}`);
});

// START AND STOP
const server = app.listen(config.port, () => {
  logger.info(`listening on port ${config.port}`);
});
process.on('SIGINT', () => {
  logger.info('shutting down!');
  db.close();
  server.close();
  process.exit();
});
