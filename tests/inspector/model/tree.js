/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { SET_MODEL_CURRENT_ROOT_NAME } from '../../../src/model/data/actions';
import {
	getEditorModelRanges,
	getEditorModelMarkers,
	getEditorModelTreeDefinition
} from '../../../src/model/data/utils';

import Tree from '../../../src/components/tree/tree.js';
import Select from '../../../src/components/select';
import Checkbox from '../../../src/components/checkbox';
import ModelTree from '../../../src/model/tree';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( '<ModelTree />', () => {
	let editor, wrapper, element, store, dispatchSpy;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ],
			initialData: '<p>foobar</p>'
		} ).then( newEditor => {
			editor = newEditor;

			editor.model.change( writer => {
				const paragraph = editor.model.document.getRoot().getChild( 0 );

				writer.setSelection(
					writer.createRange( writer.createPositionAt( paragraph, 1 ), writer.createPositionAt( paragraph, 3 ) )
				);
			} );

			const ranges = getEditorModelRanges( editor, 'main' );
			const markers = getEditorModelMarkers( editor, 'main' );
			const definition = getEditorModelTreeDefinition( {
				currentEditor: editor,
				currentRootName: 'main',
				ranges,
				markers
			} );

			store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				model: {
					roots: [ ...editor.model.document.roots ],
					ranges,
					markers,
					treeDefinition: definition,
					currentRootName: 'main',
					currentNode: editor.model.document.getRoot(),
					ui: {
						showMarkers: false,
						showCompactText: false
					}
				}
			} );

			dispatchSpy = sinon.spy( store, 'dispatch' );

			wrapper = mount( <Provider store={store}><ModelTree /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a model root <Select> that changes current root name', () => {
			const select = wrapper.find( Select );

			expect( select.props().label ).to.equal( 'Root' );
			expect( select.props().value ).to.equal( 'main' );
			expect( select.props().options ).to.have.members( [ 'main', '$graveyard' ] );

			select.props().onChange( { target: { value: '$graveyard' } } );
			sinon.assert.calledWithExactly( dispatchSpy, {
				currentRootName: '$graveyard',
				type: SET_MODEL_CURRENT_ROOT_NAME
			} );
		} );

		it( 'should render a compact text <Checkbox>', () => {
			const checkbox = wrapper.find( Checkbox ).first();

			expect( checkbox.props().label ).to.equal( 'Compact text' );
			expect( checkbox.props().isChecked ).to.be.false;
			expect( checkbox.props().onChange ).to.equal( wrapper.find( 'ModelTree' ).props().toggleModelShowCompactText );
		} );

		it( 'should render a show markers <Checkbox>', () => {
			const checkbox = wrapper.find( Checkbox ).last();

			expect( checkbox.props().label ).to.equal( 'Show markers' );
			expect( checkbox.props().isChecked ).to.be.false;
			expect( checkbox.props().onChange ).to.equal( wrapper.find( 'ModelTree' ).props().toggleModelShowMarkers );
		} );

		it( 'should use a <Tree> component', () => {
			const tree = wrapper.find( Tree );
			const modelTree = wrapper.find( 'ModelTree' );

			expect( tree.props().definition ).to.equal( modelTree.props().treeDefinition );
			expect( tree.props().onClick ).to.equal( modelTree.instance().handleTreeClick );
			expect( tree.props().showCompactText ).to.be.false;
			expect( tree.props().activeNode ).to.equal( editor.model.document.getRoot() );
			expect( tree.props().textDirection ).to.equal( 'ltr' );
		} );
	} );
} );
