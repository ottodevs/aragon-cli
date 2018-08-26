"use strict";

var daoArg = require('./dao_cmds/utils/daoArg');

var _require = require('../middleware'),
    manifestMiddleware = _require.manifestMiddleware,
    moduleMiddleware = _require.moduleMiddleware;

var MIDDLEWARES = [manifestMiddleware, moduleMiddleware];
exports.command = 'dao <command>';
exports.describe = 'Manage your Aragon DAO';

exports.builder = function (yargs) {
  if (process.argv[3] != 'new') {
    yargs = daoArg(yargs);
  }

  var cmd = yargs.commandDir('dao_cmds', {
    visit: function visit(cmd) {
      // Add middlewares
      cmd.middlewares = MIDDLEWARES;
      return cmd;
    }
  });
  cmd.demandCommand(1, 'You need to specify a command');
  return cmd;
};