/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import TestEditor from '../../../utils/testeditor';
import { nodeToString } from '../../../../src/components/view/utils';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( 'View utils', () => {
	let editor, element;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ]
		} ).then( newEditor => {
			editor = newEditor;
		} );
	} );

	afterEach( () => {
		element.remove();

		return editor.destroy();
	} );

	describe( 'nodeToString()', () => {
		it( 'works for AttributeElement', () => {
			editor.editing.view.change( writer => {
				const node = writer.createAttributeElement( 'foo', { bar: true } );

				expect( nodeToString( node ) ).to.equal( 'attribute:foo' );
			} );
		} );

		it( 'works for RootElement', () => {
			editor.editing.view.change( () => {
				expect( nodeToString( editor.editing.view.document.getRoot() ) ).to.equal( 'root:div' );
			} );
		} );

		it( 'works for ContainerElement', () => {
			editor.editing.view.change( writer => {
				const node = writer.createContainerElement( 'foo' );

				expect( nodeToString( node ) ).to.equal( 'container:foo' );
			} );
		} );

		it( 'works for Text', () => {
			editor.editing.view.change( writer => {
				const node = writer.createText( 'foo' );

				expect( nodeToString( node ) ).to.equal( 'foo' );
			} );
		} );
	} );
} );
