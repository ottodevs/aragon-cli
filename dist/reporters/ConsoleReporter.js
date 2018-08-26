"use strict";

require("core-js/modules/es6.object.define-property");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var chalk = require('chalk');

var figures = require('figures');

module.exports =
/*#__PURE__*/
function () {
  function ConsoleReporter() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      silent: false
    };

    _classCallCheck(this, ConsoleReporter);

    this.silent = opts.silent;
  }

  _createClass(ConsoleReporter, [{
    key: "message",
    value: function message() {
      var category = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'info';

      var _message = arguments.length > 1 ? arguments[1] : undefined;

      if (this.silent) return;
      var color = {
        debug: 'magenta',
        info: 'blue',
        warning: 'yellow',
        error: 'red',
        success: 'green'
      }[category];
      var symbol = {
        debug: figures.pointer,
        info: figures.info,
        warning: figures.warning,
        error: figures.cross,
        success: figures.tick
      }[category];
      var icon = chalk[color](symbol);
      console.log(" ".concat(icon, " ").concat(_message));
    }
  }, {
    key: "debug",
    value: function debug(message) {
      if (process.env.DEBUG) this.message('debug', message);
    }
  }, {
    key: "info",
    value: function info(message) {
      this.message('info', message);
    }
  }, {
    key: "warning",
    value: function warning(message) {
      this.message('warning', message);
    }
  }, {
    key: "error",
    value: function error(message) {
      this.message('error', message);
    }
  }, {
    key: "success",
    value: function success(message) {
      this.message('success', message);
    }
  }]);

  return ConsoleReporter;
}();