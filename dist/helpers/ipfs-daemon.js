"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var _require = require('../util'),
    hasBin = _require.hasBin,
    isPortTaken = _require.isPortTaken;

var execa = require('execa');

var fs = require('fs');

var path = require('path');

var homedir = require('homedir')();

var ipfsAPI = require('ipfs-api');

var isIPFSInstalled =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return hasBin('ipfs');

          case 2:
            return _context.abrupt("return", _context.sent);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function isIPFSInstalled() {
    return _ref.apply(this, arguments);
  };
}();

var ensureIPFSInitialized =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var ipfsInit;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!fs.existsSync(path.join(homedir, '.ipfs'))) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", true);

          case 2:
            _context2.next = 4;
            return execa('ipfs', ['init']);

          case 4:
            ipfsInit = _context2.sent;
            return _context2.abrupt("return", true);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function ensureIPFSInitialized() {
    return _ref2.apply(this, arguments);
  };
}();

var startIPFSDaemon = function startIPFSDaemon() {
  return new Promise(
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee3(resolve) {
      var ipfsProc;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return ensureIPFSInitialized();

            case 2:
              ipfsProc = execa('ipfs', ['daemon']);
              ipfsProc.stdout.on('data', function (data) {
                if (data.toString().includes('Daemon is ready')) resolve();
              });

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }());
};

var ipfsNode;
var IPFSCORS = [{
  key: 'API.HTTPHeaders.Access-Control-Allow-Origin',
  value: ["*"]
}, {
  key: 'API.HTTPHeaders.Access-Control-Allow-Methods',
  value: ["PUT", "GET", "POST"]
}];

var isIPFSCORS =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(ipfsRpc) {
    var conf, allowOrigin, allowMethods;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (!ipfsNode) ipfsNode = ipfsAPI(ipfsRpc);
            _context4.next = 3;
            return ipfsNode.config.get('API.HTTPHeaders');

          case 3:
            conf = _context4.sent;
            allowOrigin = IPFSCORS[0].key.split('.').pop();
            allowMethods = IPFSCORS[1].key.split('.').pop();

            if (!(conf && conf[allowOrigin] && conf[allowMethods])) {
              _context4.next = 10;
              break;
            }

            return _context4.abrupt("return", true);

          case 10:
            throw new Error("Please set the following flags in your IPFS node:\n    ".concat(IPFSCORS.map(function (_ref5) {
              var key = _ref5.key,
                  value = _ref5.value;
              return "".concat(key, ": ").concat(value);
            }).join('\n    ')));

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function isIPFSCORS(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var setIPFSCORS = function setIPFSCORS(ipfsRpc) {
  if (!ipfsNode) ipfsNode = ipfsAPI(ipfsRpc);
  return Promise.all(IPFSCORS.map(function (_ref6) {
    var key = _ref6.key,
        value = _ref6.value;
    return ipfsNode.config.set(key, value);
  }));
};

module.exports = {
  isIPFSInstalled: isIPFSInstalled,
  startIPFSDaemon: startIPFSDaemon,
  isIPFSCORS: isIPFSCORS,
  setIPFSCORS: setIPFSCORS
};