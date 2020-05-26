const CopyPlugin = require('copy-webpack-plugin');

const baseConfig = require('./webpack.base');

const prodConfig = Object.assign(baseConfig, {
    mode: 'production',
    output: Object.assign(baseConfig.output, {
        path: __dirname + "/npm/JS",
        libraryTarget: 'umd',
    }),
    devtool: 'none',
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: __dirname + '/README.md', to: __dirname + '/npm/README.md' },
            ],
        }),
    ]
});

module.exports = prodConfig;