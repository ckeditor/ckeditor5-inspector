/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export function stringify( value, quotesAroundText = true ) {
	if ( value === undefined ) {
		return 'undefined';
	}

	const stringified = JSON.stringify( value );

	// Note: Remove leading and trailing quotes (") from the output. By default it is:
	//
	//		JSON.stringify( 'foo' ) => '"foo"'
	//		JSON.stringify( true ) => '"true"'
	//		JSON.stringify( {} ) => '{}'
	//		JSON.stringify( [] ) => '[]'
	//
	// What should be returned:
	//
	//		stringify( 'foo' ) => 'foo'
	//		stringify( true ) => 'true'
	//		stringify( {} ) => '{}'
	//		stringify( [] ) => '[]'
	//
	if ( !quotesAroundText ) {
		return stringified.replace( /(^"|"$)/g, '' );
	}

	return stringified;
}
