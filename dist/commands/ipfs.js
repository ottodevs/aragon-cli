"use strict";

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var opn = require('opn');

var path = require('path');

var TaskList = require('listr');

var _require = require('../helpers/ipfs-daemon'),
    isIPFSInstalled = _require.isIPFSInstalled,
    startIPFSDaemon = _require.startIPFSDaemon,
    isIPFSCORS = _require.isIPFSCORS,
    setIPFSCORS = _require.setIPFSCORS;

var _require2 = require('../util'),
    isPortTaken = _require2.isPortTaken;

var IPFS = require('ipfs-api');

exports.command = 'ipfs';
exports.describe = 'Start IPFS daemon configured to work with Aragon';

exports.task = function (_ref) {
  var apmOptions = _ref.apmOptions;
  return new TaskList([{
    title: 'Start IPFS',
    task: function () {
      var _task2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(ctx, _task) {
        var installed, running;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!apmOptions.ipfs.rpc.default) {
                  _context.next = 27;
                  break;
                }

                _context.next = 3;
                return isIPFSInstalled();

              case 3:
                installed = _context.sent;

                if (installed) {
                  _context.next = 9;
                  break;
                }

                setTimeout(function () {
                  return opn('https://ipfs.io/docs/install');
                }, 2500);
                throw new Error("\n\t\t          Running your app requires IPFS. Opening install instructions in your browser");

              case 9:
                _context.next = 11;
                return isPortTaken(apmOptions.ipfs.rpc.port);

              case 11:
                running = _context.sent;

                if (running) {
                  _context.next = 21;
                  break;
                }

                _task.output = 'Starting IPFS at port: ' + apmOptions.ipfs.rpc.port;
                _context.next = 16;
                return startIPFSDaemon();

              case 16:
                ctx.started = true;
                _context.next = 19;
                return setIPFSCORS(apmOptions.ipfs.rpc);

              case 19:
                _context.next = 25;
                break;

              case 21:
                _task.output = 'IPFS is started, checking CORS config';
                _context.next = 24;
                return setIPFSCORS(apmOptions.ipfs.rpc);

              case 24:
                return _context.abrupt("return", 'Connected to IPFS daemon ar port: ' + apmOptions.ipfs.rpc.port);

              case 25:
                _context.next = 30;
                break;

              case 27:
                _context.next = 29;
                return isIPFSCORS(apmOptions.ipfs.rpc);

              case 29:
                return _context.abrupt("return", 'Connecting to provided IPFS daemon');

              case 30:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function task(_x, _x2) {
        return _task2.apply(this, arguments);
      };
    }()
  }, {
    title: 'Add local files',
    task: function task(ctx) {
      var ipfs = IPFS('localhost', '5001', {
        protocol: 'http'
      });
      var files = path.resolve(require.resolve('@aragon/aragen'), '../published-apps');
      return new Promise(function (resolve, reject) {
        ipfs.util.addFromFs(files, {
          recursive: true,
          ignore: 'node_modules'
        }, function (err, files) {
          if (err) return reject(err);
          resolve(files);
        });
      });
    }
  }]);
};

exports.handler = function (_ref2) {
  var reporter = _ref2.reporter,
      apmOptions = _ref2.apm;
  var task = exports.task({
    apmOptions: apmOptions
  });
  task.run().then(function (ctx) {
    if (ctx.started) {
      reporter.info('IPFS daemon is now running. Stopping this process will stop IPFS');
    } else {
      reporter.warning('Didnt start IPFS, port busy');
      process.exit();
    }
  });
};