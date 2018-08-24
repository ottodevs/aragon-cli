"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.string.bold");

require("regenerator-runtime/runtime");

var _aragonjsWrapper = _interopRequireDefault(require("./utils/aragonjs-wrapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var _require2 = require('../../util'),
    getContract = _require2.getContract;

var ANY_ENTITY = '0xffffffffffffffffffffffffffffffffffffffff';
exports.command = 'upgrade <dao> <apmRepo> [apmRepoVersion]';
exports.describe = 'Upgrade an app into a DAO';

exports.builder = function (yargs) {
  return getRepoTask.args(daoArg(yargs));
};

exports.task =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(_ref) {
    var web3, reporter, dao, network, apmOptions, apmRepo, apmRepoVersion, repo, apm, tasks;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            web3 = _ref.web3, reporter = _ref.reporter, dao = _ref.dao, network = _ref.network, apmOptions = _ref.apmOptions, apmRepo = _ref.apmRepo, apmRepoVersion = _ref.apmRepoVersion, repo = _ref.repo;
            apmOptions.ensRegistryAddress = apmOptions['ens-registry'];
            _context2.next = 4;
            return APM(web3, apmOptions);

          case 4:
            apm = _context2.sent;
            apmRepo = defaultAPMName(apmRepo); // TODO: Resolve DAO ens name

            tasks = new TaskList([{
              title: "Fetching ".concat(chalk.bold(apmRepo), "@").concat(apmRepoVersion),
              skip: function skip(ctx) {
                return ctx.repo;
              },
              // only run if repo isn't passed
              task: getRepoTask.task({
                apm: apm,
                apmRepo: apmRepo,
                apmRepoVersion: apmRepoVersion
              })
            }, {
              title: 'Upgrading app',
              task: function () {
                var _task = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee(ctx) {
                  var kernel, basesNamespace, setApp;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          kernel = new web3.eth.Contract(getContract('@aragon/os', 'Kernel').abi, dao);

                          if (ctx.accounts) {
                            _context.next = 5;
                            break;
                          }

                          _context.next = 4;
                          return web3.eth.getAccounts();

                        case 4:
                          ctx.accounts = _context.sent;

                        case 5:
                          _context.next = 7;
                          return kernel.methods.APP_BASES_NAMESPACE().call();

                        case 7:
                          basesNamespace = _context.sent;
                          setApp = kernel.methods.setApp(basesNamespace, ctx.repo.appId, ctx.repo.contractAddress);
                          return _context.abrupt("return", setApp.send({
                            from: ctx.accounts[0],
                            gasLimit: 1e6
                          }));

                        case 10:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function task(_x2) {
                  return _task.apply(this, arguments);
                };
              }()
            }], {
              repo: repo
            });
            return _context2.abrupt("return", tasks);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.handler =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref3) {
    var reporter, dao, network, apmOptions, apmRepo, apmRepoVersion, web3, task;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            reporter = _ref3.reporter, dao = _ref3.dao, network = _ref3.network, apmOptions = _ref3.apm, apmRepo = _ref3.apmRepo, apmRepoVersion = _ref3.apmRepoVersion;
            _context3.next = 3;
            return ensureWeb3(network);

          case 3:
            web3 = _context3.sent;
            apmOptions.ensRegistryAddress = apmOptions['ens-registry'];
            _context3.next = 7;
            return exports.task({
              web3: web3,
              reporter: reporter,
              dao: dao,
              network: network,
              apmOptions: apmOptions,
              apmRepo: apmRepo,
              apmRepoVersion: apmRepoVersion
            });

          case 7:
            task = _context3.sent;
            return _context3.abrupt("return", task.run().then(function (ctx) {
              reporter.success("Upgraded ".concat(apmRepo, " to ").concat(chalk.bold(ctx.repo.version)));
              process.exit();
            }));

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x3) {
    return _ref4.apply(this, arguments);
  };
}();