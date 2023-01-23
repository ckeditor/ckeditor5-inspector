/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { SET_VIEW_CURRENT_ROOT_NAME } from '../../../src/view/data/actions';

import Tree from '../../../src/components/tree/tree.js';
import Select from '../../../src/components/select';
import Checkbox from '../../../src/components/checkbox';
import ViewTree from '../../../src/view/tree';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( '<ViewTree />', () => {
	let editor, wrapper, element, store, dispatchSpy;

	beforeEach( () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ]
		} ).then( newEditor => {
			editor = newEditor;

			store = createStore( ( state, action ) => ( { ...state, ...action.state } ), {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				ui: {
					activeTab: 'View'
				},
				view: {
					roots: [ ...editor.editing.view.document.roots ],
					ranges: [],
					treeDefinition: null,
					currentRootName: 'main',
					currentNode: editor.editing.view.document.getRoot(),
					ui: {
						activeTab: 'Selection',
						showElementTypes: false
					}
				}
			} );

			dispatchSpy = sinon.spy( store, 'dispatch' );

			wrapper = mount( <Provider store={store}><ViewTree /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a view root <Select> that changes the current root name', () => {
			const select = wrapper.find( Select );

			expect( select.props().label ).to.equal( 'Root' );
			expect( select.props().value ).to.equal( 'main' );
			expect( select.props().options ).to.have.members( [ 'main' ] );

			select.props().onChange( { target: { value: 'foo' } } );
			sinon.assert.calledWithExactly( dispatchSpy, {
				currentRootName: 'foo',
				type: SET_VIEW_CURRENT_ROOT_NAME
			} );
		} );

		it( 'should render a show element types <Checkbox>', () => {
			const checkbox = wrapper.find( Checkbox );

			expect( checkbox.props().label ).to.equal( 'Show element types' );
			expect( checkbox.props().isChecked ).to.be.false;
			expect( checkbox.props().onChange ).to.equal( wrapper.find( 'ViewTree' ).props().toggleViewShowElementTypes );
		} );

		it( 'should use a <Tree> component', () => {
			const tree = wrapper.find( Tree );
			const viewTree = wrapper.find( 'ViewTree' );

			expect( tree.props().definition ).to.equal( viewTree.props().treeDefinition );
			expect( tree.props().onClick ).to.equal( viewTree.instance().handleTreeClick );
			expect( tree.props().showCompactText ).to.equal( 'true' );
			expect( tree.props().activeNode ).to.equal( editor.editing.view.document.getRoot() );
			expect( tree.props().textDirection ).to.equal( 'ltr' );
		} );
	} );
} );
