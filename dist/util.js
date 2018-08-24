"use strict";

require("core-js/modules/es6.object.assign");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.promise");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var findUp = require('find-up');

var path = require('path');

var hasbin = require('hasbin');

var _require = require('util'),
    promisify = _require.promisify;

var execa = require('execa');

var net = require('net');

var cachedProjectRoot;
var PGK_MANAGER_BIN_NPM = 'npm';

var findProjectRoot = function findProjectRoot() {
  if (!cachedProjectRoot) {
    try {
      cachedProjectRoot = path.dirname(findUp.sync('arapp.json'));
    } catch (_) {
      throw new Error('This directory is not an Aragon project'); // process.exit(1)
    }
  }

  return cachedProjectRoot;
};

var hasBin = function hasBin(bin) {
  return new Promise(function (resolve, reject) {
    return hasbin(bin, resolve);
  });
};

var isPortTaken =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(port, opts) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            opts = Object.assign({
              timeout: 1000
            }, opts);
            return _context.abrupt("return", new Promise(function (resolve) {
              var socket = new net.Socket();

              var onError = function onError() {
                socket.destroy();
                resolve(false);
              };

              socket.setTimeout(opts.timeout);
              socket.on('error', onError);
              socket.on('timeout', onError);
              socket.connect(port, opts.host, function () {
                socket.end();
                resolve(true);
              });
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function isPortTaken(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var getNodePackageManager = function getNodePackageManager() {
  return PGK_MANAGER_BIN_NPM;
};

var installDeps = function installDeps(cwd, task) {
  var bin = getNodePackageManager();
  var installTask = execa(bin, ['install'], {
    cwd: cwd
  });
  installTask.stdout.on('data', function (log) {
    if (!log) return;
    task.output = log;
  });
  return installTask.catch(function (err) {
    throw new Error("".concat(err.message, "\n").concat(err.stderr, "\n\nFailed to install dependencies. See above output."));
  });
};

var getContract = function getContract(pkg, contract) {
  var artifact = require("".concat(pkg, "/build/contracts/").concat(contract, ".json"));

  return artifact;
};

var ANY_ENTITY = '0xffffffffffffffffffffffffffffffffffffffff';
module.exports = {
  findProjectRoot: findProjectRoot,
  hasBin: hasBin,
  isPortTaken: isPortTaken,
  installDeps: installDeps,
  getNodePackageManager: getNodePackageManager,
  getContract: getContract,
  ANY_ENTITY: ANY_ENTITY
};