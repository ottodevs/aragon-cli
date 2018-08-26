"use strict";

require("core-js/modules/es6.regexp.split");

var DEFAULT_APM_REGISTRY = 'aragonpm.eth'; // insert default apm if the provided name doesnt have the suffix

module.exports = function (name) {
  return name.split('.').length > 1 ? name : "".concat(name, ".").concat(DEFAULT_APM_REGISTRY);
};