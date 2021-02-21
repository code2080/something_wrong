const path = require('path');


module.exports = {
  stories: ["../src/**/*.story.@(tsx|jsx|js|ts)"],
  addons: [],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, '../src/'),
    });
    config.resolve.extensions.push(".js", ".jsx", ".ts", ".tsx");
    return config;
  }
};
