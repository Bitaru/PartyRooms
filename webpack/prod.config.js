const path = require('path');
const webpack = require('webpack');
const customPath = path.join(__dirname, './customPublicPath');
const postcss = require('./postcss');
const config = require('../config.json');

module.exports = {
  entry: {
    popup: [customPath, path.join(__dirname, '../chrome/extension/popup')],
    background: [customPath, path.join(__dirname, '../chrome/extension/background')]
  },
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.optimize.DedupePlugin(),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      SETTINGS: JSON.stringify(config),
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  postcss,
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      loaders: [
        'style',
        'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss'
      ]
    }]
  }
};
