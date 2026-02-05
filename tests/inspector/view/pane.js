/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import ViewPane from '../../../src/view/pane';

describe( '<ViewPane />', () => {
	let editor, renderResult, element, store;

	beforeEach( async () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element );

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

		renderResult = render( <Provider store={store}><ViewPane /></Provider> );
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
				view: {
					ui: {}
				}
			} );

			renderResult = render( <Provider store={store}><ViewPane /></Provider> );
			expect( screen.getByText( 'Nothing to show. Attach another editor instance to start inspecting.' ) )
				.toBeInTheDocument();
		} );

		it( 'should render <Tabs> with a proper change handler', () => {
			const activeTab = document.querySelector( '.ck-inspector-horizontal-nav__item_active' );
			expect( activeTab ).toHaveTextContent( 'Selection' );
		} );

		it( 'should render a <ViewTree/>', () => {
			expect( document.querySelector( '.ck-inspector-tree' ) ).toBeTruthy();
		} );

		it( 'should render a <ViewNodeInspector/> if the active tab is "Inspect"', () => {
			renderResult.unmount();
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

			renderResult = render( <Provider store={store}><ViewPane /></Provider> );
			expect( screen.getByText( 'Select a node in the tree to inspect' ) ).toBeInTheDocument();
		} );

		it( 'should render a <ViewSelectionInspector/> if the active tab is "Selection"', () => {
			renderResult.unmount();
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

			renderResult = render( <Provider store={store}><ViewPane /></Provider> );
			expect( screen.getByRole( 'button', { name: 'Scroll to selection' } ) ).toBeInTheDocument();
		} );
	} );
} );
