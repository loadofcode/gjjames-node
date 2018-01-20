const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
// const tns = require('tiny-slider/src/tiny-slider');
// import { tns } from "node_modules/tiny-slider/src/tiny-slider.module.js"
// import { tns } from 'tiny-slider/src/tiny-slider';


const javascript = {
    test: /\.(js)$/,
    use: [{
        loader: 'babel-loader',
        options: { presets: ['env'] }
    }],
};

/*
  postCSS loader which gets fed into the next loader.
*/

const postcss = {
    loader: 'postcss-loader',
    options: {
        sourceMap: 'inline',
        plugins() { return [autoprefixer({ browsers: 'last 3 versions' })]; }
    }
};

// this is our sass/css loader. It handles files that are require('something.scss')
const styles = {
    test: /\.(scss)$/,
    use: ExtractTextPlugin.extract(['css-loader?sourceMap', postcss, 'sass-loader?sourceMap'])
};

// We can also use plugins - this one will compress the crap out of our JS
const uglify = new webpack.optimize.UglifyJsPlugin({ // eslint-disable-line
    compress: { warnings: false }
});

const config = {
    entry: {
        App: './public/javascripts/gjjames-app.js'
    },
    // we're using sourcemaps
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'public', 'dist'),
        filename: '[name].bundle.js'
    },

    module: {
        loaders: [{
            loader: "babel-loader",
            query: {
                presets: ["es2015"],
            }
        }],
        rules: [javascript, styles]
    },
    // here we pass an array of plugins - uncomment if you want to uglify
    // plugins: [uglify]
    plugins: [
        new ExtractTextPlugin('style.css'),
    ]
};
// stop webpack moaning about deprecated module
process.noDeprecation = true;

module.exports = config;