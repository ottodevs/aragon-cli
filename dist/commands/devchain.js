"use strict";

require("core-js/modules/es6.string.bold");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var TaskList = require('listr');

var ncp = require('ncp');

var ganache = require('ganache-core');

var Web3 = require('web3');

var _require = require('util'),
    promisify = _require.promisify;

var homedir = require('homedir')();

var path = require('path');

var rimraf = require('rimraf');

var mkdirp = require('mkdirp');

var chalk = require('chalk');

var fs = require('fs');

var _require2 = require('../helpers/ganache-vars'),
    BLOCK_GAS_LIMIT = _require2.BLOCK_GAS_LIMIT,
    MNEMONIC = _require2.MNEMONIC;

exports.command = 'devchain';
exports.describe = 'Open a test chain for development and pass arguments to ganache';
exports.builder = {
  port: {
    description: 'The port to run the local chain on',
    default: 8545
  },
  reset: {
    type: 'boolean',
    default: false,
    description: 'Reset devchain to snapshot'
  },
  accounts: {
    default: 2,
    description: 'Number of accounts to print'
  }
};

exports.task =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref) {
    var _ref$port, port, _ref$reset, reset, _ref$showAccounts, showAccounts, removeDir, mkDir, recursiveCopy, snapshotPath, tasks;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _ref$port = _ref.port, port = _ref$port === void 0 ? 8545 : _ref$port, _ref$reset = _ref.reset, reset = _ref$reset === void 0 ? false : _ref$reset, _ref$showAccounts = _ref.showAccounts, showAccounts = _ref$showAccounts === void 0 ? 2 : _ref$showAccounts;
            removeDir = promisify(rimraf);
            mkDir = promisify(mkdirp);
            recursiveCopy = promisify(ncp);
            snapshotPath = path.join(homedir, ".aragon/ganache-db-".concat(port));
            tasks = new TaskList([{
              title: 'Setting up a new chain from latest Aragon snapshot',
              task: function () {
                var _task2 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee(ctx, _task) {
                  var aragen;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return removeDir(snapshotPath);

                        case 2:
                          _context.next = 4;
                          return mkDir(path.resolve(snapshotPath, '..'));

                        case 4:
                          aragen = path.resolve(require.resolve('@aragon/aragen'), '../aragon-ganache');
                          _context.next = 7;
                          return recursiveCopy(aragen, snapshotPath);

                        case 7:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function task(_x2, _x3) {
                  return _task2.apply(this, arguments);
                };
              }(),
              enabled: function enabled() {
                return !fs.existsSync(snapshotPath) || reset;
              }
            }, {
              title: 'Starting a local chain from snapshot',
              task: function () {
                var _task4 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2(ctx, _task3) {
                  var server, listen, accounts, ganacheAccounts;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          server = ganache.server({
                            // Start on a different networkID every time to avoid Metamask nonce caching issue:
                            // https://github.com/aragon/aragon-cli/issues/156
                            network_id: parseInt(1e8 * Math.random()),
                            gasLimit: BLOCK_GAS_LIMIT,
                            mnemonic: MNEMONIC,
                            db_path: snapshotPath
                          });

                          listen = function listen() {
                            return new Promise(function (resolve, reject) {
                              server.listen(port, function (err) {
                                if (err) return reject(err);
                                _task3.title = "Local chain started at port ".concat(port);
                                resolve();
                              });
                            });
                          };

                          _context2.next = 4;
                          return listen();

                        case 4:
                          ctx.web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:".concat(port)));
                          _context2.next = 7;
                          return ctx.web3.eth.getAccounts();

                        case 7:
                          accounts = _context2.sent;
                          ctx.accounts = accounts.slice(0, parseInt(showAccounts));
                          ctx.mnemonic = MNEMONIC;
                          ganacheAccounts = server.provider.manager.state.accounts;
                          ctx.privateKeys = ctx.accounts.map(function (address) {
                            return {
                              key: ganacheAccounts[address.toLowerCase()].secretKey.toString('hex'),
                              address: address
                            };
                          });

                        case 12:
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

          case 7:
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

exports.printAccounts = function (reporter, privateKeys) {
  var firstAccountComment = '(this account is used to deploy DAOs, it has more permissions)';
  var formattedAccounts = privateKeys.map(function (_ref3, i) {
    var address = _ref3.address,
        key = _ref3.key;
    return chalk.bold("Address #".concat(i + 1, ":  ").concat(address, " ").concat(i == 0 ? firstAccountComment : '', "\nPrivate key: ")) + key;
  });
  reporter.info("Here are some Ethereum accounts you can use.\n  The first one will be used for all the actions the CLI performs.\n  You can use your favorite Ethereum provider or wallet to import their private keys.\n  \n".concat(formattedAccounts.join('\n')));
};

exports.printMnemonic = function (reporter, mnemonic) {
  reporter.info("The accounts were generated from the following mnemonic phrase:\n".concat(mnemonic, "\n"));
};

exports.printResetNotice = function (reporter, reset) {
  if (reset) {
    reporter.warning("The devchain was reset, some steps need to be done to prevent issues:\n    - Reset the application cache in Aragon Core by going to Settings > Troubleshooting.\n    - If using Metamask: switch to a different network, and then switch back to the 'Private Network' (this will clear the nonce cache and prevent errors when sending transactions)  \n  ");
  }
};

exports.handler =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(_ref4) {
    var reporter, port, reset, accounts, task, _ref6, privateKeys, mnemonic;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            reporter = _ref4.reporter, port = _ref4.port, reset = _ref4.reset, accounts = _ref4.accounts;
            _context4.next = 3;
            return exports.task({
              port: port,
              reset: reset,
              showAccounts: accounts
            });

          case 3:
            task = _context4.sent;
            _context4.next = 6;
            return task.run();

          case 6:
            _ref6 = _context4.sent;
            privateKeys = _ref6.privateKeys;
            mnemonic = _ref6.mnemonic;
            exports.printAccounts(reporter, privateKeys);
            exports.printMnemonic(reporter, mnemonic);
            exports.printResetNotice(reporter, reset);
            reporter.info("Devchain running: ".concat(chalk.bold('http://localhost:' + port), "."));

          case 13:
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