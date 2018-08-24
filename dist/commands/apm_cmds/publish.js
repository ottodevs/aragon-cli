"use strict";

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.promise");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.object.assign");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.array.index-of");

require("regenerator-runtime/runtime");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var _require = require('../../helpers/web3-fallback'),
    ensureWeb3 = _require.ensureWeb3;

var fs = require('fs');

var tmp = require('tmp-promise');

var path = require('path');

var _require2 = require('util'),
    promisify = _require2.promisify;

var _require3 = require('fs-extra'),
    copy = _require3.copy,
    readJson = _require3.readJson,
    writeJson = _require3.writeJson,
    pathExistsSync = _require3.pathExistsSync,
    existsSync = _require3.existsSync;

var extract = require('../../helpers/solidity-extractor');

var APM = require('@aragon/apm');

var semver = require('semver');

var EthereumTx = require('ethereumjs-tx');

var namehash = require('eth-ens-namehash');

var _require4 = require('js-sha3'),
    keccak256 = _require4.keccak256;

var TaskList = require('listr');

var _require5 = require('../../util'),
    findProjectRoot = _require5.findProjectRoot,
    getNodePackageManager = _require5.getNodePackageManager;

var ignore = require('ignore');

var execa = require('execa');

var _require6 = require('../../helpers/truffle-runner'),
    compileContracts = _require6.compileContracts;

var web3Utils = require('web3-utils');

var deploy = require('../deploy');

var startIPFS = require('../ipfs');

var getRepoTask = require('../dao_cmds/utils/getRepoTask');

var MANIFEST_FILE = 'manifest.json';
exports.command = 'publish [contract]';
exports.describe = 'Publish a new version of the application';

exports.builder = function (yargs) {
  return deploy.builder(yargs) // inherit deploy options
  .positional('contract', {
    description: 'The address or name of the contract to publish in this version. If it isn\' provided, it will default to the current version\'s contract.'
  }).option('only-artifacts', {
    description: 'Whether just generate artifacts file without publishing',
    default: false,
    boolean: true
  }).option('provider', {
    description: 'The APM storage provider to publish files to',
    default: 'ipfs',
    choices: ['ipfs']
  }).option('reuse', {
    description: 'Whether to reuse the previous version contract and skip deployment on non-major versions',
    default: false,
    boolean: true
  }).option('files', {
    description: 'Path(s) to directories containing files to publish. Specify multiple times to include multiple files.',
    default: ['.'],
    array: true
  }).option('ignore', {
    description: 'A gitignore pattern of files to ignore. Specify multiple times to add multiple patterns.',
    array: true,
    default: ['node_modules']
  }).option('ipfs-check', {
    description: 'Whether to have publish start IPFS if not started',
    boolean: true,
    default: true
  }).option('publish-dir', {
    description: 'Temporary directory where files will be copied before publishing. Defaults to temp dir.',
    default: null
  }).option('only-content', {
    description: 'Whether to skip contract compilation, deployment and contract artifact generation',
    default: false,
    boolean: true
  }).option('build', {
    description: 'Whether publish should try to build the app before publishing, running the script specified in --build-script',
    default: true,
    boolean: true
  }).option('build-script', {
    description: 'The npm script that will be run when building the app',
    default: 'build'
  }).option('http', {
    description: 'URL for where your app is served e.g. localhost:1234',
    default: null
  }).option('served-at', {
    description: 'Directory where your files is being served from e.g. ./dist',
    default: null
  });
};

function generateApplicationArtifact(_x, _x2, _x3, _x4, _x5, _x6) {
  return _generateApplicationArtifact.apply(this, arguments);
}
/**
 * Moves the specified files to a temporary directory and returns the path to
 * the temporary directory.
 *
 * @param {Array<string>} files An array of file paths to include
 * @param {string} ignorePatterns An array of glob-like pattern of files to ignore
 * @return {string} The path to the temporary directory
 */


function _generateApplicationArtifact() {
  _generateApplicationArtifact = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee12(web3, cwd, outputPath, module, contract, reporter) {
    var artifact, contractPath, contractInterfacePath, contractInterface;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            artifact = Object.assign({}, module);
            contractPath = artifact.path;
            contractInterfacePath = path.resolve(cwd, 'build/contracts', path.basename(contractPath, '.sol') + '.json'); // Set `appId`

            artifact.appId = namehash.hash(artifact.appName); // Set ABI

            _context12.next = 6;
            return readJson(contractInterfacePath);

          case 6:
            contractInterface = _context12.sent;
            artifact.abi = contractInterface.abi; // Analyse contract functions and returns an array
            // > [{ sig: 'transfer(address)', role: 'X_ROLE', notice: 'Transfers..'}]

            _context12.next = 10;
            return extract(path.resolve(cwd, artifact.path));

          case 10:
            artifact.functions = _context12.sent;
            artifact.roles = artifact.roles.map(function (role) {
              return Object.assign(role, {
                bytes: '0x' + keccak256(role.id)
              });
            }); // Save artifact

            _context12.next = 14;
            return writeJson(path.resolve(outputPath, 'artifact.json'), artifact, {
              spaces: '\t'
            });

          case 14:
            return _context12.abrupt("return", artifact);

          case 15:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, this);
  }));
  return _generateApplicationArtifact.apply(this, arguments);
}

function prepareFilesForPublishing(_x7) {
  return _prepareFilesForPublishing.apply(this, arguments);
}

function _prepareFilesForPublishing() {
  _prepareFilesForPublishing = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee14(tmpDir) {
    var files,
        ignorePatterns,
        filter,
        projectRoot,
        ipfsignorePath,
        gitignorePath,
        replaceRootRegex,
        filterIgnoredFiles,
        manifestOrigin,
        manifestDst,
        _args14 = arguments;
    return regeneratorRuntime.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            filterIgnoredFiles = function _ref7(src) {
              var relativeSrc = src.replace(replaceRootRegex, '.');
              return !filter.ignores(relativeSrc);
            };

            files = _args14.length > 1 && _args14[1] !== undefined ? _args14[1] : [];
            ignorePatterns = _args14.length > 2 && _args14[2] !== undefined ? _args14[2] : null;
            // Ignored files filter
            filter = ignore().add(ignorePatterns);
            projectRoot = findProjectRoot();
            ipfsignorePath = path.resolve(projectRoot, '.ipfsignore');

            if (pathExistsSync(ipfsignorePath)) {
              filter.add(fs.readFileSync(ipfsignorePath).toString());
            } else {
              gitignorePath = path.resolve(projectRoot, '.gitignore');

              if (pathExistsSync(gitignorePath)) {
                filter.add(fs.readFileSync(gitignorePath).toString());
              }
            }

            replaceRootRegex = new RegExp("^".concat(projectRoot));
            _context14.next = 10;
            return Promise.all(files.map(
            /*#__PURE__*/
            function () {
              var _ref6 = _asyncToGenerator(
              /*#__PURE__*/
              regeneratorRuntime.mark(function _callee13(file) {
                var stats, destination;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        _context13.next = 2;
                        return promisify(fs.lstat)(file);

                      case 2:
                        stats = _context13.sent;
                        destination = tmpDir;

                        if (stats.isFile()) {
                          destination = path.resolve(tmpDir, file);
                        }

                        return _context13.abrupt("return", copy(file, destination, {
                          filter: filterIgnoredFiles
                        }));

                      case 6:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13, this);
              }));

              return function (_x25) {
                return _ref6.apply(this, arguments);
              };
            }()));

          case 10:
            manifestOrigin = path.resolve(projectRoot, MANIFEST_FILE);
            manifestDst = path.resolve(tmpDir, MANIFEST_FILE);

            if (!(!pathExistsSync(manifestDst) && pathExistsSync(manifestOrigin))) {
              _context14.next = 15;
              break;
            }

            _context14.next = 15;
            return copy(manifestOrigin, manifestDst);

          case 15:
            return _context14.abrupt("return", tmpDir);

          case 16:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, this);
  }));
  return _prepareFilesForPublishing.apply(this, arguments);
}

exports.task = function (_ref) {
  var reporter = _ref.reporter,
      cwd = _ref.cwd,
      web3 = _ref.web3,
      network = _ref.network,
      module = _ref.module,
      apmOptions = _ref.apm,
      contract = _ref.contract,
      onlyArtifacts = _ref.onlyArtifacts,
      alreadyCompiled = _ref.alreadyCompiled,
      reuse = _ref.reuse,
      provider = _ref.provider,
      key = _ref.key,
      files = _ref.files,
      ignore = _ref.ignore,
      automaticallyBump = _ref.automaticallyBump,
      ipfsCheck = _ref.ipfsCheck,
      publishDir = _ref.publishDir,
      init = _ref.init,
      getRepo = _ref.getRepo,
      onlyContent = _ref.onlyContent,
      build = _ref.build,
      buildScript = _ref.buildScript,
      http = _ref.http,
      servedAt = _ref.servedAt;

  if (onlyContent) {
    contract = '0x0000000000000000000000000000000000000000';
  }

  apmOptions.ensRegistryAddress = apmOptions['ens-registry'];
  var apm = APM(web3, apmOptions);
  return new TaskList([{
    title: 'Preflight checks for publishing to APM',
    enabled: function enabled() {
      return !automaticallyBump;
    },
    task: function task(ctx) {
      return new TaskList([{
        title: 'Check version is valid',
        task: function task(ctx) {
          if (module && semver.valid(module.version)) {
            ctx.version = module.version;
            return "".concat(module.version, " is a valid version");
          }

          throw new MessageError(module ? "".concat(module.version, " is not a valid semantic version") : 'Could not determine version', 'ERR_INVALID_VERSION');
        }
      }, {
        title: 'Checking version bump',
        task: function () {
          var _task = _asyncToGenerator(
          /*#__PURE__*/
          regeneratorRuntime.mark(function _callee(ctx) {
            var repo, isValid, getMajor;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    repo = {
                      version: '0.0.0'
                    };
                    _context.prev = 1;
                    _context.next = 4;
                    return apm.getLatestVersion(module.appName);

                  case 4:
                    repo = _context.sent;
                    _context.next = 17;
                    break;

                  case 7:
                    _context.prev = 7;
                    _context.t0 = _context["catch"](1);

                    if (!(_context.t0.message.indexOf("Invalid content URI") == 0)) {
                      _context.next = 11;
                      break;
                    }

                    return _context.abrupt("return");

                  case 11:
                    if (!(apm.validInitialVersions.indexOf(ctx.version) == -1)) {
                      _context.next = 15;
                      break;
                    }

                    throw new Error('Invalid initial version, it can only be 0.0.1, 0.1.0 or 1.0.0. Check your arapp file.');

                  case 15:
                    ctx.isMajor = true; // consider first version as major

                    return _context.abrupt("return");

                  case 17:
                    if (!(ctx.version == repo.version)) {
                      _context.next = 19;
                      break;
                    }

                    throw new Error('Version is already published, please bump it using `aragon apm version [major, minor, patch]`');

                  case 19:
                    _context.next = 21;
                    return apm.isValidBump(module.appName, repo.version, ctx.version);

                  case 21:
                    isValid = _context.sent;

                    if (isValid) {
                      _context.next = 24;
                      break;
                    }

                    throw new Error('Version bump is not valid, you have to respect APM bumps policy. Check version upgrade rules in documentation https://hack.aragon.org/docs/aragonos-ref.html#631-version-upgrade-rules');

                  case 24:
                    getMajor = function getMajor(version) {
                      return version.split('.')[0];
                    };

                    ctx.isMajor = getMajor(repo.version) != getMajor(ctx.version);

                  case 26:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this, [[1, 7]]);
          }));

          return function task(_x8) {
            return _task.apply(this, arguments);
          };
        }()
      }]);
    }
  }, {
    title: 'Compile contracts',
    task: function () {
      var _task2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return compileContracts();

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function task() {
        return _task2.apply(this, arguments);
      };
    }(),
    enabled: function enabled() {
      return !onlyContent && web3Utils.isAddress(contract);
    }
  }, {
    title: 'Deploy contract',
    task: function () {
      var _task3 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(ctx) {
        var deployTaskParams;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                deployTaskParams = {
                  contract: contract,
                  init: init,
                  reporter: reporter,
                  network: network,
                  cwd: cwd,
                  web3: web3,
                  apmOptions: apmOptions
                };
                _context3.next = 3;
                return deploy.task(deployTaskParams);

              case 3:
                return _context3.abrupt("return", _context3.sent);

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function task(_x9) {
        return _task3.apply(this, arguments);
      };
    }(),
    enabled: function enabled(ctx) {
      return !onlyContent && (contract && !web3Utils.isAddress(contract) || !contract && ctx.isMajor && !reuse || automaticallyBump);
    }
  }, {
    title: 'Automatically bump version',
    task: function () {
      var _task5 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(ctx, _task4) {
        var nextMajorVersion, _ref2, version;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return apm.getLatestVersion(module.appName);

              case 3:
                _ref2 = _context4.sent;
                version = _ref2.version;
                nextMajorVersion = parseInt(version.split('.')[0]) + 1;
                _context4.next = 12;
                break;

              case 8:
                _context4.prev = 8;
                _context4.t0 = _context4["catch"](0);
                ctx.version = '1.0.0';
                return _context4.abrupt("return", _task4.skip('Starting from initial version'));

              case 12:
                ctx.version = "".concat(nextMajorVersion, ".0.0");

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 8]]);
      }));

      return function task(_x10, _x11) {
        return _task5.apply(this, arguments);
      };
    }(),
    enabled: function enabled() {
      return automaticallyBump;
    }
  }, {
    title: 'Determine contract address for version',
    task: function () {
      var _task7 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(ctx, _task6) {
        var _apm$getLatestVersion, _contract;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (web3Utils.isAddress(contract)) {
                  ctx.contract = contract;
                } // Check if we can fall back to a previous contract address


                if (!(!ctx.contract && ctx.version !== '1.0.0')) {
                  _context5.next = 12;
                  break;
                }

                _task6.output = 'No contract address provided, using previous one';
                _context5.prev = 3;
                _apm$getLatestVersion = apm.getLatestVersion(module.appName), _contract = _apm$getLatestVersion.contract;
                ctx.contract = _contract;
                return _context5.abrupt("return", "Using ".concat(_contract));

              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5["catch"](3);
                throw new Error('Could not determine previous contract');

              case 12:
                if (ctx.contract) {
                  _context5.next = 14;
                  break;
                }

                throw new Error('No contract address supplied for initial version');

              case 14:
                return _context5.abrupt("return", "Using ".concat(contract));

              case 15:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 9]]);
      }));

      return function task(_x12, _x13) {
        return _task7.apply(this, arguments);
      };
    }(),
    enabled: function enabled() {
      return !onlyArtifacts;
    }
  }, _defineProperty({
    title: 'Building frontend',
    enabled: function enabled() {
      return build;
    },
    task: function () {
      var _task9 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(ctx, _task8) {
        var packageJson, scripts, bin, buildTask;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (fs.existsSync('package.json')) {
                  _context6.next = 3;
                  break;
                }

                _task8.skip('No package.json found');

                return _context6.abrupt("return");

              case 3:
                _context6.next = 5;
                return readJson('package.json');

              case 5:
                packageJson = _context6.sent;
                scripts = packageJson.scripts || {};

                if (scripts[buildScript]) {
                  _context6.next = 10;
                  break;
                }

                _task8.skip('Build script not defined in package.json');

                return _context6.abrupt("return");

              case 10:
                bin = getNodePackageManager();
                buildTask = execa(bin, ['run', buildScript]);
                buildTask.stdout.on('data', function (log) {
                  if (!log) return;
                  _task8.output = "npm run ".concat(buildScript, ": ").concat(log);
                });
                return _context6.abrupt("return", buildTask.catch(function (err) {
                  throw new Error("".concat(err.message, "\n").concat(err.stderr, "\n\nFailed to build. See above output."));
                }));

              case 14:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function task(_x14, _x15) {
        return _task9.apply(this, arguments);
      };
    }()
  }, "enabled", function enabled() {
    return !http;
  }), {
    title: 'Check IPFS',
    task: function task() {
      return startIPFS.task({
        apmOptions: apmOptions
      });
    },
    enabled: function enabled() {
      return http ? false : ipfsCheck;
    }
  }, {
    title: 'Prepare files for publishing',
    task: function () {
      var _task11 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(ctx, _task10) {
        var _ref4, tmpDir;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (publishDir) {
                  _context7.next = 6;
                  break;
                }

                _context7.next = 3;
                return tmp.dir();

              case 3:
                _ref4 = _context7.sent;
                tmpDir = _ref4.path;
                publishDir = tmpDir;

              case 6:
                _context7.next = 8;
                return prepareFilesForPublishing(publishDir, files, ignore);

              case 8:
                ctx.pathToPublish = publishDir;
                return _context7.abrupt("return", "Files copied to temporary directory: ".concat(ctx.pathToPublish));

              case 10:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function task(_x16, _x17) {
        return _task11.apply(this, arguments);
      };
    }(),
    enabled: function enabled() {
      return !http;
    }
  }, {
    title: 'Check for --served-at argument and copy manifest.json to destination',
    task: function () {
      var _task13 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(ctx, _task12) {
        var projectRoot, manifestOrigin, manifestDst;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (servedAt) {
                  _context8.next = 2;
                  break;
                }

                throw new Error('You need to provide --served-at argument');

              case 2:
                projectRoot = findProjectRoot();
                manifestOrigin = path.resolve(projectRoot, MANIFEST_FILE);
                manifestDst = path.resolve(servedAt, MANIFEST_FILE);

                if (!(!pathExistsSync(manifestDst) && pathExistsSync(manifestOrigin))) {
                  _context8.next = 8;
                  break;
                }

                _context8.next = 8;
                return copy(manifestOrigin, manifestDst);

              case 8:
                ctx.pathToPublish = servedAt;

              case 9:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function task(_x18, _x19) {
        return _task13.apply(this, arguments);
      };
    }(),
    enabled: function enabled() {
      return http;
    }
  }, {
    title: 'Generate application artifact',
    skip: function skip() {
      return onlyContent && !module.path;
    },
    // TODO: If onlyContent has been set, get previous version's artifact
    task: function () {
      var _task15 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9(ctx, _task14) {
        var dir, artifact;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                dir = onlyArtifacts ? cwd : ctx.pathToPublish;
                _context9.next = 3;
                return generateApplicationArtifact(web3, cwd, dir, module, contract, reporter);

              case 3:
                artifact = _context9.sent;
                return _context9.abrupt("return", "Saved artifact in ".concat(dir, "/artifact.json"));

              case 5:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function task(_x20, _x21) {
        return _task15.apply(this, arguments);
      };
    }()
  }, {
    title: "Publish ".concat(module.appName),
    task: function () {
      var _task17 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(ctx, _task16) {
        var accounts, from, transaction, errMsg;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                ctx.contractInstance = null; // clean up deploy sub-command artifacts

                _task16.output = 'Generating transaction and waiting for confirmation';
                _context10.next = 4;
                return web3.eth.getAccounts();

              case 4:
                accounts = _context10.sent;
                from = accounts[0];
                _context10.prev = 6;
                _context10.next = 9;
                return apm.publishVersion(from, module.appName, ctx.version, http ? 'http' : provider, http || ctx.pathToPublish, ctx.contract, from);

              case 9:
                transaction = _context10.sent;
                // Fix because APM.js gas comes with decimals and from doesn't work
                transaction.from = from;
                transaction.gas = Math.round(transaction.gas);
                transaction.gasPrice = '19000000000'; // 19 gwei

                reporter.debug(JSON.stringify(transaction));
                _context10.next = 16;
                return web3.eth.sendTransaction(transaction);

              case 16:
                return _context10.abrupt("return", _context10.sent);

              case 19:
                _context10.prev = 19;
                _context10.t0 = _context10["catch"](6);
                errMsg = "".concat(_context10.t0, "\nThis is usually one of these reasons, maybe:\n          - An existing version of this package was already deployed, try running 'aragon version' to bump it\n          - You are deploying a version higher than the one in the chain");
                throw new Error(errMsg);

              case 23:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[6, 19]]);
      }));

      return function task(_x22, _x23) {
        return _task17.apply(this, arguments);
      };
    }(),
    enabled: function enabled() {
      return !onlyArtifacts;
    }
  }, {
    title: 'Fetch published repo',
    task: getRepoTask.task({
      apmRepo: module.appName,
      apm: apm
    }),
    enabled: function enabled() {
      return getRepo;
    }
  }]);
};

exports.handler =
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee11(args) {
    var apmOptions, network, reporter, module, web3;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            apmOptions = args.apm, network = args.network, reporter = args.reporter, module = args.module;
            _context11.next = 3;
            return ensureWeb3(network);

          case 3:
            web3 = _context11.sent;
            return _context11.abrupt("return", exports.task(_objectSpread({}, args, {
              web3: web3
            })).run({
              web3: web3
            }).then(function () {
              process.exit();
            }).catch(function () {
              process.exit();
            }));

          case 5:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, this);
  }));

  return function (_x24) {
    return _ref5.apply(this, arguments);
  };
}();