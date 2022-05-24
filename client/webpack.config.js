const path = require('path')
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.jsx'),
    },
    output: {
        path: path.resolve(__dirname, 'webpack_build/'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|jsx|js)$/,
                resolve: {
                    extensions: [".js", ".jsx",],
                },
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    cacheDirectory: true,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false,
                                targets: {
                                    browsers: ['last 2 versions', '> 1%', 'not ie < 11'],
                                    esmodules: true,
                                },
                            },
                        ],
                        ['@babel/preset-react',
                        {"runtime": "automatic"}],
                        // '@babel/preset-typescript',
                    ],
                },
            },
            {
                test: /\.svg$/,
                include: [
                    path.resolve(__dirname, 'src/assets'),
                ],
                use: 'svg-inline-loader',
            },
            {
                test: /\.css$/i,
                exclude: /(node_modules|bower_components)/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    devServer: {
        // contentBase: './webpack_build',
        historyApiFallback: true,
    },
    plugins: [
        new Dotenv({
            path: './.env',
          }),
        new HtmlWebpackPlugin({
            title: 'webpack Boilerplate',
            template: path.resolve(__dirname, 'public/index.html'), // шаблон
            path: path.resolve(__dirname, 'webpack_build'),
            filename: 'index.html', // название выходного файла
        }),
    ],
    mode: 'development',
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, 'src/components/'),
            '@pages': path.resolve(__dirname, 'src/pages/'),
            '@api': path.resolve(__dirname, 'src/apiUrls'),
            '@utils': path.resolve(__dirname, 'src/utils')
        },
    },
}