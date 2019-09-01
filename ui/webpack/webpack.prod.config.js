const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const config = require('./webpack.common.config');

config.mode = 'production';
config.output.publicPath = '';

const babelOptions = {
  cacheDirectory: true,
  babelrc: false,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: 'last 2 versions',
        },
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'react-hot-loader/babel',
  ],
};

config.module.rules = config.module.rules.concat([
  {
    test: /\.ts(x?)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: babelOptions,
      },
      {
        loader: 'ts-loader',
      },
    ],
  }
]);

config.plugins = config.plugins.concat([
  new OptimizeCSSAssetsPlugin({}),
  new HtmlWebpackPlugin({
    inject: false,
    template: require('html-webpack-template'),
    filename: '../index.template',
    title: 'Boilerplate app',
    appMountId: 'root'
  }),
]);

module.exports = config;
