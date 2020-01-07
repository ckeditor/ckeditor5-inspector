/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export function stringify( value, quotesAroundText = true ) {
	if ( value === undefined ) {
		return 'undefined';
	}

	if ( typeof value === 'function' ) {
		return 'function() {…}';
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

export function uid() {
	return Math.random().toString( 36 ).substring( 7 );
}

export function stringifyPropertyList( list ) {
	return list.map( ( [ name, value ] ) => {
		if ( typeof name === 'symbol' ) {
			name = name.toString();
		}

		return [ name, stringify( value ) ];
	} );
}

export function truncateString( string, length ) {
	if ( string.length > length ) {
		return string.substr( 0, length ) + `… [${ string.length - length } characters left]`;
	}

	return string;
}
