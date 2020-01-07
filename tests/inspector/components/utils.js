/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	stringify,
	uid,
	stringifyPropertyList,
	truncateString,
} from '../../../src/components/utils';

describe( 'Utils', () => {
	describe( 'stringify()', () => {
		it( 'stringifies values', () => {
			expect( stringify( undefined ) ).to.equal( 'undefined' );
			expect( stringify( true ) ).to.equal( 'true' );
			expect( stringify( 'foo' ) ).to.equal( '"foo"' );
			expect( stringify( [ 'a' ] ) ).to.equal( '["a"]' );
			expect( stringify( { a: false } ) ).to.equal( '{"a":false}' );
			expect( stringify( () => 'foo' ) ).to.equal( 'function() {…}' );
		} );

		it( 'stringifies values (no quotes around text)', () => {
			expect( stringify( undefined ) ).to.equal( 'undefined' );
			expect( stringify( true ) ).to.equal( 'true' );
			expect( stringify( 'foo', false ) ).to.equal( 'foo' );
			expect( stringify( [ 'a' ], false ) ).to.equal( '["a"]' );
			expect( stringify( { a: false }, false ) ).to.equal( '{"a":false}' );
			expect( stringify( () => 'foo' ), false ).to.equal( 'function() {…}' );
		} );
	} );

	describe( 'uid()', () => {
		it( 'generates UID', () => {
			expect( uid() ).to.be.a( 'string' );
		} );
	} );

	describe( 'stringifyPropertyList()', () => {
		it( 'stringifies props', () => {
			expect( stringifyPropertyList( [
				[ 'foo', 'bar' ],
				[ 'baz', 'qux' ],
				[ Symbol( '42' ), 'abc' ]
			] ) ).to.have.deep.members( [
				[ 'foo', '"bar"' ],
				[ 'baz', '"qux"' ],
				[ 'Symbol(42)', '"abc"' ]
			] );
		} );
	} );

	describe( 'truncateString()', () => {
		it( 'truncates when too long', () => {
			expect( truncateString( '1234', 3 ) ).to.equal( '123… [1 characters left]' );
			expect( truncateString( '1234', 2 ) ).to.equal( '12… [2 characters left]' );
		} );

		it( 'does nothing when in limit', () => {
			expect( truncateString( '1234', 4 ) ).to.equal( '1234' );
			expect( truncateString( '1234', 5 ) ).to.equal( '1234' );
		} );
	} );
} );
