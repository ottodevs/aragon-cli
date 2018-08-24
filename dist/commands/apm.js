"use strict";

var _require = require('../middleware'),
    manifestMiddleware = _require.manifestMiddleware,
    moduleMiddleware = _require.moduleMiddleware;

var MIDDLEWARES = [manifestMiddleware, moduleMiddleware];
exports.command = 'apm <command>';
exports.describe = 'Publish and manage your APM package';

exports.builder = function (yargs) {
  var cmd = yargs.commandDir('apm_cmds', {
    visit: function visit(cmd) {
      // Add middlewares
      cmd.middlewares = MIDDLEWARES;
      return cmd;
    }
  });
  cmd.demandCommand(1, 'You need to specify a command');
  return cmd;
};