const path = require('path');


module.exports = {
  stories: ["../src/**/*.stories.@(tsx|jsx|js|ts)"],
  // Add any Storybook addons you want here: https://storybook.js.org/addons/
  addons: ['@storybook/preset-scss'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, '../src/'),
    })
    return config;
  }

  //   config.module.rules.push({
  //     test: /\.([jt]s|[jt]sx)$/,
  //     loader: require.resolve("babel-loader"),
  //     options: {
  //       presets: [["react-app", { flow: false, typescript: true }]]
  //     }
  //   });
  //   config.resolve.extensions.push(".js", ".jsx", ".ts", ".tsx");

  // }
};
