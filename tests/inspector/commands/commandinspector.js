/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { getEditorCommandDefinition } from '../../../src/commands/data/utils';
import Logger from '../../../src/logger';
import CommandInspector from '../../../src/commands/commandinspector';

describe( '<CommandInspector />', () => {
	let editor, renderResult, element, store;

	beforeEach( async () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element );

		const editors = new Map( [ [ 'test-editor', editor ] ] );
		const currentEditorName = 'test-editor';

		store = createStore( state => state, {
			editors,
			currentEditorName,
			ui: {
				activeTab: 'Commands'
			},
			commands: {
				currentCommandName: 'foo',
				currentCommandDefinition: getEditorCommandDefinition( { editors, currentEditorName }, 'foo' ),
				treeDefinition: null
			}
		} );

		renderResult = render( <Provider store={store}><CommandInspector /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		vi.restoreAllMocks();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a placeholder when no props#currentCommandDefinition', () => {
			const store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				commands: {
					currentCommandDefinition: null
				}
			} );

			const { unmount } = render( <Provider store={store}><CommandInspector /></Provider> );
			expect( screen.getByText( /^Select a command to/ ) ).toBeInTheDocument();
			unmount();
		} );

		it( 'should render an object inspector when there is props#currentCommandDefinition', () => {
			expect( screen.getByRole( 'heading', { level: 2 } ) ).toBeInTheDocument();
		} );

		it( 'should render the execute command button in the header', () => {
			const execSpy = vi.spyOn( editor.commands.get( 'foo' ), 'execute' );

			fireEvent.click( screen.getByRole( 'button', { name: 'Execute command' } ) );
			expect( execSpy ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'should render the log button in the header', () => {
			const logSpy = vi.spyOn( Logger, 'log' ).mockImplementation( () => {} );

			fireEvent.click( screen.getByRole( 'button', { name: 'Log in console' } ) );
			expect( logSpy ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'renders command info', () => {
			expect( screen.getByLabelText( 'isEnabled' ) ).toHaveValue( 'true' );
			expect( screen.getByLabelText( 'value' ) ).toHaveValue( 'undefined' );
		} );
	} );
} );
