/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import CommandsPane from '../../../src/commands/pane';
import CommandTree from '../../../src/commands/tree';
import CommandInspector from '../../../src/commands/commandinspector';

describe( '<CommandsPane />', () => {
	let editor, wrapper, element, store;

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
					activeTab: 'Commands'
				},
				commands: {
				}
			} );

			wrapper = mount( <Provider store={store}><CommandsPane /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'renders a placeholder when no props#currentEditorName', () => {
			store = createStore( state => state, {
				currentEditorName: null,
				model: {
					ui: {}
				}
			} );

			const wrapper = mount( <Provider store={store}><CommandsPane /></Provider> );

			expect( wrapper.text() ).to.match( /^Nothing to show/ );

			wrapper.unmount();
		} );

		it( 'should render <Tabs>', () => {
			const tabs = wrapper.find( 'Tabs' );

			expect( tabs ).to.have.length( 1 );
			expect( tabs.props().activeTab ).to.equal( 'Inspect' );
		} );

		it( 'should render a <CommandTree/>', () => {
			expect( wrapper.find( CommandTree ) ).to.have.length( 1 );
		} );

		it( 'should render a <CommandInspector/>', () => {
			expect( wrapper.find( CommandInspector ) ).to.have.length( 1 );
		} );
	} );
} );
