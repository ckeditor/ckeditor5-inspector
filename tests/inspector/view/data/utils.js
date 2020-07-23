/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import {
	getEditorViewTreeDefinition,
	getEditorViewRanges
} from '../../../../src/view/data/utils';

import TestEditor from '../../../utils/testeditor';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

import { assertTreeItems } from '../../../../tests/utils/utils';

const ROOT_ATTRIBUTES = [
	[ 'lang', 'en' ],
	[ 'dir', 'ltr' ],
	[ 'aria-label', 'Rich Text Editor, main' ],
	[ 'role', 'textbox' ],
	[ 'contenteditable', 'true' ],
	[ 'class', 'ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline' ]
];

describe( 'view data utils', () => {
	describe( 'getEditorViewTreeDefinition()', () => {
		let editor, element;

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
			return editor.destroy();
		} );

		it( 'should render empty elements', () => {
			editor.setData( '<p></p>' );

			editor.editing.view.change( writer => {
				const foo = writer.createEmptyElement( 'foo' );
				writer.insert( editor.editing.view.document.selection.getFirstPosition(), foo );
			} );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							attributes: [],
							children: [
								{
									type: 'element',
									name: 'foo',
									attributes: [],
									positionsBefore: [
										{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null },
										{ offset: 0, isEnd: true, presentation: null, type: 'selection', name: null }
									],
									presentation: {
										isEmpty: true
									}
								}
							]
						}
					]
				}
			] );
		} );

		it( 'should render with element types when state#showElementTypes is true', () => {
			editor.setData( '<p><b>foo</b></p>' );

			let emptyElement, uiElement;

			editor.editing.view.change( writer => {
				emptyElement = writer.createEmptyElement( 'foo' );
				writer.insert( editor.editing.view.document.selection.getFirstPosition(), emptyElement );

				uiElement = writer.createUIElement( 'foo' );
				writer.insert( editor.editing.view.document.selection.getFirstPosition(), uiElement );
			} );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					elementType: 'root',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							elementType: 'container',
							attributes: [],
							children: [
								{
									type: 'element',
									name: 'foo',
									elementType: 'empty',
									attributes: [],
									children: []
								},
								{
									type: 'element',
									name: 'foo',
									elementType: 'ui',
									attributes: [],
									children: [
										{
											type: 'comment',
											text: /The View UI element content has been skipped/
										}
									]
								},
								{
									type: 'element',
									name: 'strong',
									elementType: 'attribute',
									children: [
										{
											type: 'text',
											positions: [
												{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null },
												{ offset: 0, isEnd: true, presentation: null, type: 'selection', name: null }
											],
											text: 'foo'
										}
									]
								}
							]
						}
					]
				}
			] );
		} );

		it( 'should render UI element content as a comment', () => {
			editor.setData( '<p></p>' );

			let uiElement;

			editor.editing.view.change( writer => {
				uiElement = writer.createUIElement( 'foo' );
				writer.insert(
					writer.createPositionAt( editor.editing.view.document.getRoot().getChild( 0 ), 0 ),
					uiElement );
			} );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							attributes: [],
							children: [
								{
									type: 'element',
									name: 'foo',
									attributes: [],
									positionsBefore: [
										{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null },
										{ offset: 0, isEnd: true, presentation: null, type: 'selection', name: null }
									],
									children: [
										{
											type: 'comment',
											text: /The View UI element content has been skipped/
										}
									]
								}
							]
						}
					]
				}
			] );
		} );

		it( 'should render a tree #1', () => {
			editor.setData( '<p></p>' );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							attributes: [],
							positions: [
								{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null },
								{ offset: 0, isEnd: true, presentation: null, type: 'selection', name: null }
							]
						}
					]
				}
			] );
		} );

		it( 'should render a tree #1.1', () => {
			const root = editor.editing.view.document.getRoot();

			editor.setData( '<p></p><p></p>' );

			// <p>[</p><p>]</p>
			editor.editing.view.change( writer => {
				writer.setSelection( root.getChild( 1 ), 0 );
				writer.setSelectionFocus( root.getChild( 0 ), 0 );
			} );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							attributes: [],
							positions: [
								{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null }
							]
						},
						{
							type: 'element',
							name: 'p',
							attributes: [],
							positions: [
								{ offset: 0, isEnd: true, presentation: null, type: 'selection', name: null }
							]
						}
					]
				}
			] );
		} );

		it( 'should render a tree #2', () => {
			// <p>[]foo</p>
			editor.setData( '<p>foo</p>' );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							attributes: [],
							children: [
								{
									type: 'text',
									text: 'foo',
									positions: [
										{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null },
										{ offset: 0, isEnd: true, presentation: null, type: 'selection', name: null }
									]
								}
							]
						}
					]
				}
			] );
		} );

		it( 'should render a tree #3', () => {
			const root = editor.editing.view.document.getRoot();

			editor.setData( '<p>f<b>o</b>o</p>' );

			// <p>f<b>[]o</b>o</p>
			editor.editing.view.change( writer => {
				writer.setSelection( root.getChild( 0 ).getChild( 1 ), 0 );
			} );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							attributes: [],
							children: [
								{
									type: 'text',
									text: 'f'
								},
								{
									type: 'element',
									name: 'strong',
									children: [
										{
											type: 'text',
											text: 'o',
											positionsBefore: [
												{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null },
												{ offset: 0, isEnd: true, presentation: null, type: 'selection', name: null }
											]
										}
									]
								},
								{
									type: 'text',
									text: 'o'
								}
							]
						}
					]
				}
			] );
		} );

		it( 'should render a tree #4', () => {
			const root = editor.editing.view.document.getRoot();

			editor.setData( '<p>f<b>oo</b>o</p>' );

			// <p>f<b>o[]o</b>o</p>
			editor.editing.view.change( writer => {
				writer.setSelection( root.getChild( 0 ).getChild( 1 ).getChild( 0 ), 1 );
			} );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							attributes: [],
							children: [
								{
									type: 'text',
									text: 'f'
								},
								{
									type: 'element',
									name: 'strong',
									children: [
										{
											type: 'text',
											text: 'oo',
											positions: [
												{ offset: 1, isEnd: false, presentation: null, type: 'selection', name: null },
												{ offset: 1, isEnd: true, presentation: null, type: 'selection', name: null }
											]
										}
									]
								},
								{
									type: 'text',
									text: 'o'
								}
							]
						}
					]
				}
			] );
		} );

		it( 'should render a tree #5', () => {
			const root = editor.editing.view.document.getRoot();

			editor.setData( '<p>a<b>bc</b>de</p>' );

			// <p>a<b>b[c</b>d]e</p>
			editor.editing.view.change( writer => {
				writer.setSelection( root.getChild( 0 ).getChild( 2 ), 1 );
				writer.setSelectionFocus( root.getChild( 0 ).getChild( 1 ).getChild( 0 ), 1 );
			} );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							attributes: [],
							children: [
								{
									type: 'text',
									text: 'a'
								},
								{
									type: 'element',
									name: 'strong',
									children: [
										{
											type: 'text',
											text: 'bc',
											positions: [
												{ offset: 1, isEnd: false, presentation: null, type: 'selection', name: null }
											]
										}
									]
								},
								{
									type: 'text',
									text: 'de',
									positions: [
										{ offset: 1, isEnd: true, presentation: null, type: 'selection', name: null }
									]
								}
							]
						}
					]
				}
			] );
		} );

		it( 'should render a tree #6', () => {
			const root = editor.editing.view.document.getRoot();

			editor.setData( '<p>a<b>bc</b>de</p>' );

			// <p>a<b>bc</b>[d]e</p>
			editor.editing.view.change( writer => {
				writer.setSelection( root.getChild( 0 ).getChild( 2 ), 1 );
				writer.setSelectionFocus( root.getChild( 0 ), 2 );
			} );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							attributes: [],
							children: [
								{
									type: 'text',
									text: 'a'
								},
								{
									type: 'element',
									name: 'strong',
									children: [
										{
											type: 'text',
											text: 'bc'
										}
									]
								},
								{
									type: 'text',
									text: 'de',
									positionsBefore: [
										{ offset: 2, isEnd: false, presentation: null, type: 'selection', name: null }
									],
									positions: [
										{ offset: 1, isEnd: true, presentation: null, type: 'selection', name: null }
									]
								}
							]
						}
					]
				}
			] );
		} );

		it( 'should render a tree #7', () => {
			const root = editor.editing.view.document.getRoot();

			editor.setData( '<p>a<b>bc</b>de</p>' );

			// <p>[a<b>bc</b>]de</p>
			editor.editing.view.change( writer => {
				writer.setSelection( root.getChild( 0 ), 2 );
				writer.setSelectionFocus( root.getChild( 0 ), 0 );
			} );

			const ranges = getEditorViewRanges( editor, 'main' );
			const definition = getEditorViewTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges
			} );

			assertTreeItems( definition, [
				{
					type: 'element',
					name: 'div',
					attributes: ROOT_ATTRIBUTES,
					children: [
						{
							type: 'element',
							name: 'p',
							attributes: [],
							children: [
								{
									type: 'text',
									text: 'a',
									positionsBefore: [
										{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null }
									]
								},
								{
									type: 'element',
									name: 'strong',
									children: [
										{
											type: 'text',
											text: 'bc'
										}
									],
									positionsAfter: [
										{ offset: 2, isEnd: true, presentation: null, type: 'selection', name: null }
									]
								},
								{
									type: 'text',
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
