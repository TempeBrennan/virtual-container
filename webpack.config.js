module.exports = {
    entry: __dirname + "/main.ts",
    mode: 'development',
    output: {
        path: __dirname + "/output",
        filename: "bundle.js",
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader'
                }
            }
        ]
    },
    devtool: 'none'
}