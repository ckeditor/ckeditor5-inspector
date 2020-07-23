/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import {
	getEditorModelTreeDefinition,
	getEditorModelMarkers,
	getEditorModelRanges
} from '../../../../src/model/data/utils';

import TestEditor from '../../../utils/testeditor';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

import { assertTreeItems } from '../../../../tests/utils/utils';

describe( 'model data utils', () => {
	describe( 'getEditorModelTreeDefinition()', () => {
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
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
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
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							attributes: [],
							positions: [
								{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null }
							],
							children: []
						},
						{
							type: 'element',
							name: 'paragraph',
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
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							attributes: [],
							children: [
								{
									type: 'text',
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
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							attributes: [],
							children: [
								{
									type: 'text',
									presentation: {
										dontRenderAttributeValue: true
									},
									text: 'f'
								},
								{
									type: 'text',
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
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							attributes: [],
							children: [
								{
									type: 'text',
									presentation: {
										dontRenderAttributeValue: true
									},
									text: 'f'
								},
								{
									type: 'text',
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
					attributes: [],
					children: [
						{
							type: 'element',
							name: 'paragraph',
							attributes: [],
							children: [
								{
									type: 'text',
									presentation: {
										dontRenderAttributeValue: true
									},
									text: 'a'
								},
								{
									type: 'text',
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
	} );
} );
