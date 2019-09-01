/* global require*/
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const threadLoader = require('thread-loader');

threadLoader.warmup({}, [
  'babel-loader',
]);

const config = require('./webpack.common.config');

config.mode = 'development';

config.devServer = {
  contentBase: path.resolve('./build/resources/static'),
  port: 3000,
  historyApiFallback: true,
  stats: 'minimal',
  hotOnly: true,
};

config.devtool = 'source-map';

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
    include: /src/,
    // TODO: improve parallelising builds and cache strategy
    use: [
      {
        loader: 'cache-loader',
      },
      {
        loader: 'thread-loader',
        options: {
          // there should be 1 cpu for the fork-ts-checker-webpack-plugin
          workers: require('os').cpus().length - 1,
          poolTimeout: Infinity
        },
      },
      {
        loader: 'babel-loader',
        options: babelOptions,
      },
      {
        loader: 'ts-loader',
        options: {
          happyPackMode: true,
          transpileOnly: true,
        },
      },
    ],
  }
]);

config.plugins = config.plugins.concat([
  new ForkTsCheckerWebpackPlugin({
    measureCompilationTime: true,
    tslint: path.resolve('./tslint.json'),
    useTypescriptIncrementalApi: true,
  }),
  new HtmlWebpackPlugin({
    inject: false,
    template: require('html-webpack-template'),
    title: 'Boilerplate app',
    appMountId: 'root'
  }),
  new CircularDependencyPlugin({
    // exclude detection of files based on a RegExp
    exclude: /node_modules/,
    // add errors to webpack instead of warnings
    failOnError: true,
    // allow import cycles that include an asyncronous import,
    // e.g. via import(/* webpackMode: "weak" */ './file.js')
    allowAsyncCycles: false,
    // set the current working directory for displaying module paths
    cwd: process.cwd(),
  }),
]);

config.resolve.alias = {
  'react-dom': '@hot-loader/react-dom',
};

module.exports = config;
