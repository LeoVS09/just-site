import path from 'path'
import config from '../config'

function isProduction () {
  return process.env.NODE_ENV === 'production'
}
exports.isProduction = isProduction

function isTest () {
  return process.env.NODE_ENV === 'testing'
}
exports.isTest = isTest

exports.assetsPath = function (_path) {
  var assetsSubDirectory = isProduction()
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}
