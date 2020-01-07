/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../../../utils/testeditor';
import Tree from '../../../../src/components/tree';
import Select from '../../../../src/components/select';
import Checkbox from '../../../../src/components/checkbox';
import ViewTree from '../../../../src/components/view/tree';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';
import { assertTreeItems } from '../../../../tests/utils/utils';

const ROOT_ATTRIBUTES = [
	[ 'lang', 'en' ],
	[ 'dir', 'ltr' ],
	[ 'aria-label', 'Rich Text Editor, main' ],
	[ 'role', 'textbox' ],
	[ 'contenteditable', 'true' ],
	[ 'class', 'ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline' ],
];

describe( '<ViewTree />', () => {
	let editor, wrapper, element, clickSpy, rootChangeSpy;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		clickSpy = sinon.spy();
		rootChangeSpy = sinon.spy();

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ]
		} ).then( newEditor => {
			editor = newEditor;

			wrapper = shallow( <ViewTree
				editor={editor}
				onClick={clickSpy}
				editorRoots={[ ...editor.editing.view.document.roots ]}
				currentRootName="main"
				onRootChange={rootChangeSpy}
			/>, { attachTo: container } );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'state', () => {
		it( 'has initial state', () => {
			const state = wrapper.state();

			expect( state.showTypes ).to.be.false;
		} );

		it( 'restores state#showTypes from the local storage', () => {
			window.localStorage.setItem( 'ck5-inspector-view-element-types', 'true' );

			const wrapper = mount(
				<ViewTree
					editor={editor}
					onClick={clickSpy}
					editorRoots={[ ...editor.editing.view.document.roots ]}
				/>,
				{ attachTo: container }
			);

			expect( wrapper.state().showTypes ).to.be.true;

			wrapper.unmount();
		} );
	} );

	describe( 'handleShowTypesChange()', () => {
		it( 'changes state#showTypes and saves to local storage', () => {
			const instance = wrapper.instance();

			instance.handleShowTypesChange( { target: { checked: 'foo' } } );

			expect( wrapper.state().showTypes ).to.equal( 'foo' );
			expect( window.localStorage.getItem( 'ck5-inspector-view-element-types' ) ).to.equal( 'foo' );
		} );
	} );

	describe( 'render()', () => {
		it( 'renders a view root <Select>', () => {
			const select = wrapper.find( Select );

			expect( select.props().label ).to.equal( 'Root' );
			expect( select.props().value ).to.equal( 'main' );
			expect( select.props().options ).to.have.members( [ 'main' ] );

			select.props().onChange( { target: { value: 'foo' } } );
			sinon.assert.calledWithExactly( rootChangeSpy, 'foo' );
		} );

		it( 'renders a show element types <Checkbox>', () => {
			const checkbox = wrapper.find( Checkbox );

			expect( checkbox.props().label ).to.equal( 'Show element types' );
			expect( checkbox.props().isChecked ).to.be.false;
			expect( checkbox.props().onChange ).to.equal( wrapper.instance().handleShowTypesChange );
		} );

		describe( 'tree', () => {
			it( 'is a <Tree>', () => {
				const tree = wrapper.find( Tree );

				expect( tree.props().onClick ).to.equal( clickSpy );
				expect( tree.props().showCompactText ).to.equal( 'true' );
				expect( tree.props().activeNode ).to.be.undefined;
				expect( tree.props().textDirection ).to.equal( 'ltr' );
			} );

			it( 'renders empty elements', () => {
				editor.setData( '<p></p>' );

				editor.editing.view.change( writer => {
					const foo = writer.createEmptyElement( 'foo' );
					writer.insert( editor.editing.view.document.selection.getFirstPosition(), foo );
				} );

				const tree = wrapper.find( Tree );
				const root = editor.editing.view.document.getRoot();

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'selection',
										isEnd: false
									},
									{
										type: 'selection',
										isEnd: true
									},
									{
										type: 'element',
										name: 'foo',
										node: root.getChild( 0 ).getChild( 0 ),
										attributes: [],
										presentation: {
											isEmpty: true
										}
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders with element types when state#showTypes is true', () => {
				editor.setData( '<p><b>foo</b></p>' );

				let emptyElement, uiElement;

				editor.editing.view.change( writer => {
					emptyElement = writer.createEmptyElement( 'foo' );
					writer.insert( editor.editing.view.document.selection.getFirstPosition(), emptyElement );

					uiElement = writer.createUIElement( 'foo' );
					writer.insert( editor.editing.view.document.selection.getFirstPosition(), uiElement );
				} );

				wrapper.setState( {
					showTypes: true
				} );

				const tree = wrapper.find( Tree );
				const root = editor.editing.view.document.getRoot();

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'root:div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'container:p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'element',
										name: 'empty:foo',
										node: emptyElement,
										attributes: [],
										children: [],
									},
									{
										type: 'element',
										name: 'ui:foo',
										node: uiElement,
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
										name: 'attribute:strong',
										node: root.getChild( 0 ).getChild( 2 ),
										children: [
											{
												type: 'text',
												node: root.getChild( 0 ).getChild( 2 ).getChild( 0 ),
												children: [
													{
														type: 'selection'
													},
													{
														type: 'selection',
														isEnd: true
													},
													'foo'
												]
											},
										]
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders UI element content as a comment', () => {
				editor.setData( '<p></p>' );

				let uiElement;

				editor.editing.view.change( writer => {
					uiElement = writer.createUIElement( 'foo' );
					writer.insert(
						writer.createPositionAt( editor.editing.view.document.getRoot().getChild( 0 ), 0 ),
						uiElement );
				} );

				const tree = wrapper.find( Tree );
				const root = editor.editing.view.document.getRoot();

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'selection'
									},
									{
										type: 'selection',
										isEnd: true
									},
									{
										type: 'element',
										name: 'foo',
										node: uiElement,
										attributes: [],
										children: [
											{
												type: 'comment',
												text: /The View UI element content has been skipped/
											}
										]
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #1', () => {
				editor.setData( '<p></p>' );

				const tree = wrapper.find( Tree );
				const root = editor.editing.view.document.getRoot();

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'selection',
										isEnd: false
									},
									{
										type: 'selection',
										isEnd: true
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #1.1', () => {
				const root = editor.editing.view.document.getRoot();

				editor.setData( '<p></p><p></p>' );

				// <p>[</p><p>]</p>
				editor.editing.view.change( writer => {
					writer.setSelection( root.getChild( 1 ), 0 );
					writer.setSelectionFocus( root.getChild( 0 ), 0 );
				} );

				const tree = wrapper.find( Tree );

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'selection',
										isEnd: false
									},
								],
							},
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 1 ),
								attributes: [],
								children: [
									{
										type: 'selection',
										isEnd: true
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #2', () => {
				// <p>[]foo</p>
				editor.setData( '<p>foo</p>' );

				const tree = wrapper.find( Tree );
				const root = editor.editing.view.document.getRoot();

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 0 ),
										children: [
											{
												type: 'selection'
											},
											{
												type: 'selection',
												isEnd: true
											},
											'foo'
										]
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #3', () => {
				const root = editor.editing.view.document.getRoot();

				editor.setData( '<p>f<b>o</b>o</p>' );

				// <p>f<b>[]o</b>o</p>
				editor.editing.view.change( writer => {
					writer.setSelection( root.getChild( 0 ).getChild( 1 ), 0 );
				} );

				const tree = wrapper.find( Tree );

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 0 ),
										children: [ 'f' ],
									},
									{
										type: 'element',
										name: 'strong',
										node: root.getChild( 0 ).getChild( 1 ),
										children: [
											{
												type: 'selection'
											},
											{
												type: 'selection',
												isEnd: true
											},
											{
												type: 'text',
												node: root.getChild( 0 ).getChild( 1 ).getChild( 0 ),
												children: [ 'o' ],
											}
										],
									},
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 2 ),
										children: [ 'o' ],
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #4', () => {
				const root = editor.editing.view.document.getRoot();

				editor.setData( '<p>f<b>oo</b>o</p>' );

				// <p>f<b>o[]o</b>o</p>
				editor.editing.view.change( writer => {
					writer.setSelection( root.getChild( 0 ).getChild( 1 ).getChild( 0 ), 1 );
				} );

				const tree = wrapper.find( Tree );

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 0 ),
										children: [ 'f' ],
									},
									{
										type: 'element',
										name: 'strong',
										node: root.getChild( 0 ).getChild( 1 ),
										children: [
											{
												type: 'text',
												node: root.getChild( 0 ).getChild( 1 ).getChild( 0 ),
												children: [
													'o',
													{
														type: 'selection'
													},
													{
														type: 'selection',
														isEnd: true
													},
													'o'
												]
											},
										],
									},
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 2 ),
										children: [ 'o' ],
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #5', () => {
				const root = editor.editing.view.document.getRoot();

				editor.setData( '<p>a<b>bc</b>de</p>' );

				// <p>a<b>b[c</b>d]e</p>
				editor.editing.view.change( writer => {
					writer.setSelection( root.getChild( 0 ).getChild( 2 ), 1 );
					writer.setSelectionFocus( root.getChild( 0 ).getChild( 1 ).getChild( 0 ), 1 );
				} );

				const tree = wrapper.find( Tree );

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 0 ),
										children: [ 'a' ],
									},
									{
										type: 'element',
										name: 'strong',
										node: root.getChild( 0 ).getChild( 1 ),
										children: [
											{
												type: 'text',
												node: root.getChild( 0 ).getChild( 1 ).getChild( 0 ),
												children: [
													'b',
													{
														type: 'selection'
													},
													'c'
												]
											},
										],
									},
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 2 ),
										children: [
											'd',
											{
												type: 'selection',
												isEnd: true
											},
											'e'
										],
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #6', () => {
				const root = editor.editing.view.document.getRoot();

				editor.setData( '<p>a<b>bc</b>de</p>' );

				// <p>a<b>bc</b>[d]e</p>
				editor.editing.view.change( writer => {
					writer.setSelection( root.getChild( 0 ).getChild( 2 ), 1 );
					writer.setSelectionFocus( root.getChild( 0 ), 2 );
				} );

				const tree = wrapper.find( Tree );

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 0 ),
										children: [ 'a' ],
									},
									{
										type: 'element',
										name: 'strong',
										node: root.getChild( 0 ).getChild( 1 ),
										children: [
											{
												type: 'text',
												node: root.getChild( 0 ).getChild( 1 ).getChild( 0 ),
												children: [
													'bc'
												]
											},
										],
									},
									{
										type: 'selection'
									},
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 2 ),
										children: [
											'd',
											{
												type: 'selection',
												isEnd: true
											},
											'e'
										],
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #7', () => {
				const root = editor.editing.view.document.getRoot();

				editor.setData( '<p>a<b>bc</b>de</p>' );

				// <p>[a<b>bc</b>]de</p>
				editor.editing.view.change( writer => {
					writer.setSelection( root.getChild( 0 ), 2 );
					writer.setSelectionFocus( root.getChild( 0 ), 0 );
				} );

				const tree = wrapper.find( Tree );

				assertTreeItems( tree.props().items, [
					{
						type: 'element',
						name: 'div',
						node: root,
						attributes: ROOT_ATTRIBUTES,
						children: [
							{
								type: 'element',
								name: 'p',
								node: root.getChild( 0 ),
								attributes: [],
								children: [
									{
										type: 'selection'
									},
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 0 ),
										children: [ 'a' ],
									},
									{
										type: 'element',
										name: 'strong',
										node: root.getChild( 0 ).getChild( 1 ),
										children: [
											{
												type: 'text',
												node: root.getChild( 0 ).getChild( 1 ).getChild( 0 ),
												children: [
													'bc'
												]
											},
										],
									},
									{
										type: 'selection',
										isEnd: true
									},
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 2 ),
										children: [
											'de'
										],
									}
								],
							}
						],
					}
				] );
			} );
		} );
	} );
} );
