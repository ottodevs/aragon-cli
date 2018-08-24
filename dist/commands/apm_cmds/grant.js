"use strict";

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var Web3 = require('web3');

var EthereumTx = require('ethereumjs-tx');

var APM = require('@aragon/apm');

var ACL = require('../../acl');

var _require = require('../../helpers/web3-fallback'),
    ensureWeb3 = _require.ensureWeb3;

exports.command = 'grant [address]';
exports.describe = 'Grant an address permission to create new versions in this package';

exports.builder = function (yargs) {
  return yargs.positional('address', {
    description: 'The address being granted the permission to publish to the repo'
  });
};

exports.handler =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var reporter, cwd, network, module, apmOptions, address, web3, apm, acl, repo, accounts, from, transaction, _receipt;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            reporter = _ref.reporter, cwd = _ref.cwd, network = _ref.network, module = _ref.module, apmOptions = _ref.apm, address = _ref.address;
            _context.next = 3;
            return ensureWeb3(network);

          case 3:
            web3 = _context.sent;
            apmOptions.ensRegistryAddress = apmOptions['ens-registry'];
            _context.next = 7;
            return APM(web3, apmOptions);

          case 7:
            apm = _context.sent;
            acl = ACL(web3);
            _context.next = 11;
            return apm.getRepository(module.appName).catch(function () {
              return null;
            });

          case 11:
            repo = _context.sent;

            if (!(repo === null)) {
              _context.next = 14;
              break;
            }

            throw new Error("Repository ".concat(module.appName, " does not exist and it's registry does not exist"));

          case 14:
            reporter.info("Granting permission to publish on ".concat(module.appName, " for ").concat(address)); // Decode sender

            _context.next = 17;
            return web3.eth.getAccounts();

          case 17:
            accounts = _context.sent;
            from = accounts[0]; // Build transaction

            _context.next = 21;
            return acl.grant(repo.options.address, address);

          case 21:
            transaction = _context.sent;
            _context.next = 24;
            return web3.eth.getTransactionCount(from);

          case 24:
            transaction.nonce = _context.sent;
            transaction.from = from;
            _context.prev = 26;
            _context.next = 29;
            return web3.eth.sendTransaction(transaction);

          case 29:
            _receipt = _context.sent;
            reporter.success("Successful transaction (".concat(_receipt.transactionHash, ")"));
            _context.next = 36;
            break;

          case 33:
            _context.prev = 33;
            _context.t0 = _context["catch"](26);
            reporter.error("".concat(_context.t0, "\nTransaction failed (").concat(receipt.transactionHash, ")"));

          case 36:
            process.exit(); // reporter.debug(JSON.stringify(receipt))

          case 37:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[26, 33]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();