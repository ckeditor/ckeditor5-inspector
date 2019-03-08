/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global window */

import StorageManager from '../../src/storagemanager';

describe( 'StorageManager', () => {
	describe( '#set()', () => {
		it( 'sets items in the local storage', () => {
			const spy = sinon.spy( window.localStorage, 'setItem' );

			StorageManager.set( 'foo', 'bar' );
			StorageManager.set( 'baz', 'qux' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo', 'bar' );
			sinon.assert.calledWithExactly( spy.secondCall, 'baz', 'qux' );
		} );
	} );

	describe( '#get()', () => {
		it( 'retrieves items from the local storage', () => {
			const spy = sinon.spy( window.localStorage, 'getItem' );

			StorageManager.set( 'foo', 'bar' );
			expect( StorageManager.get( 'foo' ) ).to.equal( 'bar' );

			sinon.assert.calledWithExactly( spy, 'foo' );
		} );
	} );
} );
