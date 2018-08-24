"use strict";

require("core-js/modules/es6.promise");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.array.filter");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var fs = require('fs');

var _require = require('util'),
    promisify = _require.promisify;

var readFile = promisify(fs.readFile);

var modifiesStateAndIsPublic = function modifiesStateAndIsPublic(declaration) {
  var blacklist = ['internal', 'private', 'view', 'pure']; // space words to ensure they are not part of another word

  return blacklist.filter(function (w) {
    return declaration.indexOf(" ".concat(w, " ")) != -1;
  }).length == 0;
};

var typeOrAddress = function typeOrAddress(type) {
  var types = ['address', 'byte', 'uint', 'int', 'bool']; // check if the type starts with any of the above types, otherwise it is probably
  // a typed contract, so we need to return address for the signature

  return types.filter(function (t) {
    return type.indexOf(t) == 0;
  }).length > 0 ? type : 'address';
}; // extracts function signature from function declaration


var getSignature = function getSignature(declaration) {
  var name = declaration.match(/function ([^]*?)\(/)[0].replace('function ', '');
  var params = declaration.match(/\(([^]*?)\)/)[0].replace('(', '').replace(')', '');

  if (params) {
    // Has parameters
    params = params.replace(/\n/gm, '').replace(/\t/gm, '').split(',').map(function (param) {
      return param.split(' ').filter(function (s) {
        return s.length > 0;
      })[0];
    }).map(function (type) {
      return typeOrAddress(type);
    }).join(',');
  }

  return name + params + ')';
};

var getNotice = function getNotice(declaration) {
  // capture from @notice to either next '* @' or end of comment '*/'
  var notices = declaration.match(/(@notice)([^]*?)(\* @|\*\/)/m);
  if (!notices || notices.length == 0) return null;
  return notices[0].replace('*/', '').replace('* @', '').replace('@notice ', '').replace(/\n/gm, '').replace(/\t/gm, '').split(' ').filter(function (x) {
    return x.length > 0;
  }).join(' ');
}; // extracts required role from function declaration


var getRoles = function getRoles(declaration) {
  var auths = declaration.match(/auth.?\(([^]*?)\)/gm);
  if (!auths) return [];
  return auths.map(function (authStatement) {
    return authStatement.split('(')[1].split(',')[0].split(')')[0];
  });
}; // Takes the path to a solidity file and extracts public function signatures,
// its auth role if any and its notice statement


module.exports =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(sourceCodePath) {
    var sourceCode, funcDecs;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return readFile(sourceCodePath, 'utf8');

          case 2:
            sourceCode = _context.sent;
            // everything between every 'function' and '{' and its @notice
            funcDecs = sourceCode.match(/(@notice|^\s*function)(?:[^]*?){/gm);

            if (funcDecs) {
              _context.next = 6;
              break;
            }

            return _context.abrupt("return", []);

          case 6:
            return _context.abrupt("return", funcDecs.filter(function (dec) {
              return modifiesStateAndIsPublic(dec);
            }).map(function (dec) {
              return {
                sig: getSignature(dec),
                roles: getRoles(dec),
                notice: getNotice(dec)
              };
            }));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();