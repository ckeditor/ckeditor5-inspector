/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import ViewPane from '../../../src/view/pane';
import ViewTree from '../../../src/view/tree';
import ViewNodeInspector from '../../../src/view/nodeinspector';
import ViewSelectionInspector from '../../../src/view/selectioninspector';

describe( '<ViewPane />', () => {
	let editor, wrapper, element, store;

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
					activeTab: 'View'
				},
				view: {
					roots: [],
					ranges: [],
					treeDefinition: null,
					currentRootName: 'main',
					ui: {
						activeTab: 'Selection',
						showElementTypes: false
					}
				}
			} );

			wrapper = mount( <Provider store={store}><ViewPane /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a placeholder when no props#currentEditorName', () => {
			store = createStore( state => state, {
				currentEditorName: null,
				view: {
					ui: {}
				}
			} );

			const wrapper = mount( <Provider store={store}><ViewPane /></Provider> );

			expect( wrapper.text() ).to.match( /^Nothing to show/ );

			wrapper.unmount();
		} );

		it( 'should render <Tabs> with a proper change handler', () => {
			const tabs = wrapper.find( 'Tabs' );

			expect( tabs ).to.have.length( 1 );
			expect( tabs.props().activeTab ).to.equal( 'Selection' );
			expect( tabs.props().onTabChange ).to.equal( wrapper.find( 'ViewPane' ).props().setViewActiveTab );
		} );

		it( 'should render a <ViewTree/>', () => {
			expect( wrapper.find( ViewTree ) ).to.have.length( 1 );
		} );

		it( 'should render a <ViewNodeInspector/> if the active tab is "Inspect"', () => {
			store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				ui: {
					activeTab: 'View'
				},
				view: {
					roots: [],
					ranges: [],
					treeDefinition: null,
					currentRootName: 'main',
					ui: {
						activeTab: 'Inspect',
						showElementTypes: false
					}
				}
			} );

			const wrapper = mount( <Provider store={store}><ViewPane /></Provider> );

			expect( wrapper.find( ViewNodeInspector ) ).to.have.length( 1 );

			wrapper.unmount();
		} );

		it( 'should render a <ViewSelectionInspector/> if the active tab is "Selection"', () => {
			store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				ui: {
					activeTab: 'View'
				},
				view: {
					roots: [],
					ranges: [],
					treeDefinition: null,
					currentRootName: 'main',
					ui: {
						activeTab: 'Selection',
						showElementTypes: false
					}
				}
			} );

			const wrapper = mount( <Provider store={store}><ViewPane /></Provider> );

			expect( wrapper.find( ViewSelectionInspector ) ).to.have.length( 1 );

			wrapper.unmount();
		} );
	} );
} );
