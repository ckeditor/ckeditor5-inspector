/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import TestEditor from '../utils/testeditor';
import MiniCKEditorInspector from '../../src/miniinspector';

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

	describe( '#attach()', () => {
		it( 'should not throw', () => {
			expect( () => {
				MiniCKEditorInspector.attach( editor, container );
			} ).to.not.throw();
		} );
	} );
} );
