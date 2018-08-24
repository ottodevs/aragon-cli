"use strict";

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

module.exports = function (web3) {
  var getACL =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(
    /*#__PURE__*/
    regeneratorRuntime.mark(function _callee(repoAddr) {
      var repo, daoAddr, dao, aclAddr;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              repo = new web3.eth.Contract(require('@aragon/os/build/contracts/AragonApp').abi, repoAddr);
              _context.next = 3;
              return repo.methods.kernel().call();

            case 3:
              daoAddr = _context.sent;
              dao = new web3.eth.Contract(require('@aragon/os/build/contracts/Kernel').abi, daoAddr);
              _context.next = 7;
              return dao.methods.acl().call();

            case 7:
              aclAddr = _context.sent;
              return _context.abrupt("return", new web3.eth.Contract(require('@aragon/os/build/contracts/ACL').abi, aclAddr));

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function getACL(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  return {
    grant: function () {
      var _grant = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(repoAddr, grantee) {
        var acl, roleId, call;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return getACL(repoAddr);

              case 2:
                acl = _context2.sent;
                roleId = '0x0000000000000000000000000000000000000000000000000000000000000001';
                call = acl.methods.grantPermission(grantee, repoAddr, roleId);
                return _context2.abrupt("return", {
                  to: acl.options.address,
                  data: call.encodeABI(),
                  gas: web3.utils.toHex(5e5),
                  gasPrice: web3.utils.toHex(web3.utils.toWei('15', 'gwei'))
                });

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function grant(_x2, _x3) {
        return _grant.apply(this, arguments);
      };
    }()
  };
};