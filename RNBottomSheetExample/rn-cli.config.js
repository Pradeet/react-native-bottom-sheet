const path = require('path');
const blacklist = require('metro').createBlacklist; // eslint-disable-line import/no-extraneous-dependencies
const escape = require('escape-string-regexp'); // eslint-disable-line import/no-extraneous-dependencies
const pkg = require('../package');

const modules = Object.keys({ ...pkg.peerDependencies, ...pkg.dependencies });

console.log('my rn-cli.config', modules); // eslint-disable-line no-console
module.exports = {
  resolver: {
    providesModuleNodeModules: ['@babel/runtime', ...modules],
    extraNodeModules: ['@babel/runtime', ...modules],
    blacklistRE: blacklist(modules.map(function (module) { // eslint-disable-line prefer-arrow-callback, func-names
      return new RegExp(`^${escape(path.resolve(__dirname, '..', 'node_modules', module))}\\/.*$`);
    }))
  },
  projectRoot: __dirname,
  watchFolders: [path.resolve(__dirname, '..')],
};
