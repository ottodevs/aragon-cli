"use strict";

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.array.reduce");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var namehash = require('eth-ens-namehash').hash;

var sha3 = require('js-sha3');

var _require = require('../../../util'),
    findProjectRoot = _require.findProjectRoot;

var path = require('path');

var keccak256 = function keccak256(x) {
  return '0x' + sha3.keccak_256(x);
};

var knownAppNames = ['voting', 'token-manager', 'finance', 'vault', 'kernel', 'acl', 'evmreg', 'apm-registry', 'apm-repo', 'apm-enssub'];
var knownAPMRegistries = ['aragonpm.eth', 'open.aragonpm.eth'];

var currentAppName = function currentAppName() {
  var arappPath = path.resolve(findProjectRoot(), 'arapp.json');
  return require(arappPath).appName;
};

var listApps = function listApps() {
  var userApps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [currentAppName()];
  var appNames = knownAppNames.reduce(function (acc, appName) {
    return acc.concat(knownAPMRegistries.map(function (apm) {
      return appName + '.' + apm;
    }));
  }, []).concat(userApps);
  var appIds = appNames.reduce(function (acc, app) {
    return Object.assign(acc, _defineProperty({}, namehash(app), app));
  }, {}); // because of a current issue in the deployed apps, we need to calculate with just the keccak too (otherwise acl and evmreg dont show up)

  return appNames.reduce(function (acc, app) {
    return Object.assign(acc, _defineProperty({}, keccak256(app), app));
  }, appIds);
};

module.exports = {
  listApps: listApps
};