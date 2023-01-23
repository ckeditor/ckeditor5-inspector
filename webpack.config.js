/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

const { getLastFromChangelog } = require( '@ckeditor/ckeditor5-dev-release-tools' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const webpack = require( 'webpack' );
const path = require( 'path' );

const LIBRARY_TO_FILE_NAMES = {
	CKEditorInspector: 'inspector.js',
	MiniCKEditorInspector: 'miniinspector.js'
};

module.exports = ( env, argv ) => {
	const devMode = argv.mode === 'development';

	return {
		mode: argv.mode || 'production',
		entry: {
			CKEditorInspector: path.resolve( __dirname, 'src', 'ckeditorinspector.js' ),
			MiniCKEditorInspector: path.resolve( __dirname, 'src', 'minickeditorinspector.js' )
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					options: {
						presets: [
							[
								'@babel/react',
								{
									development: devMode
								}
							]
						],
						plugins: []
					}
				},
				{
					test: /\.css$/,
					use: [
						{
							loader: 'style-loader',
							options: {
								injectType: devMode ? 'styleTag' : 'singletonStyleTag',
								attributes: {
									'data-cke-inspector': true
								}
							}
						},
						{
							loader: 'css-loader',
							options: {
								importLoaders: 1,
								sourceMap: devMode
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								sourceMap: devMode,
								postcssOptions: {
									ctx: {
										cssnano: !devMode
									}
								}
							}
						}
					]
				},
				{
					test: /\.svg$/,
					use: [
						{
							loader: 'babel-loader',
							options: {
								presets: [
									[
										'@babel/react',
										{
											development: devMode
										}
									]
								]
							}
						},
						{
							loader: 'react-svg-loader',
							options: {
								jsx: true
							}
						}
					]
				}
			]
		},
		optimization: {
			minimize: !devMode,
			minimizer: [ new TerserPlugin() ]
		},
		output: {
			path: path.resolve( __dirname, 'build' ),
			library: '[name]',
			filename: data => LIBRARY_TO_FILE_NAMES[ data.chunk.name ],
			libraryTarget: 'umd',
			libraryExport: 'default'
		},
		plugins: [
			new webpack.DefinePlugin( {
				CKEDITOR_INSPECTOR_VERSION: JSON.stringify( getLastFromChangelog() )
			} )
		]
	};
};
