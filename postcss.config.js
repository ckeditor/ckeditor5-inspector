/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

module.exports = ( { options } ) => {
	return {
		plugins: {
			'postcss-nesting': true,
			'cssnano': options.cssnano
		},
		sourceMap: 'inline'
	};
};
