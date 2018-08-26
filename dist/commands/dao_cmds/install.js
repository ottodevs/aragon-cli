"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.string.bold");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.promise");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("regenerator-runtime/runtime");

var _aragonjsWrapper = _interopRequireDefault(require("./utils/aragonjs-wrapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var getRepoTask = require('./utils/getRepoTask');

var upgrade = require('./upgrade');

var _require2 = require('../../util'),
    getContract = _require2.getContract,
    ANY_ENTITY = _require2.ANY_ENTITY;

var setPermissions =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(web3, sender, aclAddress, permissions) {
    var acl;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            acl = new web3.eth.Contract(getContract('@aragon/os', 'ACL').abi, aclAddress);
            return _context.abrupt("return", Promise.all(permissions.map(function (_ref2) {
              var _ref3 = _slicedToArray(_ref2, 3),
                  who = _ref3[0],
                  where = _ref3[1],
                  what = _ref3[2];

              return acl.methods.createPermission(who, where, what, who).send({
                from: sender,
                gasLimit: 1e6
              });
            })));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function setPermissions(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.command = 'install <dao> <apmRepo> [apmRepoVersion]';
exports.describe = 'Install an app into a DAO';

exports.builder = function (yargs) {
  return getRepoTask.args(daoArg(yargs));
};

exports.task =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(_ref4) {
    var web3, reporter, dao, network, apmOptions, apmRepo, apmRepoVersion, apm, tasks;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            web3 = _ref4.web3, reporter = _ref4.reporter, dao = _ref4.dao, network = _ref4.network, apmOptions = _ref4.apmOptions, apmRepo = _ref4.apmRepo, apmRepoVersion = _ref4.apmRepoVersion;
            apmOptions.ensRegistryAddress = apmOptions['ens-registry'];
            _context4.next = 4;
            return APM(web3, apmOptions);

          case 4:
            apm = _context4.sent;
            apmRepo = defaultAPMName(apmRepo); // TODO: Resolve DAO ens name

            tasks = new TaskList([{
              title: "Fetching ".concat(chalk.bold(apmRepo), "@").concat(apmRepoVersion),
              task: getRepoTask.task({
                apm: apm,
                apmRepo: apmRepo,
                apmRepoVersion: apmRepoVersion
              })
            }, {
              title: "Upgrading app",
              task: function task(ctx) {
                return upgrade.task({
                  repo: ctx.repo,
                  web3: web3,
                  dao: dao,
                  apmRepo: apmRepo,
                  apmRepoVersion: apmRepoVersion,
                  apmOptions: apmOptions,
                  reporter: reporter
                });
              }
            }, {
              title: 'Deploying app instance',
              task: function () {
                var _task = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2(ctx) {
                  var kernel, _ref6, events;

                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          kernel = new web3.eth.Contract(getContract('@aragon/os', 'Kernel').abi, dao);
                          _context2.next = 3;
                          return kernel.methods.acl().call();

                        case 3:
                          ctx.aclAddress = _context2.sent;

                          if (ctx.accounts) {
                            _context2.next = 8;
                            break;
                          }

                          _context2.next = 7;
                          return web3.eth.getAccounts();

                        case 7:
                          ctx.accounts = _context2.sent;

                        case 8:
                          _context2.next = 10;
                          return kernel.methods.newAppInstance(ctx.repo.appId, ctx.repo.contractAddress).send({
                            from: ctx.accounts[0],
                            gasLimit: 1e6
                          });

                        case 10:
                          _ref6 = _context2.sent;
                          events = _ref6.events;
                          ctx.appAddress = events['NewAppProxy'].returnValues.proxy;

                        case 13:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this);
                }));

                return function task(_x6) {
                  return _task.apply(this, arguments);
                };
              }()
            }, {
              title: 'Set permissions',
              task: function () {
                var _task3 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee3(ctx, _task2) {
                  var permissions;
                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          if (!(!ctx.repo.roles || ctx.repo.roles.length === 0)) {
                            _context3.next = 3;
                            break;
                          }

                          throw new Error('You have no permissions defined in your arapp.json\nThis is required for your app to properly show up.');

                        case 3:
                          permissions = ctx.repo.roles.map(function (role) {
                            return [ANY_ENTITY, ctx.appAddress, role.bytes];
                          });
                          return _context3.abrupt("return", setPermissions(web3, ctx.accounts[0], ctx.aclAddress, permissions));

                        case 5:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3, this);
                }));

                return function task(_x7, _x8) {
                  return _task3.apply(this, arguments);
                };
              }()
            }]);
            return _context4.abrupt("return", tasks);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
}();

exports.handler =
/*#__PURE__*/
function () {
  var _ref8 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(_ref7) {
    var reporter, dao, network, apmOptions, apmRepo, apmRepoVersion, web3, task;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            reporter = _ref7.reporter, dao = _ref7.dao, network = _ref7.network, apmOptions = _ref7.apm, apmRepo = _ref7.apmRepo, apmRepoVersion = _ref7.apmRepoVersion;
            _context5.next = 3;
            return ensureWeb3(network);

          case 3:
            web3 = _context5.sent;
            _context5.next = 6;
            return exports.task({
              web3: web3,
              reporter: reporter,
              dao: dao,
              network: network,
              apmOptions: apmOptions,
              apmRepo: apmRepo,
              apmRepoVersion: apmRepoVersion
            });

          case 6:
            task = _context5.sent;
            return _context5.abrupt("return", task.run().then(function (ctx) {
              reporter.success("Installed ".concat(apmRepo, " at: ").concat(chalk.bold(ctx.appAddress)));
              process.exit();
            }));

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function (_x9) {
    return _ref8.apply(this, arguments);
  };
}();