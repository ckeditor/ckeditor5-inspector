/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Paragraph, BoldEditing } from 'ckeditor5';

import {
	getEditorModelRoots,
	getEditorModelTreeDefinition,
	getEditorModelMarkers,
	getEditorModelRanges,
	getEditorModelNodeDefinition
} from '../../../../src/model/data/utils';

import TestEditor from '../../../utils/testeditor';

import { assertTreeItems } from '../../../../tests/utils/utils';

describe( 'model data utils', () => {
	describe( 'null editor', () => {
		it( 'getEditorModelRoots() returns an empty array when editor is null', () => {
			expect( getEditorModelRoots( null ) ).toEqual( [] );
		} );

		it( 'getEditorModelRanges() returns an empty array when editor is null', () => {
			expect( getEditorModelRanges( null, 'main' ) ).toEqual( [] );
		} );

		it( 'getEditorModelMarkers() returns an empty array when editor is null', () => {
			expect( getEditorModelMarkers( null, 'main' ) ).toEqual( [] );
		} );

		it( 'getEditorModelTreeDefinition() returns an empty array when currentEditor is null', () => {
			expect( getEditorModelTreeDefinition( {
				currentEditor: null, currentRootName: 'main', ranges: [], markers: []
			} ) ).toEqual( [] );
		} );
	} );

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

	describe( 'getEditorModelMarkers()', () => {
		it( 'should skip markers whose start is in a different root than the requested one', () => {
			editor.setData( '<p>foo</p>' );

			editor.model.change( writer => {
				const root = editor.model.document.getRoot();
				const range = editor.model.createRange(
					editor.model.createPositionFromPath( root, [ 0, 0 ] ),
					editor.model.createPositionFromPath( root, [ 0, 3 ] )
				);

				writer.addMarker( 'test:marker', { range, usingOperation: false, affectsData: false } );
			} );

			// Requesting markers for '$graveyard' but the marker is in 'main' — it should be skipped.
			const markers = getEditorModelMarkers( editor, '$graveyard' );

			expect( markers ).toEqual( [] );
		} );
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

			expect( Object.keys( definition.attributes ) ).toEqual( [ 'a', 'b', 'c', 'd' ] );
		} );
	} );
} );

describe( 'model data utils edge cases', () => {
	function createModelElement( { path, startOffset, endOffset, maxOffset, children, name = 'element', isRoot = false } ) {
		return {
			name,
			startOffset,
			endOffset,
			maxOffset,
			getPath() {
				return path;
			},
			getChildren() {
				return children;
			},
			getAttributes() {
				return [];
			},
			is( type ) {
				return type === 'element' || ( isRoot && type === 'rootElement' );
			}
		};
	}

	function createModelText( { path, startOffset, endOffset, data } ) {
		return {
			data,
			startOffset,
			endOffset,
			offsetSize: endOffset - startOffset,
			getPath() {
				return path;
			},
			getAttributes() {
				return [];
			},
			is() {
				return false;
			}
		};
	}

	it( 'stores max-offset positions on the element when there is no child node to use', () => {
		const root = createModelElement( {
			path: [],
			startOffset: 0,
			endOffset: 1,
			maxOffset: 1,
			children: [],
			name: '$root',
			isRoot: true
		} );

		const definition = getEditorModelTreeDefinition( {
			currentEditor: {
				model: {
					document: {
						getRoot: () => root
					}
				}
			},
			currentRootName: 'main',
			ranges: [
				{
					type: 'selection',
					start: { path: [ 1 ] },
					end: { path: [ 1 ] }
				}
			],
			markers: []
		} );

		expect( definition[ 0 ].positions ).toEqual( [
			expect.objectContaining( { offset: 1, isEnd: false } ),
			expect.objectContaining( { offset: 1, isEnd: true } )
		] );
	} );

	it( 'supports both element-to-text boundaries and fallback positions in one range', () => {
		const elementChild = createModelElement( {
			path: [ 0 ],
			startOffset: 0,
			endOffset: 1,
			maxOffset: 0,
			children: [],
			name: 'widget'
		} );

		const textChild = createModelText( {
			path: [ 1 ],
			startOffset: 1,
			endOffset: 2,
			data: 'x'
		} );

		const root = createModelElement( {
			path: [],
			startOffset: 0,
			endOffset: 3,
			maxOffset: 3,
			children: [ elementChild, textChild ],
			name: '$root',
			isRoot: true
		} );

		const definition = getEditorModelTreeDefinition( {
			currentEditor: {
				model: {
					document: {
						getRoot: () => root
					}
				}
			},
			currentRootName: 'main',
			ranges: [
				{
					type: 'selection',
					start: { path: [ 2 ] },
					end: { path: [ 1 ] }
				}
			],
			markers: []
		} );

		expect( definition[ 0 ].children[ 1 ].positionsBefore ).toEqual( [
			expect.objectContaining( { offset: 1, isEnd: true } )
		] );

		expect( definition[ 0 ].children[ 1 ].positionsAfter ).toEqual( [
			expect.objectContaining( { offset: 2, isEnd: false } )
		] );
	} );
} );
