/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import CommandsPane from '../../../src/commands/pane';

describe( '<CommandsPane />', () => {
	let editor, renderResult, element, store;

	beforeEach( async () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element );

		store = createStore( state => state, {
			editors: new Map( [ [ 'test-editor', editor ] ] ),
			currentEditorName: 'test-editor',
			ui: {
				activeTab: 'Commands'
			},
			commands: {
			}
		} );

		renderResult = render( <Provider store={store}><CommandsPane /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'renders a placeholder when no props#currentEditorName', () => {
			store = createStore( state => state, {
				currentEditorName: null,
				model: {
					ui: {}
				}
			} );

			const { unmount } = render( <Provider store={store}><CommandsPane /></Provider> );
			expect( screen.getByText( 'Nothing to show. Attach another editor instance to start inspecting.' ) )
				.toBeInTheDocument();
			unmount();
		} );

		it( 'should render <Tabs>', () => {
			const activeTab = document.querySelector( '.ck-inspector-horizontal-nav__item_active' );
			expect( activeTab ).toHaveTextContent( 'Inspect' );
		} );

		it( 'should render a <CommandTree/>', () => {
			expect( document.querySelector( '.ck-inspector-tree' ) ).toBeTruthy();
		} );

		it( 'should render a <CommandInspector/>', () => {
			expect( screen.getByText( 'Select a command to inspect' ) ).toBeInTheDocument();
		} );
	} );
} );
