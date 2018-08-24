"use strict";

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.array.reduce");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.array.map");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sha3 = require('js-sha3');

var keccak256 = function keccak256(x) {
  return '0x' + sha3.keccak_256(x);
};

var path = require('path');

var _require = require('../../../../util'),
    findProjectRoot = _require.findProjectRoot;

var getAppNPMPackage = function getAppNPMPackage(appName) {
  return "@aragon/apps-".concat(appName);
};

var knownApps = ['voting', 'token-manager', 'vault', 'finance'];

var getAppRoles = function getAppRoles(app) {
  var arapp = require("".concat(getAppNPMPackage(app), "/arapp"));

  return arapp.roles.map(function (_ref) {
    var name = _ref.name,
        id = _ref.id;
    return {
      name: name,
      id: id
    };
  });
};

var flatten = function flatten(list) {
  return list.reduce(function (a, b) {
    return a.concat(Array.isArray(b) ? flatten(b) : b);
  }, []);
};

var aOSRoles = [{
  id: 'CREATE_PERMISSIONS_ROLE',
  name: 'Create new permissions'
}, {
  id: 'APP_MANAGER_ROLE',
  name: 'Manage DAO apps'
}];

var currentAppRoles = function currentAppRoles() {
  var arappPath = path.resolve(findProjectRoot(), 'arapp.json');
  return require(arappPath).roles;
}; // TODO: add support for user apps


var rolesForApps = function rolesForApps() {
  var allRoles = flatten(knownApps.map(function (app) {
    return getAppRoles(app);
  })).concat(aOSRoles).concat(currentAppRoles());
  var knownRoles = allRoles.reduce(function (acc, role) {
    return Object.assign(acc, _defineProperty({}, keccak256(role.id), role));
  }, {});
  return knownRoles;
};

module.exports = {
  rolesForApps: rolesForApps
};