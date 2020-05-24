module.exports = function (env, argv) {
    return {
        entry: __dirname + "/main.ts",
        mode: env.production ? 'production' : 'development',
        output: {
            path: env.production ? __dirname + "/npm/JS" : __dirname + "/output",
            filename: "virtual-container.js",
            library: 'Cyz',
            libraryTarget: env.production ? 'umd' : 'window'
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