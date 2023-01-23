/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import ModelPane from '../../../src/model/pane';
import ModelTree from '../../../src/model/tree';
import ModelNodeInspector from '../../../src/model/nodeinspector';
import ModelSelectionInspector from '../../../src/model/selectioninspector';
import ModelMarkersInspector from '../../../src/model/markerinspector';

describe( '<ModelPane />', () => {
	let editor, store, wrapper, element;

	beforeEach( () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				ui: {
					activeTab: 'Model'
				},
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

			wrapper = mount( <Provider store={store}><ModelPane /></Provider> );
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
				model: {
					ui: {}
				}
			} );

			const wrapper = mount( <Provider store={store}><ModelPane /></Provider> );

			expect( wrapper.text() ).to.match( /^Nothing to show/ );

			wrapper.unmount();
		} );

		it( 'should render <Tabs> with a proper change handler', () => {
			const tabs = wrapper.find( 'Tabs' );

			expect( tabs ).to.have.length( 1 );
			expect( tabs.props().activeTab ).to.equal( 'Selection' );
			expect( tabs.props().onTabChange ).to.equal( wrapper.find( 'ModelPane' ).props().setModelActiveTab );
		} );

		it( 'should render a <ModelTree/>', () => {
			expect( wrapper.find( ModelTree ) ).to.have.length( 1 );
		} );

		it( 'should render a <ModelNodeInspector/> if the active tab is "Inspect"', () => {
			store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				ui: {
					activeTab: 'Model'
				},
				model: {
					roots: [],
					ranges: [],
					markers: [],
					treeDefinition: null,
					currentRootName: 'main',
					ui: {
						activeTab: 'Inspect',
						showMarkers: false,
						showCompactText: false
					}
				}
			} );

			const wrapper = mount( <Provider store={store}><ModelPane /></Provider> );

			expect( wrapper.find( ModelNodeInspector ) ).to.have.length( 1 );

			wrapper.unmount();
		} );

		it( 'should render a <ModelSelectionInspector/> if the active tab is "Selection"', () => {
			store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				ui: {
					activeTab: 'Model'
				},
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

			const wrapper = mount( <Provider store={store}><ModelPane /></Provider> );

			expect( wrapper.find( ModelSelectionInspector ) ).to.have.length( 1 );

			wrapper.unmount();
		} );

		it( 'should render a <ModelMarkersInspector/> if the active tab is "Markers"', () => {
			store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				ui: {
					activeTab: 'Model'
				},
				model: {
					roots: [],
					ranges: [],
					markers: [],
					treeDefinition: null,
					currentRootName: 'main',
					ui: {
						activeTab: 'Markers',
						showMarkers: false,
						showCompactText: false
					}
				}
			} );

			const wrapper = mount( <Provider store={store}><ModelPane /></Provider> );

			expect( wrapper.find( ModelMarkersInspector ) ).to.have.length( 1 );

			wrapper.unmount();
		} );
	} );
} );
