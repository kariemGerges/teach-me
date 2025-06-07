// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');
const config = getDefaultConfig(__dirname);

// allow Metro to load Firebase’s .cjs files
config.resolver.sourceExts.push('cjs');
// disable package-exports so Auth’s internals get picked up
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
