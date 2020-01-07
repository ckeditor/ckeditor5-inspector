/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

module.exports = ( { options } ) => {
	return {
		plugins: {
			'postcss-nesting': true,
			'cssnano': options.cssnano
		},
		sourceMap: 'inline'
	};
};
