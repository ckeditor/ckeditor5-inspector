/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../../utils/testeditor';
import Tree from '../../../../src/components/tree';
import CommandTree from '../../../../src/components/commands/tree';

describe( '<CommandTree />', () => {
	let editor, wrapper, element, clickSpy;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );
		clickSpy = sinon.spy();

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			wrapper = shallow( <CommandTree editor={editor} onClick={clickSpy} /> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'renders a tree with commands in alphabetical order', () => {
			const tree = wrapper.find( Tree );

			expect( tree.props().items ).to.deep.equal( [
				{
					'attributes': [],
					'children': [],
					'name': 'bar',
					'node': 'bar',
					'presentation': {
						'cssClass': 'ck-inspector-tree-node_tagless ',
						'isEmpty': true,
					},
					'type': 'element',
				},
				{
					'attributes': [],
					'children': [],
					'name': 'foo',
					'node': 'foo',
					'presentation': {
						'cssClass': 'ck-inspector-tree-node_tagless ',
						'isEmpty': true,
					},
					'type': 'element'
				},
				{
					'attributes': [],
					'children': [],
					'name': 'qux',
					'node': 'qux',
					'presentation': {
						'cssClass': 'ck-inspector-tree-node_tagless ',
						'isEmpty': true,
					},
					'type': 'element'
				}
			] );
		} );

		it( 'refreshes tree on editor.model.document#change', () => {
			editor.commands.get( 'foo' ).value = 'bar';
			sinon.stub( editor.commands.get( 'bar' ), 'isEnabled' ).get( () => false );
			editor.model.document.fire( 'change' );

			expect( wrapper.find( Tree ).props().items ).to.deep.equal( [
				{
					'attributes': [],
					'children': [],
					'name': 'bar',
					'node': 'bar',
					'presentation': {
						'cssClass': 'ck-inspector-tree-node_tagless ck-inspector-tree-node_disabled',
						'isEmpty': true,
					},
					'type': 'element',
				},
				{
					'attributes': [
						[ 'value', 'bar' ]
					],
					'children': [],
					'name': 'foo',
					'node': 'foo',
					'presentation': {
						'cssClass': 'ck-inspector-tree-node_tagless ',
						'isEmpty': true,
					},
					'type': 'element'
				},
				{
					'attributes': [],
					'children': [],
					'name': 'qux',
					'node': 'qux',
					'presentation': {
						'cssClass': 'ck-inspector-tree-node_tagless ',
						'isEmpty': true,
					},
					'type': 'element'
				}
			] );
		} );
	} );
} );
