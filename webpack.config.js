'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: '[name].bundle.[contenthash].css',
});

const config = {
    // точка входа для процесса сборки
    entry: {
        main: path.resolve(__dirname, 'src', 'main.js')
    },
    // указываем паблик-директорию для результата сборки
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[hash].js'
    },
    module: {
        rules: [
        {
            test: /\.(html)$/,
            use: [
                
                {
                    loader: 'html-loader',
                    options: {
                    
                        interpolate: true
                    }
                }
            ]
        },
        {
            test: /\.js$/, // как обрабатывать исходные js-файлы
            include: path.resolve(__dirname, 'src'), // где находятся исходные файлы
            loader: 'babel-loader',
            options: {
                presets: ['env', 'stage-0'] // аналог .babelrc 
            }
        }, 
        {
            test: /\.css$/, // как обрабатывать исходные css-файлы
            include: path.resolve(__dirname, 'src'),
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: 'css-loader'
            })
        },
        {
            test: /\.scss$/,
            exclude: [
                path.resolve(__dirname, 'node_modules'),
            ],
            use: extractSass.extract({
                use: [{
                    loader: 'css-loader',
                    options: { minimize:false }
                }, {
                    loader: 'sass-loader',
                    options: {}
                }],
                fallback: 'style-loader'
            })
        },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    // для сохранения структуры директорий, хранящих изображения
                    context: './src',
                    useRelativePath: true,
                    name: '[name].[ext]'
                }
            }]
        }]
    },
    devtool: 'source-map',
    plugins: [
        extractSass,
        new CleanWebpackPlugin(['dist'], { verbose: true }), 
        new ExtractTextPlugin('bundle.[hash].css'),
        new HtmlWebpackPlugin({
     
            template: path.resolve(__dirname, 'src', 'index.html'),
            filename: 'index.html', // имя
        }),

    ]
}

module.exports = config;