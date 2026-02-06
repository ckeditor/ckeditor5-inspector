/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	stringify,
	uid,
	stringifyPropertyList,
	truncateString
} from '../../../src/components/utils';

describe( 'Utils', () => {
	describe( 'stringify()', () => {
		it( 'stringifies values', () => {
			expect( stringify( undefined ) ).toBe( 'undefined' );
			expect( stringify( true ) ).toBe( 'true' );
			expect( stringify( 'foo' ) ).toBe( '"foo"' );
			expect( stringify( [ 'a' ] ) ).toBe( '["a"]' );
			expect( stringify( { a: false } ) ).toBe( '{a:false}' );
			expect( stringify( () => 'foo' ) ).toBe( 'function() {…}' );
		} );

		it( 'serializes quotes properly', () => {
			expect( stringify( '\'foo\'' ) ).toBe( '"\\"foo\\""' );
		} );

		it( 'stringifies values (no quotes around text)', () => {
			expect( stringify( undefined ) ).toBe( 'undefined' );
			expect( stringify( true ) ).toBe( 'true' );
			expect( stringify( 'foo', false ) ).toBe( 'foo' );
			expect( stringify( [ 'a' ], false ) ).toBe( '["a"]' );
			expect( stringify( { a: false }, false ) ).toBe( '{a:false}' );
			expect( stringify( () => 'foo' ), false ).toBe( 'function() {…}' );
		} );

		it( 'should not throw while processing circular references', () => {
			const obj = { foo: 'bar' };
			obj.baz = obj;

			expect( () => {
				expect( stringify( obj ) ).toBe( '{foo:"bar"}' );
			} ).not.toThrow();
		} );

		it( 'should process only two first level of objects', () => {
			const obj = {
				level: '1',
				nested: {
					level: '2',
					subNested: {
						level: '3'
					}
				}
			};

			expect( stringify( obj ) ).toBe( '{level:"1",nested:{level:"2",subNested:{}}}' );
		} );
	} );

	describe( 'uid()', () => {
		it( 'generates UID', () => {
			expect( uid() ).toEqual( expect.any( String ) );
		} );
	} );

	describe( 'stringifyPropertyList()', () => {
		it( 'stringifies props', () => {
			const symbolKey = Symbol( '42' );
			const result = stringifyPropertyList( {
				foo: { value: 'bar' },
				baz: { value: 'qux' },
				[ symbolKey ]: { value: 'abc' }
			} );

			expect( result.foo ).toEqual( { value: '"bar"' } );
			expect( result.baz ).toEqual( { value: '"qux"' } );
			expect( result[ symbolKey ] ).toBeUndefined();
		} );
	} );

	describe( 'truncateString()', () => {
		it( 'truncates when too long', () => {
			expect( truncateString( '1234', 3 ) ).toBe( '123… [1 characters left]' );
			expect( truncateString( '1234', 2 ) ).toBe( '12… [2 characters left]' );
		} );

		it( 'does nothing when in limit', () => {
			expect( truncateString( '1234', 4 ) ).toBe( '1234' );
			expect( truncateString( '1234', 5 ) ).toBe( '1234' );
		} );
	} );
} );
