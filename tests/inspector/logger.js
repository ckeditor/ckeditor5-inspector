/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, vi } from 'vitest';

import Logger from '../../src/logger';

describe( 'Logger', () => {
	describe( '#group()', () => {
		it( 'calls console.group', () => {
			const stub = vi.spyOn( console, 'group' ).mockImplementation( () => {} );

			Logger.group( 'foo', 'bar' );

			expect( stub ).toHaveBeenCalledWith( 'foo', 'bar' );
		} );
	} );

	describe( '#groupEnd()', () => {
		it( 'calls console.groupEnd', () => {
			const stub = vi.spyOn( console, 'groupEnd' ).mockImplementation( () => {} );

			Logger.groupEnd( 'foo', 'bar' );

			expect( stub ).toHaveBeenCalledWith( 'foo', 'bar' );
		} );
	} );

	describe( '#log()', () => {
		it( 'calls console.log', () => {
			const stub = vi.spyOn( console, 'log' ).mockImplementation( () => {} );

			Logger.log( 'foo', 'bar' );

			expect( stub ).toHaveBeenCalledWith( 'foo', 'bar' );
		} );
	} );

	describe( '#warn()', () => {
		it( 'calls console.warn', () => {
			const stub = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			Logger.warn( 'foo', 'bar' );

			expect( stub ).toHaveBeenCalledWith( 'foo', 'bar' );
		} );
	} );
} );
