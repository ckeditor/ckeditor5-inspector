/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global window */

import StorageManager from '../../src/storagemanager';

describe( 'StorageManager', () => {
	describe( '#set()', () => {
		it( 'sets items in the local storage', () => {
			const spy = sinon.spy( window.Storage.prototype, 'setItem' );

			StorageManager.set( 'foo', 'bar' );
			StorageManager.set( 'baz', 'qux' );

			sinon.assert.calledWithExactly( spy.firstCall, 'ck5-inspector-foo', 'bar' );
			sinon.assert.calledWithExactly( spy.secondCall, 'ck5-inspector-baz', 'qux' );
		} );
	} );

	describe( '#get()', () => {
		it( 'retrieves items from the local storage', () => {
			const spy = sinon.spy( window.Storage.prototype, 'getItem' );

			StorageManager.set( 'foo', 'bar' );
			expect( StorageManager.get( 'foo' ) ).to.equal( 'bar' );

			sinon.assert.calledWithExactly( spy, 'ck5-inspector-foo' );
		} );
	} );
} );
