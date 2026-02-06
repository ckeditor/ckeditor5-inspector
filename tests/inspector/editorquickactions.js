/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import copy from 'copy-to-clipboard';

import TestEditor from '../utils/testeditor';
import EditorQuickActions from '../../src/editorquickactions';

vi.mock( 'copy-to-clipboard', () => ( {
	__esModule: true,
	default: vi.fn( () => true )
} ) );

const copyMock = copy.default ?? copy;

vi.mock( '../../src/assets/img/source.svg', () => ( {
	default: () => <svg data-testid="icon-source" />
} ) );

vi.mock( '../../src/assets/img/copy-to-clipboard.svg', () => ( {
	default: () => <svg data-testid="icon-copy-to-clipboard" />
} ) );

vi.mock( '../../src/assets/img/checkmark.svg', () => ( {
	default: () => <svg data-testid="icon-checkmark" />
} ) );

vi.mock( '../../src/assets/img/load-data.svg', () => ( {
	default: () => <svg data-testid="icon-load-data" />
} ) );

vi.mock( '../../src/assets/img/console.svg', () => ( {
	default: () => <svg data-testid="icon-console" />
} ) );

vi.mock( '../../src/assets/img/read-only.svg', () => ( {
	default: () => <svg data-testid="icon-read-only" />
} ) );

vi.mock( '../../src/assets/img/trash.svg', () => ( {
	default: () => <svg data-testid="icon-trash" />
} ) );

describe( '<EditorQuickActions />', () => {
	let editor, store, renderResult, element;

	beforeEach( async () => {
		vi.clearAllMocks();
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element );

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

		renderResult = render( <Provider store={store}><EditorQuickActions /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		await editor.destroy();
		vi.useRealTimers();
	} );

	describe( 'render()', () => {
		it( 'should render an element with a CSS class', () => {
			expect( document.querySelector( '.ck-inspector-editor-quick-actions' ) ).toBeTruthy();
		} );

		describe( 'log editor button', () => {
			it( 'should be rendered and log the editor in the console', () => {
				const logSpy = vi.spyOn( console, 'log' ).mockImplementation( () => {} );

				fireEvent.click( screen.getByRole( 'button', { name: 'Log editor' } ) );

				expect( logSpy ).toHaveBeenCalledTimes( 1 );
				expect( logSpy ).toHaveBeenCalledWith( editor );
				logSpy.mockRestore();
			} );
		} );

		describe( 'log editor data button', () => {
			it( 'should be rendered and log the editor data in the console', () => {
				const logSpy = vi.spyOn( console, 'log' ).mockImplementation( () => {} );

				fireEvent.click( screen.getByRole( 'button', { name: 'Log editor data (press with Shift to copy)' } ) );

				expect( logSpy ).toHaveBeenCalledTimes( 1 );
				expect( logSpy ).toHaveBeenCalledWith( editor.getData() );
				logSpy.mockRestore();
			} );

			it( 'should react to the Shift being pressed and turn into "copy to clipboard" button', () => {
				const logButton = screen.getByRole( 'button', { name: 'Log editor data (press with Shift to copy)' } );
				expect( within( logButton ).getByTestId( 'icon-source' ) ).toBeInTheDocument();

				fireEvent.keyDown( document, { key: 'Shift' } );
				expect( within( logButton ).getByTestId( 'icon-copy-to-clipboard' ) ).toBeInTheDocument();
			} );

			it( 'should copy the content of the editor to the clipboard if clicked with Shift key', async () => {
				vi.useFakeTimers();
				const logButton = screen.getByRole( 'button', { name: 'Log editor data (press with Shift to copy)' } );

				fireEvent.keyDown( document, { key: 'Shift' } );
				fireEvent.click( logButton, { shiftKey: true } );

				expect( copyMock ).toHaveBeenCalledWith( editor.getData() );
				expect( screen.getByRole( 'button', { name: 'Data copied to clipboard.' } ) )
					.toBeInTheDocument();
				expect( within( screen.getByRole( 'button', { name: 'Data copied to clipboard.' } ) )
					.getByTestId( 'icon-checkmark' ) ).toBeInTheDocument();

				await act( async () => {
					vi.advanceTimersByTime( 2500 );
				} );

				expect( screen.getByRole( 'button', { name: 'Data copied to clipboard.' } ) )
					.toBeInTheDocument();

				await act( async () => {
					vi.advanceTimersByTime( 1000 );
				} );

				expect( screen.getByRole( 'button', { name: 'Log editor data (press with Shift to copy)' } ) )
					.toBeInTheDocument();

				expect( within( screen.getByRole( 'button', { name: 'Log editor data (press with Shift to copy)' } ) )
					.getByTestId( 'icon-copy-to-clipboard' ) ).toBeInTheDocument();

				fireEvent.keyUp( document );
				expect( within( screen.getByRole( 'button', { name: 'Log editor data (press with Shift to copy)' } ) )
					.getByTestId( 'icon-source' ) ).toBeInTheDocument();
			} );

			it( 'should not throw if the inspector was destroyed immediatelly after the editor data was copied', async () => {
				vi.useFakeTimers();
				const errorSpy = vi.spyOn( console, 'error' ).mockImplementation( () => {} );
				const logButton = screen.getByRole( 'button', { name: 'Log editor data (press with Shift to copy)' } );

				fireEvent.keyDown( document, { key: 'Shift' } );
				fireEvent.click( logButton, { shiftKey: true } );
				renderResult.unmount();

				await act( async () => {
					vi.advanceTimersByTime( 5000 );
				} );

				expect( errorSpy ).not.toHaveBeenCalled();
				errorSpy.mockRestore();
			} );

			it( 'should not throw if Shift key was pressed or released after the inspector was destroyed', async () => {
				vi.useFakeTimers();
				const errorSpy = vi.spyOn( console, 'error' ).mockImplementation( () => {} );

				fireEvent.keyDown( document, { key: 'Shift' } );
				renderResult.unmount();

				await act( async () => {
					vi.advanceTimersByTime( 5000 );
				} );

				fireEvent.keyUp( document );
				fireEvent.keyDown( document, { key: 'Shift' } );

				expect( errorSpy ).not.toHaveBeenCalled();
				errorSpy.mockRestore();
			} );
		} );

		describe( 'set editor data button', () => {
			let inspectorWrapper;

			beforeEach( () => {
				inspectorWrapper = document.createElement( 'div' );
				inspectorWrapper.classList.add( 'ck-inspector-wrapper' );
				document.body.appendChild( inspectorWrapper );
			} );

			afterEach( () => {
				inspectorWrapper.remove();
			} );

			it( 'should be rendered', () => {
				const setDataButton = screen.getByRole( 'button', { name: 'Set editor data' } );
				expect( setDataButton ).toBeInTheDocument();
				expect( within( setDataButton ).getByTestId( 'icon-load-data' ) ).toBeInTheDocument();
			} );

			it( 'should open a modal when clicked', () => {
				fireEvent.click( screen.getByRole( 'button', { name: 'Set editor data' } ) );
				expect( screen.getByRole( 'heading', { name: 'Set editor data' } ) ).toBeInTheDocument();
			} );
		} );

		describe( 'toggle read only button', () => {
			it( 'should be rendered and toggle the editor read only state', () => {
				const toggleReadOnlyButton = screen.getByRole( 'button', { name: 'Toggle read only' } );

				fireEvent.click( toggleReadOnlyButton );
				expect( editor.isReadOnly ).toBe( true );

				fireEvent.click( toggleReadOnlyButton );
				expect( editor.isReadOnly ).toBe( false );
			} );
		} );

		describe( 'destroy editor button', () => {
			it( 'should be rendered and destory the editor', () => {
				const destroyButton = screen.getByRole( 'button', { name: 'Destroy editor' } );
				const spy = vi.spyOn( editor, 'destroy' ).mockImplementation( () => Promise.resolve() );

				fireEvent.click( destroyButton );
				expect( spy ).toHaveBeenCalledTimes( 1 );
				spy.mockRestore();
			} );
		} );

		it( 'should enable all buttons when there is a current editor', () => {
			const buttons = [
				screen.getByRole( 'button', { name: 'Log editor' } ),
				screen.getByRole( 'button', { name: 'Log editor data (press with Shift to copy)' } ),
				screen.getByRole( 'button', { name: 'Set editor data' } ),
				screen.getByRole( 'button', { name: 'Toggle read only' } ),
				screen.getByRole( 'button', { name: 'Destroy editor' } )
			];

			buttons.forEach( button => {
				expect( button ).not.toHaveClass( 'ck-inspector-button_disabled' );
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

			const buttons = [
				screen.getByRole( 'button', { name: 'Log editor' } ),
				screen.getByRole( 'button', { name: 'Log editor data (press with Shift to copy)' } ),
				screen.getByRole( 'button', { name: 'Set editor data' } ),
				screen.getByRole( 'button', { name: 'Toggle read only' } ),
				screen.getByRole( 'button', { name: 'Destroy editor' } )
			];

			buttons.forEach( button => {
				expect( button ).toHaveClass( 'ck-inspector-button_disabled' );
			} );
		} );
	} );
} );
