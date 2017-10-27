/**General declaration */
const path = require('path');
const webpackMerge = require('webpack-merge');
const helpers = require('./config.helper');
const webpackCommenConfig = require('./webpack.common.config');

/**Webpack plugin objects */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const IgnorePlugin = require('webpack/lib/IgnorePlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const V8LazyParseWebpackPlugin = require('v8-lazy-parse-webpack-plugin');

/**Webpack constant */
const ENV = process.env.ENV = process.env.NODE_ENV = 'testproduction';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8080;
const HMR = false;
const API_URL = process.env.API_URL = 'http://172.20.23.110:99/';

const METADATA = webpackMerge
    (webpackCommenConfig({
        env: ENV
    }).METADATA, {
        env: ENV,
        host: HOST,
        port: PORT,
        hmr: HMR,
        api: API_URL
    });

/**Webpack configurations */
module.exports = function (options) {
    return webpackMerge(webpackCommenConfig({ env: ENV }), {
        /** Developer tool to enhance debugging
         * eval - Each module is executed with eval and //@ sourceURL.
         * source-map - A SourceMap is emitted. See also output.sourceMapFilename.
         * hidden-source-map - Same as source-map, but doesn’t add a reference comment to the bundle.
         * inline-source-map - A SourceMap is added as DataUrl to the JavaScript file.
         * eval-source-map - Each module is executed with eval and a SourceMap is added as DataUrl to the eval.
         * cheap-source-map - A SourceMap without column-mappings. SourceMaps from loaders are not used.
         * cheap-module-source-map - A SourceMap without column-mappings. SourceMaps from loaders are simplified to a single mapping per line.
         * 
         * See: http://webpack.github.io/docs/configuration.html#devtool
         * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
         */
        devtool: 'source-map',

        /* Options affecting the output of the compilation.
        * See: http://webpack.github.io/docs/configuration.html#output
        */
        output: {
            /* The output directory as absolute path (required).
            * See: http://webpack.github.io/docs/configuration.html#output-path
            */
            path: helpers.root('dist'),

            /** Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             * See: http://webpack.github.io/docs/configuration.html#output-filename
             */
            filename: '[name].[chunkhash].bundle.js',

            /** The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
             */
            sourceMapFilename: '[name].[chunkhash].bundle.map',

            /** The filename of non-entry chunks as relative path
             * inside the output.path directory.
             * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
             */
            chunkFilename: '[id].[chunkhash].chunk.js',
        },
        module: {
            rules: [
                /** css loader support for *.css files (styles directory only)
                 * Loads external css styles into the DOM, supports HMR
                 */
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({
                        fallbackLoader: 'style-loader',
                        loader: 'css-loader'
                    }),
                    include: [helpers.root('src', 'styles')]
                },

                /**sass loader support for *.scss files (styles directory only)
                 * Loads external sass styles into the DOM, supports HMR
                 */
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract({
                        fallbackLoader: 'style-loader',
                        loader: 'css-loader!sass-loader'
                    }),
                    include: [helpers.root('src', 'styles')]
                },
            ]
        },
        plugins: [
            /** Plugin: ExtractTextPlugin
             * Description: Extracts imported CSS files into external stylesheet 
             * See: https://github.com/webpack/extract-text-webpack-plugin
             */
            new ExtractTextPlugin('[name].[contenthash].css'),

            /** Plugin: WebpackMd5Hash
             * Description: Plugin to replace a standard webpack chunkhash with md5.
             * See: https://www.npmjs.com/package/webpack-md5-hash
             */
            new WebpackMd5Hash(),

            /** Plugin: DefinePlugin
             * Description: Define free variables.
             * Useful for having development builds with debug logging or adding global constants.
             *
             * Environment helpers
             * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             */
            // NOTE: when adding more properties make sure you include them in custom-typings.d.ts

            new DefinePlugin({
                'ENV': JSON.stringify(ENV),
                'HMR': JSON.stringify(HMR),
                'API_URL': JSON.stringify(API_URL),
                'process.env': {
                    'ENV': JSON.stringify(ENV),
                    'NODE_ENV': JSON.stringify(ENV),
                    'HMR': JSON.stringify(HMR),
                    'API_URL': JSON.stringify(API_URL)
                }
            }),

            /** Plugin: UglifyJsPlugin
             * Description: Minimize all JavaScript output of chunks.
             * Loaders are switched into minimizing mode.
             * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
             */
            new UglifyJsPlugin({
                ie8: false,
                ecma: 8,
                output: {
                    comments: false,
                    beautify: false
                },
                mangle: false,
                // mangle: {
                //     screw_ie8: true
                // },
                compress: {
                    // screw_ie8: true,
                    keep_fnames: true,
                    warnings: false,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    // join_vars: true,
                    negate_iife: false // we need this for lazy v8
                }
            }),

            /** Plugin: NormalModuleReplacementPlugin
             * Description: Replace resources that matches resourceRegExp with newResource
             * See: http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
             */
            new NormalModuleReplacementPlugin(
                /angular2-hmr/,
                helpers.root('config/empty.js')
            ),

            new NormalModuleReplacementPlugin(
                /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
                helpers.root('config/empty.js')
            ),

            /** Plugin LoaderOptionsPlugin (experimental)
             * See: https://gist.github.com/sokra/27b24881210b56bbaff7
             */
            new LoaderOptionsPlugin({
                minimize: true,
                debug: false,
                options: {
                    context: helpers.root('src'),
                    output: {
                        path: helpers.root('dist')
                    },
                    /**
                     * Static analysis linter for TypeScript advanced options configuration
                     * Description: An extensible linter for the TypeScript language.
                     * See: https://github.com/wbuchwalter/tslint-loader
                     */
                    tslint: {
                        emitErrors: true,
                        failOnHint: true,
                        resourcePath: 'src'
                    },
                    /**
                     * Html loader advanced options
                     * See: https://github.com/webpack/html-loader#advanced-options
                     */
                    // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
                    htmlLoader: {
                        minimize: true,
                        removeAttributeQuotes: false,
                        caseSensitive: true,
                        customAttrSurround: [
                            [/#/, /(?:)/],
                            [/\*/, /(?:)/],
                            [/\[?\(?/, /(?:)/]
                        ],
                        customAttrAssign: [/\)?\]?=/]
                    },
                }
            }),
        ],
        /**Include polyfills or mocks for various node stuff
         * Description: Node configuration
         * See: https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    });
};