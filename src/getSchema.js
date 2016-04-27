import objectAssignDeep from 'object-assign-deep';
import { transform } from 'babel-core';
import hook from 'node-hook';
import { babelTransformNamespacedNames, babelTransformConditionalExpressions } from 'jsxquery';
import transformCommonJsPlugin from 'babel-plugin-transform-es2015-modules-commonjs';
import flatMap from 'lodash.flatMap'

function isNotTransformCommonJsPlugin(plugin) {
  return plugin !== 'transform-es2015-modules-commonjs'
    && plugin[0] !== 'transform-es2015-modules-commonjs'
    && plugin !== transformCommonJsPlugin
}

function toPlugins(presetValue) {
  const preset = typeof presetValue === 'string'
    ? require('babel-preset-' + presetValue)
    : presetValue;

  return (preset.plugins || []).concat(preset.presets ? flatMap(preset.presets, toPlugins) : []);
}

function onlyPlugins({ presets, plugins }) {
  return (plugins || []).concat(flatMap(presets || [], toPlugins));
}

export default function getSchema(path, extraBabelOptions = {}) {
  const givenPlugins = (extraBabelOptions.plugins || []).concat(flatMap(extraBabelOptions.presets || [], toPlugins))
  const babelOptions = {
    plugins: [
      ['transform-es2015-modules-commonjs-simple', { noMangle: true }],
      babelTransformNamespacedNames,
      babelTransformConditionalExpressions,
      ['transform-react-jsx', { pragma: 'jsxQuery.createElement' }]
    ].concat(givenPlugins.filter(isNotTransformCommonJsPlugin)),
  };

  hook.hook('.jsx', (source, filename) => transform(source, babelOptions).code);
  const result = require(path);
  hook.unhook('.jsx');
  return result;
}