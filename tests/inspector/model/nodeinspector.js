/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { Paragraph, BoldEditing } from 'ckeditor5';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';

import { reducer } from '../../../src/data/reducer';
import { getEditorModelNodeDefinition } from '../../../src/model/data/utils';

import Logger from '../../../src/logger';
import ModelNodeInspector from '../../../src/model/nodeinspector';

describe( '<ModelNodeInspector />', () => {
	let editor, renderResult, element, root, store;

	const renderWithStore = localStore => render( <Provider store={localStore}><ModelNodeInspector /></Provider> );

	const expectHeader = text => {
		const header = screen.getByRole( 'heading', { level: 2 } );
		expect( header ).toHaveTextContent( text );
		const link = header.querySelector( 'a' );
		expect( link ).toHaveAttribute( 'href', expect.stringMatching( /^https:\/\/ckeditor.com\/docs/ ) );
	};

	const expectPropertyValue = ( name, value ) => {
		const input = screen.getByLabelText( name );
		expect( input ).toHaveValue( value );
	};

	beforeEach( async () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ],
			initialData: '<p>foo</p>'
		} );

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

		renderResult = renderWithStore( store );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a placeholder when no props#currentNodeDefinition', () => {
			const localStore = createStore( state => state, {
				model: {
					currentNodeDefinition: null
				}
			} );

			const { unmount } = renderWithStore( localStore );
			expect( screen.getByText( /^Select a node / ) ).toBeInTheDocument();
			unmount();
		} );

		it( 'should render an object inspector when there is props#currentNodeDefinition', () => {
			expect( screen.getByRole( 'heading', { level: 2 } ) ).toBeInTheDocument();
		} );

		it( 'should render the log button in the header', () => {
			const logSpy = vi.spyOn( Logger, 'log' ).mockImplementation( () => {} );

			fireEvent.click( screen.getByRole( 'button', { name: 'Log in console' } ) );
			expect( logSpy ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'should render the show in schema button in the header', () => {
			fireEvent.click( screen.getByRole( 'button', { name: 'Show in schema' } ) );

			expect( store.getState().ui.activeTab ).toBe( 'Schema' );
			expect( store.getState().schema.currentSchemaDefinitionName ).toBe( 'paragraph' );
		} );

		it( 'should render for a <RootElement>', () => {
			const localStore = createStore( state => state, {
				model: {
					currentNodeDefinition: getEditorModelNodeDefinition( editor, root )
				}
			} );

			renderResult.unmount();
			renderResult = renderWithStore( localStore );
			expectHeader( 'RootElement:main' );
			expectPropertyValue( 'childCount', '1' );
			expectPropertyValue( 'startOffset', 'null' );
			expectPropertyValue( 'endOffset', 'null' );
			expectPropertyValue( 'maxOffset', '1' );
			expectPropertyValue( 'path', '[]' );
		} );

		it( 'should render for an <Element>', () => {
			expectHeader( 'Element:paragraph' );
			expectPropertyValue( 'childCount', '1' );
			expectPropertyValue( 'startOffset', '0' );
			expectPropertyValue( 'endOffset', '1' );
			expectPropertyValue( 'maxOffset', '3' );
			expectPropertyValue( 'path', '[0]' );
		} );

		it( 'should render for a <Text>', () => {
			editor.setData( '<p><b>f</b>oo</p>' );

			const localStore = createStore( state => state, {
				model: {
					currentNodeDefinition: getEditorModelNodeDefinition( editor, root.getChild( 0 ).getChild( 0 ) )
				}
			} );

			renderResult.unmount();
			renderResult = renderWithStore( localStore );
			expectHeader( 'Text:f' );
			expectPropertyValue( 'bold', 'true' );
			expectPropertyValue( 'isFormatting', 'true' );
			expectPropertyValue( 'copyOnEnter', 'true' );
			expectPropertyValue( 'startOffset', '0' );
			expectPropertyValue( 'endOffset', '1' );
			expectPropertyValue( 'offsetSize', '1' );
			expectPropertyValue( 'path', '[0,0]' );
		} );
	} );
} );
