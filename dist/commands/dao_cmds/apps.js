"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

var _aragonjsWrapper = _interopRequireDefault(require("./utils/aragonjs-wrapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var TaskList = require('listr');

var Web3 = require('web3');

var daoArg = require('./utils/daoArg');

var _require = require('./utils/knownApps'),
    listApps = _require.listApps;

var _require2 = require('../../helpers/web3-fallback'),
    ensureWeb3 = _require2.ensureWeb3;

var path = require('path');

var Table = require('cli-table');

var colors = require('colors');

var knownApps;
exports.command = 'apps <dao>';
exports.describe = 'Get all the apps in a DAO';

exports.builder = function (yargs) {
  return daoArg(yargs);
};

var printAppName = function printAppName(appId) {
  return knownApps[appId] ? knownApps[appId] : appId.slice(0, 10) + '...';
};

var printContent = function printContent(content) {
  if (!content) return '(No UI available)';
  return "".concat(content.provider, ":").concat(content.location).slice(0, 25) + '...';
};

exports.handler =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var reporter, dao, network, apmOptions, web3, tasks;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reporter = _ref.reporter, dao = _ref.dao, network = _ref.network, apmOptions = _ref.apm;
            knownApps = listApps();
            _context.next = 4;
            return ensureWeb3(network);

          case 4:
            web3 = _context.sent;
            tasks = new TaskList([{
              title: 'Inspecting DAO',
              task: function task(ctx, _task) {
                _task.output = "Fetching apps for ".concat(dao, "...");
                return new Promise(function (resolve, reject) {
                  (0, _aragonjsWrapper.default)(dao, apmOptions['ens-registry'], {
                    provider: web3.currentProvider,
                    onApps: function onApps(apps) {
                      ctx.apps = apps;
                      resolve();
                    },
                    onDaoAddress: function onDaoAddress(addr) {
                      return ctx.daoAddress = addr;
                    },
                    onError: function onError(err) {
                      return reject(err);
                    }
                  }).catch(function (err) {
                    reporter.error('Error inspecting DAO apps');
                    reporter.debug(err);
                    process.exit(1);
                  });
                });
              }
            }]);
            return _context.abrupt("return", tasks.run().then(function (ctx) {
              reporter.success("Successfully fetched DAO apps for ".concat(ctx.daoAddress));
              var appsContent = ctx.apps.map(function (_ref3) {
                var appId = _ref3.appId,
                    proxyAddress = _ref3.proxyAddress,
                    codeAddress = _ref3.codeAddress,
                    content = _ref3.content,
                    appName = _ref3.appName,
                    version = _ref3.version;
                return [appName ? "".concat(appName, "@v").concat(version) : printAppName(appId), proxyAddress, printContent(content)];
              }); // filter registry name to make it shorter
              // TODO: Add flag to turn off

              var filteredContent = appsContent.map(function (row) {
                row[0] = row[0].replace('.aragonpm.eth', '');
                return row;
              });
              var table = new Table({
                head: ['App', 'Proxy address', 'Content'].map(function (x) {
                  return x.white;
                })
              });
              filteredContent.forEach(function (row) {
                return table.push(row);
              });
              console.log(table.toString());
              process.exit(); // force exit, as aragonjs hangs
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();