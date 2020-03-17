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
	const stringified = {};

	for ( const name in list ) {
		let keyName = name;

		if ( typeof name === 'symbol' ) {
			keyName = name.toString();
		}

		stringified[ keyName ] = list[ name ];
		stringified[ keyName ].value = stringify( stringified[ keyName ].value );
	}

	return stringified;
}

export function truncateString( string, length ) {
	if ( string.length > length ) {
		return string.substr( 0, length ) + `… [${ string.length - length } characters left]`;
	}

	return string;
}

export function compareArrays( a, b ) {
	const minLen = Math.min( a.length, b.length );

	for ( let i = 0; i < minLen; i++ ) {
		if ( a[ i ] != b[ i ] ) {
			// The arrays are different.
			return i;
		}
	}

	// Both arrays were same at all points.
	if ( a.length == b.length ) {
		// If their length is also same, they are the same.
		return 'same';
	} else if ( a.length < b.length ) {
		// Compared array is shorter so it is a prefix of the other array.
		return 'prefix';
	} else {
		// Compared array is longer so it is an extension of the other array.
		return 'extension';
	}
}
