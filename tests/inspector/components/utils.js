/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	stringify,
	uid,
	stringifyPropertyList
} from '../../../src/components/utils';

describe( 'Utils', () => {
	describe( 'stringify()', () => {
		it( 'stringifies values', () => {
			expect( stringify( undefined ) ).to.equal( 'undefined' );
			expect( stringify( true ) ).to.equal( 'true' );
			expect( stringify( 'foo' ) ).to.equal( '"foo"' );
			expect( stringify( [ 'a' ] ) ).to.equal( '["a"]' );
			expect( stringify( { a: false } ) ).to.equal( '{"a":false}' );
		} );

		it( 'stringifies values (no quotes around text)', () => {
			expect( stringify( undefined ) ).to.equal( 'undefined' );
			expect( stringify( true ) ).to.equal( 'true' );
			expect( stringify( 'foo', false ) ).to.equal( 'foo' );
			expect( stringify( [ 'a' ], false ) ).to.equal( '["a"]' );
			expect( stringify( { a: false }, false ) ).to.equal( '{"a":false}' );
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
			] ) ).to.have.deep.members( [
				[ 'foo', '"bar"' ],
				[ 'baz', '"qux"' ],
			] );
		} );
	} );
} );
