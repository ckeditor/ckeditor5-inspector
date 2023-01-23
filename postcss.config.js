/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
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
