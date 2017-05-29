const path = require('path');
const webpack = require('webpack');

const settings = {
    entry: {
        controller_bundle: [
            "react-hot-loader/patch",
            "./src/controller/index.js"
        ],
        game_bundle: [
            "./src/game/index.js"
        ]
    },
    output: {
        filename: "[name].js",
        publicPath: "/",
        path: path.resolve("build")
    },
    //debug: true,
    devtool: 'inline-source-map',
    resolve: {
        extensions: [".js", ".json", ".css"]
    },
    //devtool: "eval-source-map",
    module: {
        rules: [{
                test: /\.js?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ["es2015", {
                            modules: false
                        }],
                        "stage-2",
                        "react"
                    ],
                    plugins: [
                        "transform-node-env-inline"
                    ],
                    env: {
                        development: {
                            plugins: ["react-hot-loader/babel"]
                        }
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            sourceMap: true,
                            importLoaders: 1,
                            localIdentName: "[name]--[local]--[hash:base64:8]"
                        }
                    },
                    "postcss-loader" // has separate config, see postcss.config.js nearby
                ]
            },
        ]
    },
    devServer: {
        contentBase: path.resolve("www"),
        publicPath: "0.0.0.0:8080/", // full URL is necessary for Hot Module Replacement if additional path will be added.
        quiet: false,
        hot: true,
        historyApiFallback: true,
        inline: true,
        disableHostCheck: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
    ],
};

module.exports = settings;