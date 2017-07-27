import path from 'path'
import utils from '../server/utils'
import config from './index'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

export default {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    path: config.build.assetsRoot,
    filename: "bundle.[hash:7].js",
    publicPath: utils.isProduction()
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  module: {
    rules: [
      {
        test: /\.(js|pug)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          fix: true
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(jade|pug)$/,
        use: ["pug-loader"],
        exclude: [/node_modules/]
      },
      {
        test: /\.(gif|svg|png|jpe?g)$/i,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name:  utils.assetsPath('images/[name].[hash:7].[ext]')
            }
          },
          {
            loader: 'image-webpack-loader',
            query: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 4,
              },
              pngquant: {
                quality: '75-90',
                speed: 3
              },
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
