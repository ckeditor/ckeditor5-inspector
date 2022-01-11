/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import EditorQuickActions from '../../src/editorquickactions';

describe( '<EditorQuickActions />', () => {
	let editor, store, wrapper, element;

	beforeEach( () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			store = createStore( ( state, action ) => ( { ...state, ...action.state } ), {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				ui: {
					activeTab: 'Model'
				},
				currentEditorGlobals: {},
				model: {
					roots: [],
					ranges: [],
					markers: [],
					treeDefinition: null,
					currentRootName: 'main',
					ui: {
						activeTab: 'Selection',
						showMarkers: false,
						showCompactText: false
					}
				}
			} );

			wrapper = mount( <Provider store={store}><EditorQuickActions /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render an element with a CSS class', () => {
			expect( wrapper.children().childAt( 0 ) ).to.have.className( 'ck-inspector-editor-quick-actions' );
		} );

		describe( 'log editor button', () => {
			it( 'should be rendered and log the editor in the console', () => {
				const logSpy = sinon.stub( console, 'log' );
				const logButton = wrapper.find( 'Button' ).at( 0 );

				logButton.simulate( 'click' );

				sinon.assert.calledOnce( logSpy );
				sinon.assert.calledWith( logSpy, editor );

				logSpy.restore();
			} );
		} );

		describe( 'log editor data button', () => {
			it( 'should be rendered and log the editor data in the console', () => {
				const logSpy = sinon.stub( console, 'log' );
				const logButton = wrapper.find( 'Button' ).at( 1 );

				logButton.simulate( 'click' );

				sinon.assert.calledOnce( logSpy );
				sinon.assert.calledWith( logSpy, editor.getData() );

				logSpy.restore();
			} );
		} );

		describe( 'toggle read only button', () => {
			it( 'should be rendered and toggle the editor read only state', () => {
				const toggleReadOnlyButton = wrapper.find( 'Button' ).at( 2 );

				toggleReadOnlyButton.simulate( 'click' );
				expect( editor.isReadOnly ).to.be.true;

				toggleReadOnlyButton.simulate( 'click' );
				expect( editor.isReadOnly ).to.be.false;
			} );
		} );

		describe( 'destroy editor button', () => {
			it( 'should be rendered and destory the editor', () => {
				const destroyButton = wrapper.find( 'Button' ).at( 3 );
				const spy = sinon.spy( editor, 'destroy' );

				destroyButton.simulate( 'click' );
				sinon.assert.calledOnce( spy );
			} );
		} );

		it( 'should enable all buttons when there is a current editor', () => {
			wrapper.find( 'Button' ).forEach( button => {
				expect( button.props().isEnabled ).to.be.true;
			} );
		} );

		it( 'should disable all buttons when there is no current editor', () => {
			store.dispatch( {
				type: 'testAction',
				state: {
					editors: new Map(),
					currentEditorName: null
				}
			} );

			wrapper.update();

			wrapper.find( 'Button' ).forEach( button => {
				expect( button.props().isEnabled ).to.be.false;
			} );
		} );
	} );
} );
