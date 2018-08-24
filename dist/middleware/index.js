"use strict";

var manifestMiddleware = require('./manifest');

var moduleMiddleware = require('./module');

module.exports = {
  manifestMiddleware: manifestMiddleware,
  moduleMiddleware: moduleMiddleware
};