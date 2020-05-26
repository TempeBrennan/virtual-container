
module.exports = {

    entry: __dirname + "/main.ts",
    output: {
        filename: "virtual-container.js",
        library: 'Cyz',
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
    }
};
