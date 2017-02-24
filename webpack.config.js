var path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    poststylus = require('poststylus');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
                exclude: [/node_modules/, /build/]
            },
            {
                test: /\.jade$/,
                use: ["pug-loader"],
                exclude: [/node_modules/]
            },
            {
                test: /\.styl$/,
                use: [
                    'style-loader',
                    'css-loader?importLoaders=1',
                    'stylus-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({template: './src/index.jade', inject: "head"}),
        new webpack.LoaderOptionsPlugin({
            options: {
                stylus: {
                    use: [poststylus(['autoprefixer'])]
                }
            }
        })
    ]
};