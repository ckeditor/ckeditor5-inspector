/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

const versionUtils = require( '@ckeditor/ckeditor5-dev-env/lib/release-tools/utils/versions' );
const webpack = require( 'webpack' );
const path = require( 'path' );

module.exports = ( env, argv ) => {
	const devMode = argv.mode === 'development'

	return {
		entry: path.resolve( __dirname, 'src', 'app.js' ),
		module: {
			rules: [ {
				test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				}, {
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
