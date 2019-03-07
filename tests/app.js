/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import TestEditor from './utils/testeditor';
import CKEditorInspector from '../src/app';

describe( 'Application', () => {
	let editor;

	beforeEach( () => {
		return TestEditor.create().then( newEditor => {
			editor = newEditor;
		} );
	} );

	afterEach( () => {
		return editor.destroy();
	} );

	describe( '#attach()', () => {
		it( 'attaches new editor (no name)', () => {
			CKEditorInspector.attach( editor );
		} );

		it( 'attaches new editor (named)', () => {
			CKEditorInspector.attach( 'foo', editor );
		} );
	} );
} );
