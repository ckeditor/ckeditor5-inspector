/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console */

import Logger from '../../src/logger';

describe( 'Logger', () => {
	describe( '#group()', () => {
		it( 'calls console.group', () => {
			const spy = sinon.spy( console, 'group' );

			Logger.group( 'foo', 'bar' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo', 'bar' );
		} );
	} );

	describe( '#groupEnd()', () => {
		it( 'calls console.groupEnd', () => {
			const spy = sinon.spy( console, 'groupEnd' );

			Logger.groupEnd( 'foo', 'bar' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo', 'bar' );
		} );
	} );

	describe( '#log()', () => {
		it( 'calls console.log', () => {
			const spy = sinon.spy( console, 'log' );

			Logger.log( 'foo', 'bar' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo', 'bar' );
		} );
	} );
} );
