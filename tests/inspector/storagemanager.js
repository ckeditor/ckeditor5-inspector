/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global window */

import LocalStorageManager from '../../src/localstoragemanager';

describe( 'LocalStorageManager', () => {
	describe( '#set()', () => {
		it( 'sets items in the local storage', () => {
			const spy = sinon.spy( window.Storage.prototype, 'setItem' );

			LocalStorageManager.set( 'foo', 'bar' );
			LocalStorageManager.set( 'baz', 'qux' );

			sinon.assert.calledWithExactly( spy.firstCall, 'ck5-inspector-foo', 'bar' );
			sinon.assert.calledWithExactly( spy.secondCall, 'ck5-inspector-baz', 'qux' );
		} );
	} );

	describe( '#get()', () => {
		it( 'retrieves items from the local storage', () => {
			const spy = sinon.spy( window.Storage.prototype, 'getItem' );

			LocalStorageManager.set( 'foo', 'bar' );
			expect( LocalStorageManager.get( 'foo' ) ).to.equal( 'bar' );

			sinon.assert.calledWithExactly( spy, 'ck5-inspector-foo' );
		} );
	} );
} );
