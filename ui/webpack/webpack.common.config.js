/* global require, process*/
const path = require('path');
const webpack = require('webpack');
const jsonImporter = require('node-sass-json-importer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  target: 'web',
  devtool: 'source-map',
  entry: {
    app: ['@babel/polyfill', './src/main.tsx'],
  },
  output: {
    path: path.resolve('./build/resources/static'),
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  optimization: {
    namedModules: true,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'tslint-loader',
            options: {
              formatter: 'stylish'
            },
          }
        ],
      },
      {
        test: /\.css/,
        include: /src/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              // localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          }
        ],
      },
      {
        test: /\.scss/,
        include: /src/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              // localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['./node_modules/'],
              importer: jsonImporter,
            },
          }
        ],
      },
      {
        test: /\.css/,
        exclude: /src/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          }
        ]
      },
      {
        test: /\.scss/,
        exclude: /src/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              importer: jsonImporter,
            },
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048
            },
          },
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [
      'node_modules',
      path.resolve('./src')
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': `"${process.env.NODE_ENV}"`
      },
      __DEV__: devMode
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
  ]
};
