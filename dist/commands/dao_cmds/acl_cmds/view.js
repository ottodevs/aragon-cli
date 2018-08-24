"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.array.reduce");

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.regexp.split");

var _aragonjsWrapper = _interopRequireDefault(require("../utils/aragonjs-wrapper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var TaskList = require('listr');

var Web3 = require('web3');

var daoArg = require('../utils/daoArg');

var _require = require('../utils/knownApps'),
    listApps = _require.listApps;

var _require2 = require('./utils/knownRoles'),
    rolesForApps = _require2.rolesForApps;

var _require3 = require('../../../helpers/web3-fallback'),
    ensureWeb3 = _require3.ensureWeb3;

var Table = require('cli-table');

var colors = require('colors');

var knownRoles = rolesForApps();
var ANY_ENTITY = '0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF';
var ANY_ENTITY_TEXT = 'Any entity';

var path = require('path');

var knownApps;
exports.command = 'view <dao>';
exports.describe = 'Inspect permissions in a DAO';

exports.builder = function (yargs) {
  return daoArg(yargs);
};

var printAppName = function printAppName(appId, addr) {
  if (addr == ANY_ENTITY) return ANY_ENTITY_TEXT;
  return knownApps[appId] ? "".concat(knownApps[appId].split('.')[0], " (").concat(appId.slice(0, 6), ")") : addr.slice(0, 16) + '...';
};

var appFromProxyAddress = function appFromProxyAddress(proxyAddress, apps) {
  return apps.filter(function (app) {
    return app.proxyAddress == proxyAddress;
  })[0] || {};
};

var formatRow = function formatRow(_ref, apps) {
  var to = _ref.to,
      role = _ref.role,
      allowed = _ref.allowed;
  var formattedTo = printAppName(appFromProxyAddress(to, apps).appId, to);
  var formattedRole = knownRoles[role] || "".concat(role.slice(0, 8), "..").concat(role.slice(-6));
  if (formattedRole['id']) formattedRole = formattedRole['id'];
  var formattedAllowed = allowed.reduce(function (acc, addr) {
    var allowedName = printAppName(appFromProxyAddress(addr, apps).appId, addr);
    var allowedEmoji = allowedName == ANY_ENTITY_TEXT ? '🆓' : '✅';
    return acc + '\n' + allowedEmoji + '  ' + allowedName;
  }, '').slice(1); // remove first newline

  return [formattedTo, formattedRole, formattedAllowed];
};

exports.handler =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref2) {
    var reporter, dao, network, apm, web3, tasks;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reporter = _ref2.reporter, dao = _ref2.dao, network = _ref2.network, apm = _ref2.apm;
            knownApps = listApps();
            _context.next = 4;
            return ensureWeb3(network);

          case 4:
            web3 = _context.sent;
            tasks = new TaskList([{
              title: 'Inspecting DAO Permissions',
              task: function task(ctx, _task) {
                _task.output = "Fetching permissions for ".concat(dao, "...");
                return new Promise(function (resolve, reject) {
                  var resolveIfReady = function resolveIfReady() {
                    if (ctx.acl && ctx.apps) {
                      resolve();
                    }
                  };

                  (0, _aragonjsWrapper.default)(dao, apm['ens-registry'], {
                    provider: web3.currentProvider,
                    onPermissions: function onPermissions(permissions) {
                      ctx.acl = permissions;
                      resolveIfReady();
                    },
                    onApps: function onApps(apps) {
                      ctx.apps = apps;
                      resolveIfReady();
                    },
                    onDaoAddress: function onDaoAddress(addr) {
                      return ctx.daoAddress = addr;
                    },
                    onError: function onError(err) {
                      return reject(err);
                    }
                  }).catch(function (err) {
                    reporter.error('Error inspecting DAO');
                    reporter.debug(err);
                    process.exit(1);
                  });
                });
              }
            }]);
            return _context.abrupt("return", tasks.run().then(function (ctx) {
              reporter.success("Successfully fetched DAO apps for ".concat(ctx.daoAddress));
              var acl = ctx.acl; // filter according to cli params will happen here

              var table = new Table({
                head: ['App', 'Action', 'Allowed entities'].map(function (x) {
                  return x.white;
                })
              });
              var tos = Object.keys(acl);
              var flattenedACL = tos.reduce(function (acc, to) {
                var roles = Object.keys(acl[to]);
                var permissions = roles.map(function (role) {
                  return {
                    allowed: acl[to][role],
                    to: to,
                    role: role
                  };
                });
                return acc.concat(permissions);
              }, []);
              flattenedACL.map(function (row) {
                return formatRow(row, ctx.apps);
              }).forEach(function (row) {
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
    return _ref3.apply(this, arguments);
  };
}();