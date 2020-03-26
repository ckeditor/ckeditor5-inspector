/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

const versionUtils = require( '@ckeditor/ckeditor5-dev-env/lib/release-tools/utils/versions' );
const TerserPlugin = require( 'terser-webpack-plugin' );
const webpack = require( 'webpack' );
const path = require( 'path' );

module.exports = ( env, argv ) => {
	const devMode = argv.mode === 'development';

	return {
		mode: argv.mode || 'production',
		entry: path.resolve( __dirname, 'src', 'ckeditorinspector.js' ),
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
					query: {
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
					test: /\.css$/,
					loaders: [
						'style-loader',
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
								config: {
									ctx: {
										cssnano: !devMode
									}
								}
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
			library: 'CKEditorInspector',
			filename: 'inspector.js',
			libraryTarget: 'umd',
			libraryExport: 'default'
		},
		plugins: [
			new webpack.DefinePlugin( {
				CKEDITOR_INSPECTOR_VERSION: JSON.stringify( versionUtils.getLastFromChangelog() )
			} )
		]
	};
};
