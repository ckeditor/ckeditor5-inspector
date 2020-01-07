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
import ModelTree from '../../../../src/components/model/tree';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';
import { assertTreeItems } from '../../../../tests/utils/utils';

describe( '<ModelTree />', () => {
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

			wrapper = shallow( <ModelTree
				editor={editor}
				onClick={clickSpy}
				editorRoots={[ ...editor.model.document.roots ]}
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

			expect( state.showCompactText ).to.be.false;
		} );

		it( 'restores state#showCompactText from the local storage', () => {
			window.localStorage.setItem( 'ck5-inspector-model-compact-text', 'true' );

			const wrapper = mount(
				<ModelTree
					editor={editor}
					onClick={clickSpy}
					editorRoots={[ ...editor.model.document.roots ]}
				/>,
				{ attachTo: container }
			);

			expect( wrapper.state().showCompactText ).to.be.true;

			wrapper.unmount();
		} );
	} );

	describe( 'handleCompactTextChange()', () => {
		it( 'changes state#showCompactText and saves to local storage', () => {
			const instance = wrapper.instance();

			instance.handleCompactTextChange( { target: { checked: true } } );

			expect( wrapper.state().showCompactText ).to.be.true;
			expect( window.localStorage.getItem( 'ck5-inspector-model-compact-text' ) ).to.equal( 'true' );
		} );
	} );

	describe( 'render()', () => {
		it( 'renders a model root <Select>', () => {
			const select = wrapper.find( Select );

			expect( select.props().label ).to.equal( 'Root' );
			expect( select.props().value ).to.equal( 'main' );
			expect( select.props().options ).to.have.members( [ 'main', '$graveyard' ] );

			select.props().onChange( { target: { value: '$graveyard' } } );
			sinon.assert.calledWithExactly( rootChangeSpy, '$graveyard' );
		} );

		it( 'renders a compact text <Checkbox>', () => {
			const checkbox = wrapper.find( Checkbox );

			expect( checkbox.props().label ).to.equal( 'Compact text' );
			expect( checkbox.props().isChecked ).to.be.false;
			expect( checkbox.props().onChange ).to.equal( wrapper.instance().handleCompactTextChange );
		} );

		describe( 'tree', () => {
			it( 'is a <Tree>', () => {
				const tree = wrapper.find( Tree );

				expect( tree.props().onClick ).to.equal( clickSpy );
				expect( tree.props().showCompactText ).to.be.false;
				expect( tree.props().activeNode ).to.be.undefined;
				expect( tree.props().textDirection ).to.equal( 'ltr' );
			} );

			it( 'renders a tree #1', () => {
				// <paragraph>[]</paragraph>
				editor.setData( '<p></p>' );

				const tree = wrapper.find( Tree );
				const root = editor.model.document.getRoot();

				assertTreeItems( tree.props().items, [
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
				const root = editor.model.document.getRoot();

				editor.setData( '<p></p><p></p>' );

				// <paragraph>[</paragraph><paragraph>]</paragraph>
				editor.model.change( writer => {
					writer.setSelection( root.getChild( 1 ), 0 );
					writer.setSelectionFocus( root.getChild( 0 ), 0 );
				} );

				const tree = wrapper.find( Tree );

				assertTreeItems( tree.props().items, [
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
										type: 'selection',
										isEnd: false
									},
								],
							},
							{
								type: 'element',
								name: 'paragraph',
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
				// <paragraph>[]foo</paragraph>
				editor.setData( '<p>foo</p>' );

				const tree = wrapper.find( Tree );
				const root = editor.model.document.getRoot();

				assertTreeItems( tree.props().items, [
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
										type: 'selection',
										isEnd: false
									},
									{
										type: 'selection',
										isEnd: true
									},
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 0 ),
										presentation: {
											dontRenderAttributeValue: true
										},
										children: [ 'foo' ],
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #3', () => {
				const root = editor.model.document.getRoot();

				editor.setData( '<p>f<b>o</b>o</p>' );

				// <paragraph>f<$text bold>[]o</$text>o</paragraph>
				editor.model.change( writer => {
					writer.setSelection( root.getChild( 0 ), 1 );
				} );

				const tree = wrapper.find( Tree );

				assertTreeItems( tree.props().items, [
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
										children: [ 'f' ],
									},
									{
										type: 'selection',
										isEnd: false
									},
									{
										type: 'selection',
										isEnd: true
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
										children: [ 'o' ],
									},
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 2 ),
										presentation: {
											dontRenderAttributeValue: true
										},
										children: [ 'o' ],
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #4', () => {
				const root = editor.model.document.getRoot();

				editor.setData( '<p>f<b>oo</b>o</p>' );

				// <paragraph>f<$text bold>o[]o</$text>o</paragraph>
				editor.model.change( writer => {
					writer.setSelection( root.getChild( 0 ), 2 );
				} );

				const tree = wrapper.find( Tree );

				assertTreeItems( tree.props().items, [
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
										children: [ 'f' ],
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
										children: [
											'o',
											{
												type: 'selection',
												isEnd: false
											},
											{
												type: 'selection',
												isEnd: true
											},
											'o'
										],
									},
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 2 ),
										presentation: {
											dontRenderAttributeValue: true
										},
										children: [ 'o' ],
									}
								],
							}
						],
					}
				] );
			} );

			it( 'renders a tree #5', () => {
				const root = editor.model.document.getRoot();

				editor.setData( '<p>a<b>bc</b>de</p>' );

				// <paragraph>a<$text bold>b[c</$text>d]e</paragraph>
				editor.model.change( writer => {
					writer.setSelection( root.getChild( 0 ), 4 );
					writer.setSelectionFocus( root.getChild( 0 ), 2 );
				} );

				const tree = wrapper.find( Tree );

				assertTreeItems( tree.props().items, [
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
										children: [ 'a' ],
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
										children: [
											'b',
											{
												type: 'selection',
												isEnd: false
											},
											'c'
										],
									},
									{
										type: 'text',
										node: root.getChild( 0 ).getChild( 2 ),
										presentation: {
											dontRenderAttributeValue: true
										},
										children: [
											'd',
											{
												type: 'selection',
												isEnd: true
											},
											'e'
										]
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
