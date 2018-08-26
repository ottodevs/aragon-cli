"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.array.index-of");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var _require = require('../helpers/truffle-runner'),
    runTruffle = _require.runTruffle;

exports.command = 'contracts';
exports.describe = 'Execute any Truffle command with arguments';

exports.handler =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var reporter, cwd, truffleArgs;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reporter = _ref.reporter, cwd = _ref.cwd;
            truffleArgs = process.argv.slice(process.argv.indexOf('contracts') + 1, process.argv.length);
            reporter.info('Passing the command to Truffle');
            _context.prev = 3;
            _context.next = 6;
            return runTruffle(truffleArgs, {});

          case 6:
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](3);
            console.error(_context.t0);

          case 11:
            process.exit(0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[3, 8]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();