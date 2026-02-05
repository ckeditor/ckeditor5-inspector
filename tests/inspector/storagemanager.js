/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import LocalStorageManager from '../../src/localstoragemanager';

describe( 'LocalStorageManager', () => {
	describe( '#set()', () => {
		it( 'sets items in the local storage', () => {
			const spy = vi.spyOn( window.Storage.prototype, 'setItem' );

			LocalStorageManager.set( 'foo', 'bar' );
			LocalStorageManager.set( 'baz', 'qux' );

			expect( spy ).toHaveBeenNthCalledWith( 1, 'ck5-inspector-foo', 'bar' );
			expect( spy ).toHaveBeenNthCalledWith( 2, 'ck5-inspector-baz', 'qux' );
		} );
	} );

	describe( '#get()', () => {
		it( 'retrieves items from the local storage', () => {
			const spy = vi.spyOn( window.Storage.prototype, 'getItem' );

			LocalStorageManager.set( 'foo', 'bar' );
			expect( LocalStorageManager.get( 'foo' ) ).toBe( 'bar' );

			expect( spy ).toHaveBeenCalledWith( 'ck5-inspector-foo' );
		} );
	} );
} );
