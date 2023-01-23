/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import {
	getEditorModelTreeDefinition,
	getEditorModelMarkers,
	getEditorModelRanges,
	getEditorModelNodeDefinition
} from '../../../../src/model/data/utils';

import TestEditor from '../../../utils/testeditor';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

import { assertTreeItems } from '../../../../tests/utils/utils';

describe( 'model data utils', () => {
	let editor, element, root;

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ]
		} ).then( newEditor => {
			editor = newEditor;

			root = editor.model.document.getRoot();
		} );
	} );

	afterEach( () => {
		return editor.destroy();
	} );

	describe( 'getEditorModelTreeDefinition()', () => {
		it( 'renders a tree #1', () => {
			// <paragraph>[]</paragraph>
			editor.setData( '<p></p>' );

			const ranges = getEditorModelRanges( editor, 'main' );
			const markers = getEditorModelMarkers( editor, 'main' );
			const definition = getEditorModelTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges,
				markers
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: '$root',
					node: root,
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							node: root.getChild( 0 ),
							attributes: [],
							positions: [
								{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null },
								{ offset: 0, isEnd: true, presentation: null, type: 'selection', name: null }
							],
							children: []
						}
					]
				}
			] );
		} );

		it( 'renders a tree #1.1', () => {
			const root = editor.model.document.getRoot();

			editor.setData( '<p></p><p></p>' );

			// <paragraph>[</paragraph><paragraph>]</paragraph>
			editor.model.change( writer => {
				writer.setSelection( root.getChild( 1 ), 0 );
				writer.setSelectionFocus( root.getChild( 0 ), 0 );
			} );

			const ranges = getEditorModelRanges( editor, 'main' );
			const markers = getEditorModelMarkers( editor, 'main' );
			const definition = getEditorModelTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges,
				markers
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: '$root',
					node: root,
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							node: root.getChild( 0 ),
							attributes: [],
							positions: [
								{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null }
							],
							children: []
						},
						{
							type: 'element',
							name: 'paragraph',
							node: root.getChild( 1 ),
							attributes: [],
							positions: [
								{ offset: 0, isEnd: true, presentation: null, type: 'selection', name: null }
							],
							children: []
						}
					]
				}
			] );
		} );

		it( 'renders a tree #2', () => {
			// <paragraph>[]foo</paragraph>
			editor.setData( '<p>foo</p>' );

			const ranges = getEditorModelRanges( editor, 'main' );
			const markers = getEditorModelMarkers( editor, 'main' );
			const definition = getEditorModelTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges,
				markers
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: '$root',
					node: root,
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							node: root.getChild( 0 ),
							attributes: [],
							children: [
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 0 ),
									presentation: {
										dontRenderAttributeValue: true
									},
									positionsBefore: [
										{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null },
										{ offset: 0, isEnd: true, presentation: null, type: 'selection', name: null }
									],
									text: 'foo'
								}
							]
						}
					]
				}
			] );
		} );

		it( 'renders a tree #3', () => {
			editor.setData( '<p>f<b>o</b>o</p>' );

			// <paragraph>f<$text bold>[]o</$text>o</paragraph>
			editor.model.change( writer => {
				writer.setSelection( root.getChild( 0 ), 1 );
			} );

			const ranges = getEditorModelRanges( editor, 'main' );
			const markers = getEditorModelMarkers( editor, 'main' );
			const definition = getEditorModelTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges,
				markers
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: '$root',
					node: root,
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							node: root.getChild( 0 ),
							attributes: [],
							children: [
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 0 ),
									presentation: {
										dontRenderAttributeValue: true
									},
									text: 'f'
								},
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 1 ),
									presentation: {
										dontRenderAttributeValue: true
									},
									attributes: [
										[ 'bold', 'true' ]
									],
									positionsBefore: [
										{ offset: 1, isEnd: false, presentation: null, type: 'selection', name: null },
										{ offset: 1, isEnd: true, presentation: null, type: 'selection', name: null }
									],
									text: 'o'
								},
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 2 ),
									presentation: {
										dontRenderAttributeValue: true
									},
									text: 'o'
								}
							]
						}
					]
				}
			] );
		} );

		it( 'renders a tree #4', () => {
			editor.setData( '<p>f<b>oo</b>o</p>' );

			// <paragraph>f<$text bold>o[]o</$text>o</paragraph>
			editor.model.change( writer => {
				writer.setSelection( root.getChild( 0 ), 2 );
			} );

			const ranges = getEditorModelRanges( editor, 'main' );
			const markers = getEditorModelMarkers( editor, 'main' );
			const definition = getEditorModelTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges,
				markers
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: '$root',
					node: root,
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							node: root.getChild( 0 ),
							attributes: [],
							children: [
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 0 ),
									presentation: {
										dontRenderAttributeValue: true
									},
									text: 'f'
								},
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 1 ),
									presentation: {
										dontRenderAttributeValue: true
									},
									attributes: [
										[ 'bold', 'true' ]
									],
									positions: [
										{ offset: 2, isEnd: false, presentation: null, type: 'selection', name: null },
										{ offset: 2, isEnd: true, presentation: null, type: 'selection', name: null }
									],
									text: 'oo'
								},
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 2 ),
									presentation: {
										dontRenderAttributeValue: true
									},
									text: 'o'
								}
							]
						}
					]
				}
			] );
		} );

		it( 'renders a tree #5', () => {
			editor.setData( '<p>a<b>bc</b>de</p>' );

			// <paragraph>a<$text bold>b[c</$text>d]e</paragraph>
			editor.model.change( writer => {
				writer.setSelection( root.getChild( 0 ), 4 );
				writer.setSelectionFocus( root.getChild( 0 ), 2 );
			} );

			const ranges = getEditorModelRanges( editor, 'main' );
			const markers = getEditorModelMarkers( editor, 'main' );
			const definition = getEditorModelTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges,
				markers
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: '$root',
					node: root,
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							node: root.getChild( 0 ),
							attributes: [],
							children: [
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 0 ),
									presentation: {
										dontRenderAttributeValue: true
									},
									text: 'a'
								},
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 1 ),
									presentation: {
										dontRenderAttributeValue: true
									},
									attributes: [
										[ 'bold', 'true' ]
									],
									positions: [
										{ offset: 2, isEnd: false, presentation: null, type: 'selection', name: null }
									],
									text: 'bc'
								},
								{
									type: 'text',
									node: root.getChild( 0 ).getChild( 2 ),
									presentation: {
										dontRenderAttributeValue: true
									},
									positions: [
										{ offset: 4, isEnd: true, presentation: null, type: 'selection', name: null }
									],
									text: 'de'
								}
							]
						}
					]
				}
			] );
		} );

		it( 'should sort node attributes by name', () => {
			editor.setData( '<p>a</p>' );

			const paragraph = root.getChild( 0 );

			// <paragraph>a[]</paragraph>
			editor.model.change( writer => {
				writer.setSelection( paragraph, 1 );
				writer.setAttribute( 'b', 'b-value', paragraph );
				writer.setAttribute( 'a', 'a-value', paragraph );
				writer.setAttribute( 'd', 'd-value', paragraph );
				writer.setAttribute( 'c', 'c-value', paragraph );
			} );

			const ranges = getEditorModelRanges( editor, 'main' );
			const markers = getEditorModelMarkers( editor, 'main' );
			const definition = getEditorModelTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges,
				markers
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: '$root',
					node: root,
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
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
									presentation: {
										dontRenderAttributeValue: true
									},
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

	describe( 'getEditorModelNodeDefinition()', () => {
		it( 'should sort node attributes by name', () => {
			editor.setData( '<p>a</p>' );

			const paragraph = root.getChild( 0 );

			// <paragraph>a[]</paragraph>
			editor.model.change( writer => {
				writer.setSelection( paragraph, 1 );
				writer.setAttribute( 'b', 'b-value', paragraph );
				writer.setAttribute( 'a', 'a-value', paragraph );
				writer.setAttribute( 'd', 'd-value', paragraph );
				writer.setAttribute( 'c', 'c-value', paragraph );
			} );

			const definition = getEditorModelNodeDefinition( editor, paragraph );

			expect( Object.keys( definition.attributes ) ).to.have.ordered.members( [ 'a', 'b', 'c', 'd' ] );
		} );
	} );
} );
