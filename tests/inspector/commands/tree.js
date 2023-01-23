/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { getCommandsTreeDefinition } from '../../../src/commands/data/utils';

import Tree from '../../../src/components/tree/tree.js';
import CommandTree from '../../../src/commands/tree';

describe( '<CommandTree />', () => {
	let editor, wrapper, element, store;

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			const editors = new Map( [ [ 'test-editor', editor ] ] );
			const currentEditorName = 'test-editor';

			store = createStore( state => state, {
				editors,
				currentEditorName,
				ui: {
					activeTab: 'Commands'
				},
				commands: {
					currentCommandName: 'foo',
					treeDefinition: getCommandsTreeDefinition( { editors, currentEditorName } )
				}
			} );

			wrapper = mount( <Provider store={store}><CommandTree /></Provider> );
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
			const commandsTree = wrapper.find( 'CommandTree' );

			expect( tree.props().definition ).to.equal( commandsTree.props().treeDefinition );
			expect( tree.props().onClick ).to.equal( commandsTree.instance().handleTreeClick );
			expect( tree.props().activeNode ).to.equal( 'foo' );
		} );

		it( 'should render a <Tree> with commands in alphabetical order', () => {
			const tree = wrapper.find( Tree );

			expect( tree.props().definition ).to.deep.equal( [
				{
					attributes: [],
					children: [],
					name: 'bar',
					node: 'bar',
					presentation: {
						cssClass: 'ck-inspector-tree-node_tagless ',
						isEmpty: true
					},
					type: 'element'
				},
				{
					attributes: [],
					children: [],
					name: 'foo',
					node: 'foo',
					presentation: {
						cssClass: 'ck-inspector-tree-node_tagless ',
						isEmpty: true
					},
					type: 'element'
				},
				{
					attributes: [],
					children: [],
					name: 'qux',
					node: 'qux',
					presentation: {
						cssClass: 'ck-inspector-tree-node_tagless ',
						isEmpty: true
					},
					type: 'element'
				}
			] );
		} );
	} );
} );
