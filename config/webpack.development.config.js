import utils from '../server/utils'
import webpack from 'webpack'
import config from './index'
import merge from 'webpack-merge'
import baseWebpackConfig from './webpack.base.config'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import poststylus from 'poststylus'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import FriendlyErrorsPlugin from 'friendly-errors-webpack-plugin'

// add hot-reload related code to entry chunks
if(typeof baseWebpackConfig.entry !== 'string')
  Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./server/dev-client'].concat(baseWebpackConfig.entry[name])
  })
else
  baseWebpackConfig.entry = ['./server/dev-client', baseWebpackConfig.entry]

export default merge(baseWebpackConfig, {
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
      inject: true,
      favicon: config.build.favicon
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
