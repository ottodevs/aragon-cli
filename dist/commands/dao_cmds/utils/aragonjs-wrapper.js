"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.promise");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es7.object.values");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

require("regenerator-runtime/runtime");

var _bignumber = require("bignumber.js");

var _wrapper = _interopRequireWildcard(require("@aragon/wrapper"));

var _environment = require("./environment");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var noop = function noop() {};

var appSrc = function appSrc(app) {
  var gateway = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _environment.ipfsDefaultConf.gateway;
  var hash = app.content && app.content.location;
  if (!hash) return '';

  if (_environment.appLocator[app.appId]) {
    return _environment.appLocator[app.appId];
  }

  return "".concat(gateway, "/").concat(hash, "/");
}; // Subscribe to wrapper's observables


var subscribe = function subscribe(wrapper, _ref, _ref2) {
  var onApps = _ref.onApps,
      onForwarders = _ref.onForwarders,
      onTransaction = _ref.onTransaction,
      onPermissions = _ref.onPermissions;
  var ipfsConf = _ref2.ipfsConf;
  var apps = wrapper.apps,
      forwarders = wrapper.forwarders,
      transactions = wrapper.transactions,
      permissions = wrapper.permissions;
  var subscriptions = {
    apps: apps.subscribe(onApps),
    connectedApp: null,
    forwarders: forwarders.subscribe(onForwarders),
    transactions: transactions.subscribe(onTransaction),
    permissions: permissions.subscribe(onPermissions)
  };
  return subscriptions;
};

var resolveEnsDomain =
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(domain, opts) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _wrapper.ensResolve)(domain, opts);

          case 3:
            return _context.abrupt("return", _context.sent);

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](0);

            if (!(_context.t0.message === 'ENS name not defined.')) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", '');

          case 10:
            throw _context.t0;

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 6]]);
  }));

  return function resolveEnsDomain(_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();

var initWrapper =
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(dao, ensRegistryAddress) {
    var _ref5,
        provider,
        _ref5$walletProvider,
        walletProvider,
        _ref5$ipfsConf,
        ipfsConf,
        _ref5$onError,
        onError,
        _ref5$onApps,
        onApps,
        _ref5$onForwarders,
        onForwarders,
        _ref5$onTransaction,
        onTransaction,
        _ref5$onDaoAddress,
        onDaoAddress,
        _ref5$onPermissions,
        onPermissions,
        isDomain,
        daoAddress,
        wrapper,
        account,
        subscriptions,
        _args2 = arguments;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref5 = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {}, provider = _ref5.provider, _ref5$walletProvider = _ref5.walletProvider, walletProvider = _ref5$walletProvider === void 0 ? null : _ref5$walletProvider, _ref5$ipfsConf = _ref5.ipfsConf, ipfsConf = _ref5$ipfsConf === void 0 ? _environment.ipfsDefaultConf : _ref5$ipfsConf, _ref5$onError = _ref5.onError, onError = _ref5$onError === void 0 ? noop : _ref5$onError, _ref5$onApps = _ref5.onApps, onApps = _ref5$onApps === void 0 ? noop : _ref5$onApps, _ref5$onForwarders = _ref5.onForwarders, onForwarders = _ref5$onForwarders === void 0 ? noop : _ref5$onForwarders, _ref5$onTransaction = _ref5.onTransaction, onTransaction = _ref5$onTransaction === void 0 ? noop : _ref5$onTransaction, _ref5$onDaoAddress = _ref5.onDaoAddress, onDaoAddress = _ref5$onDaoAddress === void 0 ? noop : _ref5$onDaoAddress, _ref5$onPermissions = _ref5.onPermissions, onPermissions = _ref5$onPermissions === void 0 ? noop : _ref5$onPermissions;
            isDomain = /[a-z0-9]+\.eth/.test(dao);

            if (!isDomain) {
              _context2.next = 8;
              break;
            }

            _context2.next = 5;
            return resolveEnsDomain(dao, {
              provider: provider,
              registryAddress: ensRegistryAddress
            });

          case 5:
            _context2.t0 = _context2.sent;
            _context2.next = 9;
            break;

          case 8:
            _context2.t0 = dao;

          case 9:
            daoAddress = _context2.t0;

            if (daoAddress) {
              _context2.next = 13;
              break;
            }

            onError(new InvalidAddress('The provided DAO address is invalid'));
            return _context2.abrupt("return");

          case 13:
            onDaoAddress(daoAddress);
            wrapper = new _wrapper.default(daoAddress, {
              ensRegistryAddress: ensRegistryAddress,
              provider: provider,
              apm: {
                ipfs: ipfsConf
              }
            });
            account = '';
            _context2.prev = 16;
            _context2.next = 19;
            return wrapper.init(account && [account]);

          case 19:
            _context2.next = 27;
            break;

          case 21:
            _context2.prev = 21;
            _context2.t1 = _context2["catch"](16);

            if (!(_context2.t1.message === 'connection not open')) {
              _context2.next = 26;
              break;
            }

            onError(new NoConnection('The wrapper can not be initialized without a connection'));
            return _context2.abrupt("return");

          case 26:
            throw _context2.t1;

          case 27:
            subscriptions = subscribe(wrapper, {
              onApps: onApps,
              onForwarders: onForwarders,
              onTransaction: onTransaction,
              onPermissions: onPermissions
            }, {
              ipfsConf: ipfsConf
            });

            wrapper.cancel = function () {
              Object.values(subscriptions).forEach(function (subscription) {
                if (subscription) {
                  subscription.unsubscribe();
                }
              });
            };

            return _context2.abrupt("return", wrapper);

          case 30:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[16, 21]]);
  }));

  return function initWrapper(_x3, _x4) {
    return _ref4.apply(this, arguments);
  };
}();

var _default = initWrapper;
exports.default = _default;