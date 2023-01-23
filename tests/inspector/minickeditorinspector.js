/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import TestEditor from '../utils/testeditor';
import MiniCKEditorInspector from '../../src/minickeditorinspector';

describe( 'MiniCKEditorInspector', () => {
	let editor, element, container;

	beforeEach( () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		container = document.createElement( 'div' );
		document.body.appendChild( element );
		document.body.appendChild( container );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;
		} );
	} );

	afterEach( () => {
		sinon.restore();
		element.remove();
		container.remove();

		return editor.destroy();
	} );

	describe( 'CKEDITOR_MINI_INSPECTOR_VERSION', () => {
		it( 'should be set', () => {
			expect( window.CKEDITOR_MINI_INSPECTOR_VERSION ).to.be.a( 'string' );
		} );
	} );

	describe( '#attach()', () => {
		it( 'should not throw', () => {
			expect( () => {
				MiniCKEditorInspector.attach( editor, container );
			} ).to.not.throw();
		} );
	} );
} );
