


const baseConfig = require('./webpack.base');

const devConfig = Object.assign(baseConfig, {
    mode: 'development',
    output: Object.assign(baseConfig.output, {
        path: __dirname + "/output",
        libraryTarget: 'window',
    }),
    devtool: 'sourcemap'
});

module.exports = devConfig;