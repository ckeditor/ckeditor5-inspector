/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console */

import Logger from '../../src/logger';

describe( 'Logger', () => {
	afterEach( () => {
		sinon.restore();
	} );

	describe( '#group()', () => {
		it( 'calls console.group', () => {
			const stub = sinon.stub( console, 'group' );

			Logger.group( 'foo', 'bar' );

			sinon.assert.calledWithExactly( stub.firstCall, 'foo', 'bar' );
		} );
	} );

	describe( '#groupEnd()', () => {
		it( 'calls console.groupEnd', () => {
			const stub = sinon.stub( console, 'groupEnd' );

			Logger.groupEnd( 'foo', 'bar' );

			sinon.assert.calledWithExactly( stub.firstCall, 'foo', 'bar' );
		} );
	} );

	describe( '#log()', () => {
		it( 'calls console.log', () => {
			const stub = sinon.stub( console, 'log' );

			Logger.log( 'foo', 'bar' );

			sinon.assert.calledWithExactly( stub.firstCall, 'foo', 'bar' );
		} );
	} );

	describe( '#warn()', () => {
		it( 'calls console.warn', () => {
			const stub = sinon.stub( console, 'warn' );

			Logger.warn( 'foo', 'bar' );

			sinon.assert.calledWithExactly( stub.firstCall, 'foo', 'bar' );
		} );
	} );
} );
