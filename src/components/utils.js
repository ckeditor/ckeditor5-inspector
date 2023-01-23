/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { stringify as javascriptStringify } from 'javascript-stringify';

export function stringify( value, quotesAroundText = true ) {
	if ( value === undefined ) {
		return 'undefined';
	}

	if ( typeof value === 'function' ) {
		return 'function() {…}';
	}

	const stringified = javascriptStringify( value, stringifySingleToDoubleQuotesReplacer, null, {
		// https://github.com/ckeditor/ckeditor5-inspector/issues/98
		// https://github.com/ckeditor/ckeditor5-inspector/issues/129
		maxDepth: 2
	} );

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

export function uid() {
	return Math.random().toString( 36 ).substring( 7 );
}

export function stringifyPropertyList( list ) {
	const stringified = {};

	for ( const name in list ) {
		stringified[ name ] = list[ name ];
		stringified[ name ].value = stringify( stringified[ name ].value );
	}

	return stringified;
}

export function truncateString( string, length ) {
	if ( string.length > length ) {
		return string.substr( 0, length ) + `… [${ string.length - length } characters left]`;
	}

	return string;
}

// Unlike JSON.stringify(), javascript-stringify returns single quotes around text.
// Retain the JSON.stringify() formatting instead of fixing 100 tests across the project :)
function stringifySingleToDoubleQuotesReplacer( value, indent, stringify ) {
	if ( typeof value === 'string' ) {
		return `"${ value.replace( '\'', '"' ) }"`;
	}

	return stringify( value );
}
