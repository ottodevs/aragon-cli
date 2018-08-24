"use strict";

var path = require('path');

var fs = require('fs-extra');

var _require = require('../util'),
    findProjectRoot = _require.findProjectRoot;

module.exports = function moduleMiddleware(argv) {
  var runsInCwd = argv['_'] === 'init';

  if (!runsInCwd) {
    try {
      var modulePath = path.resolve(findProjectRoot(), 'arapp.json');
      var arapp = fs.readJsonSync(modulePath);
      return {
        module: arapp
      };
    } catch (err) {// argv.reporter.debug(err)
    }
  }

  return {};
};