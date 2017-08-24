const packageInfo = require('./package.json');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');

const basePackageValues = {
    "name": "lime-poney",
    "version": packageInfo.version,
    "main": "./index.js",
};
const versionsPackageFilename = __dirname + "/package.json";
const root = './src/lime-poney';

const entries = _.fromPairs(_.map(
    fs.readdirSync(root),
    (mod) => [path.basename(mod), path.resolve(path.join(root, mod, 'index.ts'))]
));
entries['index'] = _.values(entries);

module.exports = {
    entry: entries,
    output: {
        path: path.join(__dirname, './dist/' + basePackageValues.name),
        filename: '[name].js',
        library: [basePackageValues.name + '/[name]'],
        libraryTarget: 'umd',
        publicPath: '/dist/lib'
    },
    externals: [
        'react',
        'react-dom',
        'lodash',
        'plotly.js',
        '@reactivex/rxjs',
        'react-leaflet',
        'leaflet',
    ],
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
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: './tsconfig.lime-poney.json'
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
                                path.resolve('./src/frontend/assets/style')
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
    plugins: [
        new GeneratePackageJsonPlugin(basePackageValues, versionsPackageFilename)
    ],
};