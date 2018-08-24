"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("regenerator-runtime/runtime");

require("core-js/modules/es6.regexp.split");

require("core-js/modules/es6.function.name");

require("core-js/modules/es7.array.includes");

require("core-js/modules/es6.string.includes");

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var _require = require('util'),
    promisify = _require.promisify;

var clone = promisify(require('git-clone'));

var TaskList = require('listr');

var execa = require('execa');

var path = require('path');

var fs = require('fs-extra');

var _require2 = require('../util'),
    installDeps = _require2.installDeps;

var defaultAPMName = require('../helpers/default-apm');

exports.command = 'init <name> [template]';
exports.describe = 'Initialise a new application';

exports.builder = function (yargs) {
  return yargs.positional('name', {
    description: 'The application name (appname.aragonpm.eth)'
  }).option('cwd', {
    description: 'The current working directory',
    default: process.cwd()
  }).positional('template', {
    description: 'The template to scaffold from',
    default: 'react',
    coerce: function resolveTemplateName(tmpl) {
      var aliases = {
        bare: 'aragon/aragon-bare-boilerplate',
        react: 'aragon/aragon-react-boilerplate'
      };

      if (!tmpl.includes('/')) {
        if (!aliases[tmpl]) {
          throw new Error("No template named ".concat(tmpl, " exists"));
        }

        tmpl = aliases[tmpl];
      }

      return "https://github.com/".concat(tmpl);
    }
  });
};

exports.handler = function (_ref) {
  var reporter = _ref.reporter,
      name = _ref.name,
      template = _ref.template;
  name = defaultAPMName(name);
  var basename = name.split('.')[0];
  var tasks = new TaskList([{
    title: 'Checking project existence',
    task: function () {
      var _task2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(ctx, _task) {
        var projectPath, exists;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                projectPath = path.resolve(process.cwd(), basename);
                _context.next = 3;
                return fs.pathExists(projectPath);

              case 3:
                exists = _context.sent;

                if (!exists) {
                  _context.next = 6;
                  break;
                }

                throw new Error("Couldn't initialize project. Project with name ".concat(basename, " already exists in ").concat(projectPath, ". Use different <name> or rename existing project folder."));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function task(_x, _x2) {
        return _task2.apply(this, arguments);
      };
    }()
  }, {
    title: 'Clone template',
    task: function () {
      var _task4 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(ctx, _task3) {
        var repo;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _task3.output = "Cloning ".concat(template, " into ").concat(basename, "...");
                _context2.next = 3;
                return clone(template, basename, {
                  shallow: true
                });

              case 3:
                repo = _context2.sent;

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function task(_x3, _x4) {
        return _task4.apply(this, arguments);
      };
    }()
  }, {
    title: 'Preparing template',
    task: function () {
      var _task6 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(ctx, _task5) {
        var arappPath, arapp, gitFolderPath;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // Set `appName` in arapp
                arappPath = path.resolve(basename, 'arapp.json');
                _context3.next = 3;
                return fs.readJson(arappPath);

              case 3:
                arapp = _context3.sent;
                arapp.appName = name; // Delete .git folder

                gitFolderPath = path.resolve(basename, '.git');
                return _context3.abrupt("return", Promise.all([fs.writeJson(arappPath, arapp, {
                  spaces: 2
                }), fs.remove(gitFolderPath)]));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function task(_x5, _x6) {
        return _task6.apply(this, arguments);
      };
    }()
  }, {
    title: 'Install package dependencies',
    task: function () {
      var _task8 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(ctx, _task7) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return installDeps(basename, _task7);

              case 2:
                return _context4.abrupt("return", _context4.sent);

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function task(_x7, _x8) {
        return _task8.apply(this, arguments);
      };
    }()
  }]);
  return tasks.run().then(function () {
    return reporter.success("Created new application ".concat(name, " in ").concat(basename));
  });
};