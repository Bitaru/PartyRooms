const cssnext = require('postcss-cssnext');
const postcssFocus = require('postcss-focus');
const postcssReporter = require('postcss-reporter');
const importer = require('postcss-import');
const simpleVars = require('postcss-simple-vars');
const lost = require('lost');
const nested = require('postcss-nested');
const position = require('postcss-position');
const clearfix = require('postcss-clearfix');

module.exports = function (bundler) {
  return [
    importer({
      addDependencyTo: bundler
    }),
    simpleVars(),
    postcssFocus(),
    clearfix(),
    cssnext({
      browsers: ['last 2 versions', 'IE > 10'] // ...based on this browser list
    }),
    position(),
    nested(),
    lost(),
    postcssReporter({
      clearMessages: true
    })
  ];
}
