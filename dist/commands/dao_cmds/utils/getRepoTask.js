"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.regexp.split");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var LATEST_VERSION = 'latest';
module.exports = {
  args: function args(yargs) {
    return yargs.option('apmRepo', {
      describe: 'Name of the APM repo'
    }).option('apmRepoVersion', {
      describe: 'Version of the package upgrading to',
      default: 'latest'
    });
  },
  task: function task(_ref) {
    var apm = _ref.apm,
        apmRepo = _ref.apmRepo,
        _ref$apmRepoVersion = _ref.apmRepoVersion,
        apmRepoVersion = _ref$apmRepoVersion === void 0 ? LATEST_VERSION : _ref$apmRepoVersion,
        _ref$artifactRequired = _ref.artifactRequired,
        artifactRequired = _ref$artifactRequired === void 0 ? true : _ref$artifactRequired;
    return (
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee(ctx) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(apmRepoVersion == LATEST_VERSION)) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 3;
                  return apm.getLatestVersion(apmRepo);

                case 3:
                  ctx.repo = _context.sent;
                  _context.next = 9;
                  break;

                case 6:
                  _context.next = 8;
                  return apm.getVersion(apmRepo, apmRepoVersion.split('.'));

                case 8:
                  ctx.repo = _context.sent;

                case 9:
                  if (!(artifactRequired && !ctx.repo.appId)) {
                    _context.next = 11;
                    break;
                  }

                  throw new Error("Cannot find artifacts in APM repo. Please make sure the package is published and IPFS running.");

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
      }()
    );
  }
};