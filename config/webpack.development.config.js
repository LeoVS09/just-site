var utils = require('../server/utils')
var webpack = require('webpack')
var config = require('./index')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.config')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var poststylus = require('poststylus')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./server/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                context: '/'
              }
            },
            'stylus-loader'
            // TODO: add stylint and stylefmt
            //{ loader: 'stylefmt-loader', options: { config: config.dev.stylintConfig } }
          ]
        })
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        })
      }
    ]
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      title: config.build.titles.index,
      filename: 'index.html',
      template: './src/' + config.build.templates.index,
      inject: true
    }),
    new ExtractTextPlugin({
      filename: utils.assetsPath('styles/[name].[contenthash].css')
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        stylus: {
          use: [poststylus(['autoprefixer'])]
        }
      }
    }),
    new FriendlyErrorsPlugin()
  ]
})
