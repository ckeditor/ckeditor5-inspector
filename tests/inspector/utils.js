/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';

import { getFirstEditor, getFirstEditorName, compareArrays } from '../../src/utils';

describe( 'utils', () => {
	describe( 'getFirstEditor()', () => {
		it( 'returns the first editor from a Map', () => {
			const editorA = { id: 'a' };
			const editorB = { id: 'b' };
			const editors = new Map( [ [ 'foo', editorA ], [ 'bar', editorB ] ] );

			expect( getFirstEditor( editors ) ).toBe( editorA );
		} );
	} );

	describe( 'getFirstEditorName()', () => {
		it( 'returns the first editor name from a Map', () => {
			const editors = new Map( [ [ 'foo', {} ], [ 'bar', {} ] ] );

			expect( getFirstEditorName( editors ) ).toBe( 'foo' );
		} );

		it( 'returns an empty string when the first editor name is falsy', () => {
			// Simulate edge case where the key is empty string.
			const editors = new Map( [ [ '', {} ] ] );

			expect( getFirstEditorName( editors ) ).toBe( '' );
		} );
	} );

	describe( 'compareArrays()', () => {
		it( 'returns "same" when arrays are identical', () => {
			expect( compareArrays( [ 1, 2, 3 ], [ 1, 2, 3 ] ) ).toBe( 'same' );
		} );

		it( 'returns "prefix" when a is a prefix of b', () => {
			expect( compareArrays( [ 1, 2 ], [ 1, 2, 3 ] ) ).toBe( 'prefix' );
		} );

		it( 'returns "extension" when a is longer than b', () => {
			expect( compareArrays( [ 1, 2, 3 ], [ 1, 2 ] ) ).toBe( 'extension' );
		} );

		it( 'returns the index of the first difference', () => {
			expect( compareArrays( [ 1, 2, 4 ], [ 1, 2, 3 ] ) ).toBe( 2 );
		} );
	} );
} );
