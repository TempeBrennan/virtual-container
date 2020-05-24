module.exports = function (env, argv) {
    return {
        entry: __dirname + "/main.ts",
        mode: env.production ? 'production' : 'development',
        output: {
            path: __dirname + "/output",
            filename: "bundle.js",
            library: 'Cyz',
            libraryTarget: env.production ? 'window' : 'window'
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
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
            ]
        },
        devtool: env.production ? 'none' : 'sourcemap'
    };
}