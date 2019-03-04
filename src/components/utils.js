/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export function stringifyAttributeValue( value ) {
	// Note: Remove leading and trailing quotes (") from the output. By default it is:
	//
	//		JSON.stringify( 'foo' ) => '"foo"'
	//		JSON.stringify( true ) => '"true"'
	//		JSON.stringify( {} ) => '{}'
	//		JSON.stringify( [] ) => '[]'
	//
	// What should be returned:
	//
	//		stringifyAttributeValue( 'foo' ) => 'foo'
	//		stringifyAttributeValue( true ) => 'true'
	//		stringifyAttributeValue( {} ) => '{}'
	//		stringifyAttributeValue( [] ) => '[]'
	//
	return JSON.stringify( value ).replace( /(^"|"$)/g, '' );
}
