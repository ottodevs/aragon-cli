"use strict";

require("regenerator-runtime/runtime");

require("core-js/modules/es6.promise");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var execa = require('execa');

var _require = require('stream'),
    Writable = _require.Writable;

var devnull = require('dev-null');

var runTruffle = function runTruffle(args, _ref) {
  var stdout = _ref.stdout,
      stderr = _ref.stderr,
      stdin = _ref.stdin;
  return new Promise(function (resolve, reject) {
    var truffle = execa('truffle', args);
    var errMsg = '';
    truffle.on('exit', function (code) {
      code === 0 ? resolve() : reject(errMsg);
    }); // errMsg is only used if the process fails

    truffle.stdout.on('data', function (err) {
      errMsg += err;
    });
    truffle.stdout.pipe(stdout || process.stdout);
    truffle.stderr.pipe(stderr || process.stderr);
    process.stdin.pipe(stdin || truffle.stdin);
  });
};

var compileContracts =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var truffle;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return runTruffle(['compile'], {
              stdout: devnull()
            });

          case 3:
            truffle = _context.sent;
            _context.next = 10;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0);
            process.exit(1);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 6]]);
  }));

  return function compileContracts() {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = {
  runTruffle: runTruffle,
  compileContracts: compileContracts
};