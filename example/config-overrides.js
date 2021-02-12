const { override, removeModuleScopePlugin, addBabelPreset, addBabelPlugin } = require('customize-cra');

module.exports = override(
  // addBabelPreset('@babel/preset-react'),
  addBabelPreset('@babel/preset-react'),
  removeModuleScopePlugin()
);