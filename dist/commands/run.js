"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.string.bold");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.promise");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("regenerator-runtime/runtime");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var TaskList = require('listr');

var ganache = require('ganache-core');

var Web3 = require('web3');

var namehash = require('eth-ens-namehash');

var _require = require('js-sha3'),
    keccak256 = _require.keccak256;

var chalk = require('chalk');

var path = require('path');

var APM = require('@aragon/apm');

var publish = require('./apm_cmds/publish');

var devchain = require('./devchain');

var deploy = require('./deploy');

var newDAO = require('./dao_cmds/new');

var install = require('./dao_cmds/install');

var startIPFS = require('./ipfs');

var _require2 = require('util'),
    promisify = _require2.promisify;

var clone = promisify(require('git-clone'));

var os = require('os');

var fs = require('fs-extra');

var opn = require('opn');

var execa = require('execa');

var _require3 = require('../util'),
    findProjectRoot = _require3.findProjectRoot,
    isPortTaken = _require3.isPortTaken,
    installDeps = _require3.installDeps,
    getNodePackageManager = _require3.getNodePackageManager,
    getContract = _require3.getContract,
    ANY_ENTITY = _require3.ANY_ENTITY;

var _require4 = require('stream'),
    Writable = _require4.Writable;

var url = require('url');

var TX_MIN_GAS = 10e6;
var WRAPPER_PORT = 3000;
var WRAPPER_COMMIT = 'bf6e1844bf985182ae9c184dbe18129bc06dfcbf';
var WRAPPER_BRANCH = 'master';
exports.command = 'run';
exports.describe = 'Run the current app locally';

exports.builder = function (yargs) {
  return yargs.option('client', {
    description: 'Just run the smart contracts, without the Aragon client',
    default: true,
    boolean: true
  }).option('files', {
    description: 'Path(s) to directories containing files to publish. Specify multiple times to include multiple files.',
    default: ['.'],
    array: true
  }).option('port', {
    description: 'Port to start devchain at',
    default: '8545'
  }).option('accounts', {
    default: 2,
    description: 'Number of accounts to print'
  }).option('reset', {
    default: false,
    boolean: true,
    description: 'Reset devchain to snapshot'
  }).option('kit', {
    default: newDAO.BARE_KIT,
    description: "Kit contract name"
  }).option('kit-init', {
    description: 'Arguments to be passed to the kit constructor',
    array: true,
    default: []
  }).option('build-script', {
    description: 'The npm script that will be run when building the app',
    default: 'build'
  }).option('http', {
    description: 'URL for where your app is served from e.g. localhost:1234',
    default: null
  }).option('served-at', {
    description: 'URL for where your app is served from e.g. localhost:1234',
    default: null
  });
};

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

exports.handler = function (_ref4) {
  var reporter = _ref4.reporter,
      cwd = _ref4.cwd,
      apmOptions = _ref4.apm,
      network = _ref4.network,
      module = _ref4.module,
      client = _ref4.client,
      files = _ref4.files,
      port = _ref4.port,
      accounts = _ref4.accounts,
      reset = _ref4.reset,
      kit = _ref4.kit,
      kitInit = _ref4.kitInit,
      buildScript = _ref4.buildScript,
      http = _ref4.http,
      servedAt = _ref4.servedAt;
  apmOptions.ensRegistryAddress = apmOptions['ens-registry'];
  var showAccounts = accounts;
  var tasks = new TaskList([{
    title: 'Start a local Ethereum network',
    skip: function () {
      var _skip = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(ctx) {
        var hostURL;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                hostURL = new url.URL(network.provider.connection._url);
                _context2.next = 3;
                return isPortTaken(hostURL.port);

              case 3:
                if (_context2.sent) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", false);

              case 7:
                ctx.web3 = new Web3(network.provider);
                _context2.next = 10;
                return ctx.web3.eth.getAccounts();

              case 10:
                ctx.accounts = _context2.sent;
                return _context2.abrupt("return", 'Connected to the provided Ethereum network');

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function skip(_x5) {
        return _skip.apply(this, arguments);
      };
    }(),
    task: function () {
      var _task2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(ctx, _task) {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return devchain.task({
                  port: port,
                  reset: reset,
                  showAccounts: showAccounts
                });

              case 2:
                return _context3.abrupt("return", _context3.sent);

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function task(_x6, _x7) {
        return _task2.apply(this, arguments);
      };
    }()
  }, {
    title: 'Check IPFS',
    task: function task() {
      return startIPFS.task({
        apmOptions: apmOptions
      });
    }
  }, {
    title: 'Publish app to APM',
    task: function () {
      var _task3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(ctx) {
        var publishParams;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                publishParams = {
                  alreadyCompiled: true,
                  provider: 'ipfs',
                  files: files,
                  ignore: ['node_modules'],
                  reporter: reporter,
                  cwd: cwd,
                  network: network,
                  module: module,
                  buildScript: buildScript,
                  build: true,
                  contract: deploy.arappContract(),
                  web3: ctx.web3,
                  apm: apmOptions,
                  automaticallyBump: true,
                  getRepo: true,
                  http: http,
                  servedAt: servedAt
                };
                return _context4.abrupt("return", publish.task(publishParams));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function task(_x8) {
        return _task3.apply(this, arguments);
      };
    }()
  }, {
    title: 'Deploy Kit',
    enabled: function enabled() {
      return kit != newDAO.BARE_KIT;
    },
    task: function task(ctx) {
      var deployParams = {
        contract: kit,
        init: kitInit,
        reporter: reporter,
        network: network,
        cwd: cwd,
        web3: ctx.web3,
        apmOptions: apmOptions
      };
      return deploy.task(deployParams);
    }
  }, {
    title: 'Create DAO',
    task: function task(ctx) {
      var roles = ctx.repo.roles.map(function (role) {
        return role.bytes;
      }); // If no kit was deployed, use default params

      var fnArgs = ctx.contractInstance ? [] : [ctx.repo.appId, roles, ctx.accounts[0], '0x'];
      var newDAOParams = {
        kit: kit,
        kitVersion: 'latest',
        kitInstance: ctx.contractInstance,
        fn: 'newInstance',
        fnArgs: fnArgs,
        deployEvent: newDAO.BARE_KIT_DEPLOY_EVENT,
        web3: ctx.web3,
        reporter: reporter,
        apmOptions: apmOptions
      };
      return newDAO.task(newDAOParams);
    }
  }, {
    title: 'Open DAO',
    task: function task(ctx, _task4) {
      return new TaskList([{
        title: 'Download wrapper',
        task: function task(ctx, _task5) {
          var WRAPPER_PATH = "".concat(os.homedir(), "/.aragon/wrapper-").concat(WRAPPER_COMMIT);
          ctx.wrapperPath = WRAPPER_PATH; // Make sure we haven't already downloaded the wrapper

          if (fs.existsSync(path.resolve(WRAPPER_PATH))) {
            _task5.skip('Wrapper already downloaded');

            ctx.wrapperAvailable = true;
            return;
          } // Ensure folder exists


          fs.ensureDirSync(WRAPPER_PATH); // Clone wrapper

          return clone('https://github.com/aragon/aragon', WRAPPER_PATH, {
            checkout: WRAPPER_BRANCH
          });
        }
      }, {
        title: 'Install wrapper dependencies',
        task: function () {
          var _task7 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee5(ctx, _task6) {
            return regeneratorRuntime.wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return installDeps(ctx.wrapperPath, _task6);

                  case 2:
                    return _context5.abrupt("return", _context5.sent);

                  case 3:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5, this);
          }));

          return function task(_x9, _x10) {
            return _task7.apply(this, arguments);
          };
        }(),
        enabled: function enabled(ctx) {
          return !ctx.wrapperAvailable;
        }
      }, {
        title: 'Start Aragon client',
        task: function () {
          var _task9 = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee6(ctx, _task8) {
            var bin, startArguments;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.next = 2;
                    return isPortTaken(WRAPPER_PORT);

                  case 2:
                    if (!_context6.sent) {
                      _context6.next = 5;
                      break;
                    }

                    ctx.portOpen = true;
                    return _context6.abrupt("return");

                  case 5:
                    bin = getNodePackageManager();
                    startArguments = {
                      cwd: ctx.wrapperPath,
                      env: {
                        REACT_APP_ENS_REGISTRY_ADDRESS: ctx.ens,
                        BROWSER: 'none'
                      }
                    };
                    execa(bin, ['run', 'start:local'], startArguments).catch(function (err) {
                      throw new Error(err);
                    });

                  case 8:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, this);
          }));

          return function task(_x11, _x12) {
            return _task9.apply(this, arguments);
          };
        }()
      }, {
        title: 'Open wrapper',
        task: function task(ctx, _task10) {
          // Check until the wrapper is served
          var checkWrapperReady = function checkWrapperReady() {
            setTimeout(
            /*#__PURE__*/
            _asyncToGenerator(
            /*#__PURE__*/
            regeneratorRuntime.mark(function _callee7() {
              var portTaken;
              return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                  switch (_context7.prev = _context7.next) {
                    case 0:
                      _context7.next = 2;
                      return isPortTaken(WRAPPER_PORT);

                    case 2:
                      portTaken = _context7.sent;

                      if (portTaken) {
                        opn("http://localhost:".concat(WRAPPER_PORT, "/#/").concat(ctx.daoAddress));
                      } else {
                        checkWrapperReady();
                      }

                    case 4:
                    case "end":
                      return _context7.stop();
                  }
                }
              }, _callee7, this);
            })), 250);
          };

          checkWrapperReady();
        }
      }]);
    },
    enabled: function enabled() {
      return client === true;
    }
  }]);
  var manifestPath = path.resolve(findProjectRoot(), 'manifest.json');
  var manifest;

  if (fs.existsSync(manifestPath)) {
    manifest = fs.readJsonSync(manifestPath);
  }

  return tasks.run({
    ens: apmOptions['ens-registry']
  }).then(
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee8(ctx) {
      var registry;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (ctx.portOpen) {
                reporter.warning("Server already listening at port ".concat(WRAPPER_PORT, ", skipped starting Aragon"));
              }

              reporter.info("You are now ready to open your app in Aragon.");

              if (ctx.privateKeys) {
                devchain.printAccounts(reporter, ctx.privateKeys);
              }

              if (ctx.mnemonic) {
                devchain.printMnemonic(reporter, ctx.mnemonic);
              }

              devchain.printResetNotice(reporter, reset);
              registry = module.appName.split('.').slice(1).join('.');
              console.log();
              reporter.info("This is the configuration for your development deployment:\n    ".concat(chalk.bold('Ethereum Node'), ": ").concat(network.provider.connection._url, "\n    ").concat(chalk.bold('ENS registry'), ": ").concat(ctx.ens, "\n    ").concat(chalk.bold("APM registry"), ": ").concat(registry, "\n    ").concat(chalk.bold('DAO address'), ": ").concat(ctx.daoAddress, "\n\n    ").concat(client !== false ? "Opening http://localhost:3000/#/".concat(ctx.daoAddress, " to view your DAO") : "Use \"aragon dao <command> ".concat(ctx.daoAddress, "\" to interact with your DAO")));

              if (!manifest) {
                reporter.warning('No front-end detected (no manifest.json)');
              } else if (!manifest.start_url) {
                reporter.warning('No front-end detected (no start_url defined)');
              }

            case 9:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, this);
    }));

    return function (_x13) {
      return _ref6.apply(this, arguments);
    };
  }());
};