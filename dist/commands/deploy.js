"use strict";

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.string.bold");

require("core-js/modules/es6.array.map");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.regexp.split");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var path = require('path');

var TaskList = require('listr');

var chalk = require('chalk');

var _require = require('../helpers/truffle-runner'),
    compileContracts = _require.compileContracts;

var _require2 = require('../util'),
    findProjectRoot = _require2.findProjectRoot;

var _require3 = require('../helpers/web3-fallback'),
    ensureWeb3 = _require3.ensureWeb3;

exports.command = 'deploy [contract]';
exports.describe = 'Deploys contract code of the app to the chain';

exports.arappContract = function () {
  var contractPath = require(path.resolve(findProjectRoot(), 'arapp.json')).path;

  var contractName = path.basename(contractPath).split('.')[0];
  return contractName;
};

exports.builder = function (yargs) {
  return yargs.positional('contract', {
    description: 'Contract name (defaults to the contract at the path in arapp.json)'
  }).option('init', {
    description: 'Arguments to be passed to contract constructor',
    array: true,
    default: []
  });
};

exports.task =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(_ref) {
    var reporter, network, cwd, contract, init, web3, apmOptions, mappingMask, mappings, processedInit, contractName, tasks;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            reporter = _ref.reporter, network = _ref.network, cwd = _ref.cwd, contract = _ref.contract, init = _ref.init, web3 = _ref.web3, apmOptions = _ref.apmOptions;

            if (!contract) {
              contract = exports.arappContract();
            }

            apmOptions.ensRegistryAddress = apmOptions['ens-registry'];

            if (web3) {
              _context3.next = 7;
              break;
            }

            _context3.next = 6;
            return ensureWeb3(network);

          case 6:
            web3 = _context3.sent;

          case 7:
            init = init || []; // Mappings allow to pass certain init parameters that get replaced for their actual value

            mappingMask = function mappingMask(key) {
              return "@ARAGON_".concat(key);
            };

            mappings = _defineProperty({}, mappingMask('ENS'), function () {
              return apmOptions.ensRegistryAddress;
            });
            processedInit = init.map(function (value) {
              return mappings[value] ? mappings[value]() : value;
            });
            contractName = contract;
            tasks = new TaskList([{
              title: 'Compile contracts',
              task: function () {
                var _task = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee() {
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return compileContracts();

                        case 2:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function task() {
                  return _task.apply(this, arguments);
                };
              }()
            }, {
              title: "Deploy '".concat(contractName, "' to network"),
              task: function () {
                var _task3 = _asyncToGenerator(
                /*#__PURE__*/
                regeneratorRuntime.mark(function _callee2(ctx, _task2) {
                  var contractArtifacts, _contractArtifacts, abi, bytecode, contract, accounts, deployTx, gas, instance;

                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          ctx.contractName = contractName;
                          _context2.prev = 1;
                          contractArtifacts = require(path.join(cwd, 'build/contracts', contractName));
                          _context2.next = 8;
                          break;

                        case 5:
                          _context2.prev = 5;
                          _context2.t0 = _context2["catch"](1);
                          throw new Error('Contract artifact couldnt be found. Please ensure your contract name is the same as the filename.');

                        case 8:
                          _contractArtifacts = contractArtifacts, abi = _contractArtifacts.abi, bytecode = _contractArtifacts.bytecode;

                          if (!(!bytecode || bytecode == '0x')) {
                            _context2.next = 11;
                            break;
                          }

                          throw new Error('Contract bytecode couldnt be generated. Contracts that dont implement all interface methods cant be deployed');

                        case 11:
                          _task2.output = "Deploying '".concat(contractName, "' to network");
                          contract = new web3.eth.Contract(abi, {
                            data: bytecode
                          });
                          _context2.next = 15;
                          return web3.eth.getAccounts();

                        case 15:
                          accounts = _context2.sent;
                          deployTx = contract.deploy({
                            arguments: processedInit
                          });
                          _context2.next = 19;
                          return deployTx.estimateGas();

                        case 19:
                          gas = _context2.sent;
                          _context2.next = 22;
                          return deployTx.send({
                            from: accounts[0],
                            gas: gas,
                            gasPrice: '19000000000'
                          });

                        case 22:
                          instance = _context2.sent;

                          if (instance.options.address) {
                            _context2.next = 25;
                            break;
                          }

                          throw new Error("Contract deployment failed");

                        case 25:
                          ctx.contractInstance = instance;
                          ctx.contract = instance.options.address;
                          return _context2.abrupt("return", ctx.contract);

                        case 28:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _callee2, this, [[1, 5]]);
                }));

                return function task(_x2, _x3) {
                  return _task3.apply(this, arguments);
                };
              }()
            }]);
            return _context3.abrupt("return", tasks);

          case 14:
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
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(_ref3) {
    var reporter, network, cwd, contract, init, apmOptions, task, ctx;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            reporter = _ref3.reporter, network = _ref3.network, cwd = _ref3.cwd, contract = _ref3.contract, init = _ref3.init, apmOptions = _ref3.apm;
            _context4.next = 3;
            return exports.task({
              reporter: reporter,
              network: network,
              cwd: cwd,
              contract: contract,
              init: init,
              apmOptions: apmOptions
            });

          case 3:
            task = _context4.sent;
            _context4.next = 6;
            return task.run();

          case 6:
            ctx = _context4.sent;
            reporter.success("Successfully deployed ".concat(ctx.contractName, " at: ").concat(chalk.bold(ctx.contract)));
            process.exit();

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}();