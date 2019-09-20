/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console */

import Logger from '../../src/logger';

describe( 'Logger', () => {
	let spy;

	afterEach( () => {
		spy.restore();
	} );

	describe( '#group()', () => {
		it( 'calls console.group', () => {
			spy = sinon.spy( console, 'group' );

			Logger.group( 'foo', 'bar' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo', 'bar' );
		} );
	} );

	describe( '#groupEnd()', () => {
		it( 'calls console.groupEnd', () => {
			spy = sinon.spy( console, 'groupEnd' );

			Logger.groupEnd( 'foo', 'bar' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo', 'bar' );
		} );
	} );

	describe( '#log()', () => {
		it( 'calls console.log', () => {
			spy = sinon.spy( console, 'log' );

			Logger.log( 'foo', 'bar' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo', 'bar' );
		} );
	} );

	describe( '#warn()', () => {
		it( 'calls console.warn', () => {
			spy = sinon.spy( console, 'warn' );

			Logger.warn( 'foo', 'bar' );

			sinon.assert.calledWithExactly( spy.firstCall, 'foo', 'bar' );
		} );
	} );
} );
