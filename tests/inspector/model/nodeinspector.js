/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { reducer } from '../../../src/data/reducer';
import { getEditorModelNodeDefinition } from '../../../src/model/data/utils';

import Button from '../../../src/components/button';
import ObjectInspector from '../../../src/components/objectinspector';
import Logger from '../../../src/logger';
import ModelNodeInspector from '../../../src/model/nodeinspector';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( '<ModelNodeInspector />', () => {
	let editor, wrapper, element, root, store;

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ],
			initialData: '<p>foo</p>'
		} ).then( newEditor => {
			editor = newEditor;

			root = editor.model.document.getRoot();

			store = createStore( reducer, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				ui: {
					activeTab: 'Model'
				},
				model: {
					currentNodeDefinition: getEditorModelNodeDefinition( editor, root.getChild( 0 ) )
				}
			} );

			wrapper = mount( <Provider store={store}><ModelNodeInspector /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();
		sinon.restore();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a placeholder when no props#currentNodeDefinition', () => {
			const store = createStore( state => state, {
				model: {
					currentNodeDefinition: null
				}
			} );

			const wrapper = mount( <Provider store={store}><ModelNodeInspector /></Provider> );

			expect( wrapper.text() ).to.match( /^Select a node / );

			wrapper.unmount();
		} );

		it( 'should render an object inspector when there is props#currentNodeDefinition', () => {
			expect( wrapper.find( ObjectInspector ) ).to.have.length( 1 );
		} );

		it( 'should render the log button in the header', () => {
			const logNodeButton = wrapper.find( Button ).first();
			const logSpy = sinon.stub( Logger, 'log' ).callsFake( () => {} );

			logNodeButton.simulate( 'click' );
			sinon.assert.calledOnce( logSpy );
		} );

		it( 'should render the show in schema button in the header', () => {
			const showInSchema = wrapper.find( Button ).last();

			showInSchema.simulate( 'click' );

			expect( store.getState().ui.activeTab ).to.equal( 'Schema' );
			expect( store.getState().schema.currentSchemaDefinitionName ).to.equal( 'paragraph' );
		} );

		it( 'should render for a <RootElement>', () => {
			const store = createStore( state => state, {
				model: {
					currentNodeDefinition: getEditorModelNodeDefinition( editor, root )
				}
			} );

			const wrapper = mount( <Provider store={store}><ModelNodeInspector /></Provider> );

			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'RootElement:main' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				childCount: { value: '1' },
				startOffset: { value: 'null' },
				endOffset: { value: 'null' },
				maxOffset: { value: '1' },
				path: { value: '[]' }
			} );

			wrapper.unmount();
		} );

		it( 'should render for an <Element>', () => {
			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'Element:paragraph' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				childCount: { value: '1' },
				startOffset: { value: '0' },
				endOffset: { value: '1' },
				maxOffset: { value: '3' },
				path: { value: '[0]' }
			} );
		} );

		it( 'should render for a <Text>', () => {
			editor.setData( '<p><b>f</b>oo</p>' );

			const store = createStore( state => state, {
				model: {
					currentNodeDefinition: getEditorModelNodeDefinition( editor, root.getChild( 0 ).getChild( 0 ) )
				}
			} );

			const wrapper = mount( <Provider store={store}><ModelNodeInspector /></Provider> );

			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'Text:f' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {
				bold: {
					value: 'true',
					subProperties: {
						isFormatting: { value: 'true' },
						copyOnEnter: { value: 'true' }
					}
				}
			} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				startOffset: { value: '0' },
				endOffset: { value: '1' },
				offsetSize: { value: '1' },
				path: { value: '[0,0]' }
			} );

			wrapper.unmount();
		} );
	} );
} );
