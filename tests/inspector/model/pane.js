/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import ModelPane from '../../../src/model/pane';

describe( '<ModelPane />', () => {
	let editor, store, renderResult, element;

	beforeEach( async () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element );

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

		renderResult = render( <Provider store={store}><ModelPane /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a placeholder when no props#currentEditorName', () => {
			renderResult.unmount();
			store = createStore( state => state, {
				currentEditorName: null,
				model: {
					ui: {}
				}
			} );

			renderResult = render( <Provider store={store}><ModelPane /></Provider> );
			expect( screen.getByText( 'Nothing to show. Attach another editor instance to start inspecting.' ) )
				.toBeInTheDocument();
		} );

		it( 'should render <Tabs> with a proper change handler', () => {
			const activeTab = document.querySelector( '.ck-inspector-horizontal-nav__item_active' );
			expect( activeTab ).toHaveTextContent( 'Selection' );
		} );

		it( 'should render a <ModelTree/>', () => {
			expect( document.querySelector( '.ck-inspector-tree' ) ).toBeTruthy();
		} );

		it( 'should render a <ModelNodeInspector/> if the active tab is "Inspect"', () => {
			renderResult.unmount();
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

			renderResult = render( <Provider store={store}><ModelPane /></Provider> );
			expect( screen.getByText( 'Select a node in the tree to inspect' ) ).toBeInTheDocument();
		} );

		it( 'should render a <ModelSelectionInspector/> if the active tab is "Selection"', () => {
			renderResult.unmount();
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

			renderResult = render( <Provider store={store}><ModelPane /></Provider> );
			expect( screen.getByRole( 'button', { name: 'Scroll to selection' } ) ).toBeInTheDocument();
		} );

		it( 'should render a <ModelMarkersInspector/> if the active tab is "Markers"', () => {
			renderResult.unmount();
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

			renderResult = render( <Provider store={store}><ModelPane /></Provider> );
			expect( screen.getByText( 'Markers' ) ).toBeInTheDocument();
		} );
	} );
} );
