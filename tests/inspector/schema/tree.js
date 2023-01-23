/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { getSchemaTreeDefinition } from '../../../src/schema/data/utils';

import { reducer } from '../../../src/data/reducer';
import Tree from '../../../src/components/tree/tree.js';
import SchemaTree from '../../../src/schema/tree';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

describe( '<SchemaTree />', () => {
	let editor, wrapper, element, store;

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph ]
		} ).then( newEditor => {
			editor = newEditor;

			const editors = new Map( [ [ 'test-editor', editor ] ] );
			const currentEditorName = 'test-editor';

			store = createStore( reducer, {
				editors,
				currentEditorName,
				ui: {
					activeTab: 'Schema'
				},
				schema: {
					currentSchemaDefinitionName: 'paragraph',
					treeDefinition: getSchemaTreeDefinition( { editors, currentEditorName } )
				}
			} );

			wrapper = mount( <Provider store={store}><SchemaTree /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should use a <Tree> component', () => {
			const tree = wrapper.find( Tree );
			const schemaTree = wrapper.find( 'SchemaTree' );

			expect( tree.props().definition ).to.equal( schemaTree.props().treeDefinition );
			expect( tree.props().onClick ).to.equal( schemaTree.instance().handleTreeClick );
			expect( tree.props().activeNode ).to.equal( 'paragraph' );
		} );

		it( 'should render a <Tree> with schema items in alphabetical order', () => {
			const tree = wrapper.find( Tree );

			// Note: Asserting just a few. There are plenty of them and they will change as the editor develops.
			expect( tree.props().definition ).to.include.deep.members( [
				{
					attributes: [],
					children: [],
					name: '$root',
					node: '$root',
					presentation: {
						cssClass: 'ck-inspector-tree-node_tagless',
						isEmpty: true
					},
					type: 'element'
				},
				{
					attributes: [],
					children: [],
					name: '$text',
					node: '$text',
					presentation: {
						cssClass: 'ck-inspector-tree-node_tagless',
						isEmpty: true
					},
					type: 'element'
				},
				{
					attributes: [],
					children: [],
					name: 'paragraph',
					node: 'paragraph',
					presentation: {
						cssClass: 'ck-inspector-tree-node_tagless',
						isEmpty: true
					},
					type: 'element'
				}
			] );
		} );

		it( 'should start inspecting a schema definition when an item was clicked', () => {
			const tree = wrapper.find( Tree );
			const element = tree.find( 'TreeElement' ).first();

			element.simulate( 'click' );

			expect( store.getState().schema.currentSchemaDefinitionName ).to.equal( '$block' );
		} );
	} );
} );
