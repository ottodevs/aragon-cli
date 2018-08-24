"use strict";

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var Web3 = require('web3');

var ensureWeb3 =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(network) {
    var web3, connected;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            web3 = new Web3(network.provider);
            _context.next = 4;
            return web3.eth.net.isListening();

          case 4:
            connected = _context.sent;

            if (!connected) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", web3);

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            throw new Error("Please execute aragon run or aragon devchain before running this");

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 9]]);
  }));

  return function ensureWeb3(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  ensureWeb3: ensureWeb3
};