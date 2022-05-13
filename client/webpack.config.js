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
    },
    module: {
        rules: [           
            {
                test: /\.(ts|tsx|jsx|js)$/,
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
                                }
                            }
                        ],
                        ['@babel/preset-react',
                        {"runtime": "automatic"}]
                        // '@babel/preset-typescript',
                    ]
                }
            },
            {
                test: /\.svg$/,
                include: [
                    path.resolve(__dirname, 'src/assets'),
                ],
                use: 'svg-inline-loader'
            },
            {
                test: /\.css$/i,
                exclude: /(node_modules|bower_components)/,
                use: ["style-loader", "css-loader"],
            }
        ]
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
}