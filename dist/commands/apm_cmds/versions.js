"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.array.map");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var _require = require('../../helpers/web3-fallback'),
    ensureWeb3 = _require.ensureWeb3;

var findUp = require('find-up');

var APM = require('@aragon/apm');

exports.command = 'versions';
exports.describe = 'List all versions of the package';

exports.handler =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var reporter, module, bump, cwd, network, apmOptions, web3, versions;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reporter = _ref.reporter, module = _ref.module, bump = _ref.bump, cwd = _ref.cwd, network = _ref.network, apmOptions = _ref.apm;
            _context.next = 3;
            return ensureWeb3(network);

          case 3:
            web3 = _context.sent;
            apmOptions.ensRegistryAddress = apmOptions['ens-registry'];
            _context.next = 7;
            return APM(web3, apmOptions).getAllVersions(module.appName);

          case 7:
            versions = _context.sent;
            reporter.info("".concat(module.appName, " has ").concat(versions.length, " published versions"));
            versions.map(function (version) {
              if (version && version.content) {
                reporter.success("".concat(version.version, ": ").concat(version.contractAddress, " ").concat(version.content.provider, ":").concat(version.content.location));
              } else {
                reporter.error('Version not found in provider');
              }
            });
            process.exit();

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();