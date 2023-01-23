/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import TestEditor from '../../utils/testeditor';
import { nodeToString } from '../../../src/view/utils';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

import {
	getEditorViewNodeDefinition,
	getEditorViewRanges,
	getEditorViewTreeDefinition
} from '../../../src/view/data/utils';

import { assertTreeItems } from '../../../tests/utils/utils';

describe( 'View utils', () => {
	let editor, root, element;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ]
		} ).then( newEditor => {
			editor = newEditor;

			root = editor.editing.view.document.getRoot();
		} );
	} );

	afterEach( () => {
		element.remove();

		return editor.destroy();
	} );

	describe( 'getEditorViewTreeDefinition()', () => {
		it( 'should sort node attributes by name', () => {
			editor.setData( '<p>a</p>' );

			const paragraph = root.getChild( 0 );

			// <p>a[]</p>
			editor.editing.view.change( writer => {
				writer.setSelection( paragraph, 1 );
				writer.setAttribute( 'b', 'b-value', paragraph );
				writer.setAttribute( 'a', 'a-value', paragraph );
				writer.setAttribute( 'd', 'd-value', paragraph );
				writer.setAttribute( 'c', 'c-value', paragraph );
			} );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentRootName: 'main',
				currentEditor: editor,
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					node: root,
					attributes: [
						[ 'aria-label', 'Editor editing area: main' ],
						[ 'class', 'ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline' ],
						[ 'contenteditable', 'true' ],
						[ 'dir', 'ltr' ],
						[ 'lang', 'en' ],
						[ 'role', 'textbox' ]
					],
					children: [
						{
							type: 'element',
							name: 'p',
							node: root.getChild( 0 ),
							attributes: [
								[ 'a', 'a-value' ],
								[ 'b', 'b-value' ],
								[ 'c', 'c-value' ],
								[ 'd', 'd-value' ]
							],
							positions: [],
							children: [
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 0 ),
									positionsAfter: [
										{ offset: 1, isEnd: false, presentation: null, type: 'selection', name: null },
										{ offset: 1, isEnd: true, presentation: null, type: 'selection', name: null }
									],
									text: 'a'
								}
							]
						}
					]
				}
			] );
		} );
	} );

	describe( 'getEditorViewNodeDefinition()', () => {
		it( 'should sort node attributes by name', () => {
			editor.setData( '<p>a</p>' );

			const paragraph = root.getChild( 0 );

			// <p>a[]</p>
			editor.editing.view.change( writer => {
				writer.setSelection( paragraph, 1 );
				writer.setAttribute( 'b', 'b-value', paragraph );
				writer.setAttribute( 'a', 'a-value', paragraph );
				writer.setAttribute( 'd', 'd-value', paragraph );
				writer.setAttribute( 'c', 'c-value', paragraph );
			} );

			const definition = getEditorViewNodeDefinition( paragraph );

			expect( Object.keys( definition.attributes ) ).to.have.ordered.members( [ 'a', 'b', 'c', 'd' ] );
		} );
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
