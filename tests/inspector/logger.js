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

			Logger.group( 'foo' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo' );
		} );
	} );

	describe( '#groupEnd()', () => {
		it( 'calls console.groupEnd', () => {
			const spy = sinon.spy( console, 'groupEnd' );

			Logger.groupEnd( 'foo' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo' );
		} );
	} );

	describe( '#log()', () => {
		it( 'calls console.log', () => {
			const spy = sinon.spy( console, 'log' );

			Logger.log( 'foo' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo' );
		} );
	} );
} );
