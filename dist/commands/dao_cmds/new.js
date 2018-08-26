"use strict";

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.array.from");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.string.bold");

require("regenerator-runtime/runtime");

var _aragonjsWrapper = _interopRequireDefault(require("./utils/aragonjs-wrapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var TaskList = require('listr');

var Web3 = require('web3');

var daoArg = require('./utils/daoArg');

var _require = require('../../helpers/web3-fallback'),
    ensureWeb3 = _require.ensureWeb3;

var path = require('path');

var APM = require('@aragon/apm');

var defaultAPMName = require('../../helpers/default-apm');

var chalk = require('chalk');

var _require2 = require('../../util'),
    getContract = _require2.getContract;

var getRepoTask = require('./utils/getRepoTask');

exports.BARE_KIT = defaultAPMName('bare-kit');
exports.BARE_INSTANCE_FUNCTION = 'newBareInstance';
exports.BARE_KIT_DEPLOY_EVENT = 'DeployInstance';

var BARE_KIT_ABI = require('./utils/bare-kit-abi');

exports.command = 'new [kit] [kit-version]';
exports.describe = 'Create a new DAO';

exports.builder = function (yargs) {
  return yargs.positional('kit', {
    description: 'Name of the kit to use creating the DAO',
    default: exports.BARE_KIT
  }).positional('kit-version', {
    description: 'Version of the kit to be used',
    default: 'latest'
  }).option('fn-args', {
    description: 'Arguments to be passed to the newInstance function (or the function passed with --fn)',
    array: true,
    default: []
  }).option('fn', {
    description: 'Function to be called to create instance',
    default: exports.BARE_INSTANCE_FUNCTION
  }).option('deploy-event', {
    description: 'Event name that the kit will fire on success',
    default: exports.BARE_KIT_DEPLOY_EVENT
  });
};

exports.task =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref) {
    var web3, reporter, apmOptions, kit, kitVersion, fn, fnArgs, skipChecks, deployEvent, kitInstance, apm, tasks;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            web3 = _ref.web3, reporter = _ref.reporter, apmOptions = _ref.apmOptions, kit = _ref.kit, kitVersion = _ref.kitVersion, fn = _ref.fn, fnArgs = _ref.fnArgs, skipChecks = _ref.skipChecks, deployEvent = _ref.deployEvent, kitInstance = _ref.kitInstance;
            apmOptions.ensRegistryAddress = apmOptions['ens-registry'];
            _context3.next = 4;
            return APM(web3, apmOptions);

          case 4:
            apm = _context3.sent;
            kit = defaultAPMName(kit);
            tasks = new TaskList([{
              title: "Fetching kit ".concat(chalk.bold(kit), "@").concat(kitVersion),
              task: getRepoTask.task({
                apm: apm,
                apmRepo: kit,
                apmRepoVersion: kitVersion,
                artifactRequired: false
              }),
              enabled: function enabled() {
                return !kitInstance;
              }
            }, {
              title: 'Create new DAO from kit',
              task: function () {
                var _task2 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee(ctx, _task) {
                  var _kit$methods;

                  var abi, kit, newInstanceTx, _ref3, events;

                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          if (ctx.accounts) {
                            _context.next = 4;
                            break;
                          }

                          _context.next = 3;
                          return web3.eth.getAccounts();

                        case 3:
                          ctx.accounts = _context.sent;

                        case 4:
                          // TODO: Remove hack once https://github.com/aragon/aragen/pull/15 is finished and published
                          abi = ctx.repo.abi || BARE_KIT_ABI;
                          kit = kitInstance || new web3.eth.Contract(abi, ctx.repo.contractAddress);
                          newInstanceTx = (_kit$methods = kit.methods)[fn].apply(_kit$methods, _toConsumableArray(fnArgs));
                          _context.next = 9;
                          return newInstanceTx.send({
                            from: ctx.accounts[0],
                            gas: 15e6
                          });

                        case 9:
                          _ref3 = _context.sent;
                          events = _ref3.events;
                          ctx.daoAddress = events[deployEvent].returnValues.dao;

                        case 12:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function task(_x2, _x3) {
                  return _task2.apply(this, arguments);
                };
              }()
            }, {
              title: 'Checking DAO',
              skip: function skip() {
                return skipChecks;
              },
              task: function () {
                var _task4 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2(ctx, _task3) {
                  var kernel;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          kernel = new web3.eth.Contract(getContract('@aragon/os', 'Kernel').abi, ctx.daoAddress);
                          _context2.next = 3;
                          return kernel.methods.acl().call();

                        case 3:
                          ctx.aclAddress = _context2.sent;
                          _context2.next = 6;
                          return kernel.methods.APP_MANAGER_ROLE().call();

                        case 6:
                          ctx.appManagerRole = _context2.sent;

                        case 7:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this);
                }));

                return function task(_x4, _x5) {
                  return _task4.apply(this, arguments);
                };
              }()
            }]);
            return _context3.abrupt("return", tasks);

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.handler =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(_ref4) {
    var reporter, network, kit, kitVersion, fn, fnArgs, deployEvent, apmOptions, web3, task;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            reporter = _ref4.reporter, network = _ref4.network, kit = _ref4.kit, kitVersion = _ref4.kitVersion, fn = _ref4.fn, fnArgs = _ref4.fnArgs, deployEvent = _ref4.deployEvent, apmOptions = _ref4.apm;
            _context4.next = 3;
            return ensureWeb3(network);

          case 3:
            web3 = _context4.sent;
            _context4.next = 6;
            return exports.task({
              web3: web3,
              reporter: reporter,
              network: network,
              apmOptions: apmOptions,
              kit: kit,
              kitVersion: kitVersion,
              fn: fn,
              fnArgs: fnArgs,
              deployEvent: deployEvent,
              skipChecks: false
            });

          case 6:
            task = _context4.sent;
            return _context4.abrupt("return", task.run().then(function (ctx) {
              reporter.success("Created DAO: ".concat(chalk.bold(ctx.daoAddress)));
              process.exit();
            }));

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x6) {
    return _ref5.apply(this, arguments);
  };
}();