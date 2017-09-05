const packageInfo = require('./package.json');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const root = './src';

const entries = _.fromPairs(_.map(
    _.filter(fs.readdirSync(root), function(name) {return !_.endsWith(name, '.ts')}),
    (mod) => [path.basename(mod) + '/index', path.resolve(path.join(root, mod, 'index.ts'))]
));
entries['index'] = path.resolve(path.join(root, 'index.ts'));

module.exports = {
    entry: entries,
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        library: [packageInfo.name + '[name]'],
        libraryTarget: 'umd',
        publicPath: '/dist'
    },
    externals: _.keys(packageInfo.dependencies),
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: './tsconfig.json'
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                enforce: 'pre'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'fast-sass-loader',
                        options: {
                            includePaths: [
                                path.resolve('./node_modules'),
                                path.resolve('./assets/style')
                            ]
                        }
                    },
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ],
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'application/font-woff'
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|jpg|png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    { loader: 'file-loader' }
                ]
            },
            {
                test: /\.svg/,
                use: [
                    { loader: 'svg-sprite-loader' }
                ]
            }
        ]
    },
};