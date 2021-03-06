#!/usr/bin/env node
"use strict";

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.set");

var _require = require('./middleware'),
    manifestMiddleware = _require.manifestMiddleware,
    moduleMiddleware = _require.moduleMiddleware;

var _require2 = require('./util'),
    findProjectRoot = _require2.findProjectRoot;

var ConsoleReporter = require('./reporters/ConsoleReporter');

var fs = require('fs');

var Web3 = require('web3');

var _require3 = require('./helpers/truffle-config'),
    getTruffleConfig = _require3.getTruffleConfig,
    getENSAddress = _require3.getENSAddress;

var url = require('url');

var MIDDLEWARES = [manifestMiddleware, moduleMiddleware]; // Set up commands

var cmd = require('yargs').commandDir('./commands', {
  visit: function visit(cmd) {
    // Add middlewares
    cmd.middlewares = MIDDLEWARES;
    return cmd;
  }
}); //.strict()


cmd.alias('h', 'help');
cmd.alias('v', 'version'); // Configure CLI behaviour

cmd.demandCommand(1, 'You need to specify a command'); // Set global options

cmd.option('silent', {
  description: 'Silence output to terminal',
  default: false
});
cmd.option('cwd', {
  description: 'The project working directory',
  default: function _default() {
    try {
      return findProjectRoot();
    } catch (_) {
      return process.cwd();
    }
  }
});
/*
  yargs will coerce this function multiple times while executing one command for unknown
  reasons. When a positional optional argument is present, it will go as far as coercing the
  default network, causing a crash in case the default network is not defined, even if explicitely
  specifying another network.

  caching the network also helps performance as we don't need to reinitialize the web3 provider
*/

var cachedNetwork; // Ethereum

cmd.option('network', {
  description: 'The network in your truffle.js that you want to use',
  default: 'development',
  coerce: function coerce(network) {
    if (cachedNetwork) {
      return cachedNetwork;
    } // Catch commands that dont require network and return


    var skipNetworkSubcommands = new Set(['version']); // 'aragon apm version'

    if (process.argv.length >= 4) {
      if (skipNetworkSubcommands.has(process.argv[3])) {
        return {};
      }
    }

    var skipNetworkCommands = new Set(['init', 'devchain', 'ipfs']);

    if (process.argv.length >= 3) {
      if (skipNetworkCommands.has(process.argv[2])) {
        return {};
      }
    }

    var truffleConfig = getTruffleConfig();
    var truffleNetwork = truffleConfig.networks[network];

    if (!truffleNetwork) {
      throw new Error("aragon <command> requires a network '".concat(network, "' in your truffle.js. For an example, see http://truffleframework.com/docs/advanced/configuration"));
    }

    var provider;

    if (truffleNetwork.provider) {
      provider = truffleNetwork.provider;
    } else if (truffleNetwork.host && truffleNetwork.port) {
      provider = new Web3.providers.WebsocketProvider("ws://".concat(truffleNetwork.host, ":").concat(truffleNetwork.port));
    } else {
      provider = new Web3.providers.HttpProvider("http://localhost:8545");
    }

    truffleNetwork.provider = provider;
    truffleNetwork.name = network;
    cachedNetwork = truffleNetwork;
    return truffleNetwork;
  } // conflicts: 'init'

}); // APM

cmd.option('apm.ens-registry', {
  description: 'Address of the ENS registry',
  default: require('@aragon/aragen').ens
});
cmd.group(['apm.ens-registry', 'eth-rpc'], 'APM:');
cmd.option('apm.ipfs.rpc', {
  description: 'An URI to the IPFS node used to publish files',
  default: 'http://localhost:5001#default'
});
cmd.group('apm.ipfs.rpc', 'APM providers:');
cmd.option('apm', {
  coerce: function coerce(apm) {
    if (apm.ipfs && apm.ipfs.rpc) {
      var uri = url.parse(apm.ipfs.rpc);
      apm.ipfs.rpc = {
        protocol: uri.protocol.replace(':', ''),
        host: uri.hostname,
        port: parseInt(uri.port)
      };

      if (uri.hash === '#default') {
        apm.ipfs.rpc.default = true;
      }
    }

    return apm;
  }
}); // Add epilogue

cmd.epilogue('For more information, check out https://hack.aragon.one'); // Run

var reporter = new ConsoleReporter();
reporter.debug(JSON.stringify(process.argv));
cmd.fail(function (msg, err, yargs) {
  if (!err) yargs.showHelp();
  reporter.error(msg || err.message || 'An error occurred');
  reporter.debug(err && err.stack);
}).parse(process.argv.slice(2), {
  reporter: reporter
});