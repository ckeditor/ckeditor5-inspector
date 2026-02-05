/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { Paragraph, BoldEditing } from 'ckeditor5';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, within } from '@testing-library/react';
import TestEditor from '../../utils/testeditor';
import { getEditorViewRanges } from '../../../src/view/data/utils';
import Logger from '../../../src/logger';
import ViewSelectionInspector from '../../../src/view/selectioninspector';

describe( '<ViewSelectionInspector />', () => {
	let editor, renderResult, element, store;

	beforeEach( async () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ],
			initialData: '<p>foo</p>'
		} );

		store = createStore( state => state, {
			editors: new Map( [ [ 'test-editor', editor ] ] ),
			currentEditorName: 'test-editor',
			view: {
				ranges: getEditorViewRanges( editor, 'main' )
			}
		} );

		renderResult = render( <Provider store={store}><ViewSelectionInspector /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		vi.restoreAllMocks();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		describe( 'inspector child components', () => {
			it( 'should contain the log selection button', () => {
				const logSpy = vi.spyOn( Logger, 'log' ).mockImplementation( () => {} );
				const logButtons = screen.getAllByRole( 'button', { name: 'Log in console' } );

				fireEvent.click( logButtons[ 0 ] );
				expect( logSpy ).toHaveBeenCalledTimes( 1 );
			} );

			describe( 'scroll to selection button', () => {
				it( 'should be created and scroll to the selection', () => {
					const scrollSpy = vi.fn();
					vi.spyOn( document, 'querySelector' ).mockImplementation( selector => {
						if ( selector === '.ck-inspector-tree__position.ck-inspector-tree__position_selection' ) {
							return { scrollIntoView: scrollSpy };
						}
						return null;
					} );

					fireEvent.click( screen.getByRole( 'button', { name: 'Scroll to selection' } ) );

					expect( scrollSpy ).toHaveBeenCalledWith( {
						behavior: 'smooth',
						block: 'center'
					} );
				} );

				it( 'should not throw when the selection is in a different root', () => {
					vi.spyOn( document, 'querySelector' ).mockReturnValue( null );

					expect( () => {
						fireEvent.click( screen.getByRole( 'button', { name: 'Scroll to selection' } ) );
					} ).not.toThrow();
				} );
			} );

			it( 'should contain the log selection anchor and focus buttons', () => {
				const logSpy = vi.spyOn( Logger, 'log' ).mockImplementation( () => {} );
				const logButtons = screen.getAllByRole( 'button', { name: 'Log in console' } );

				logButtons.forEach( button => fireEvent.click( button ) );
				expect( logSpy ).toHaveBeenCalledTimes( 4 );
			} );

			it( 'should contain the object inspector', () => {
				expect( screen.getByRole( 'heading', { level: 2 } ) ).toHaveTextContent( 'Selection' );
			} );
		} );

		describe( 'selection properties', () => {
			it( '"Properties" should be rendered', () => {
				const propertiesHeader = screen.getByRole( 'heading', { level: 3, name: 'Properties' } );
				const propertiesList = propertiesHeader.nextElementSibling;
				const scoped = within( propertiesList );

				expect( scoped.getByLabelText( 'isCollapsed' ) ).toHaveValue( 'true' );
				expect( scoped.getByLabelText( 'isBackward' ) ).toHaveValue( 'false' );
				expect( scoped.getByLabelText( 'isFake' ) ).toHaveValue( 'false' );
				expect( scoped.getByLabelText( 'rangeCount' ) ).toHaveValue( '1' );
			} );

			it( '"Anchor" should be rendered', () => {
				const anchorHeader = screen.getByRole( 'heading', { level: 3, name: /Anchor/ } );
				const anchorList = anchorHeader.nextElementSibling;
				const scoped = within( anchorList );

				expect( scoped.getByLabelText( 'offset' ) ).toHaveValue( '0' );
				expect( scoped.getByLabelText( 'isAtEnd' ) ).toHaveValue( 'false' );
				expect( scoped.getByLabelText( 'isAtStart' ) ).toHaveValue( 'true' );
				expect( scoped.getByLabelText( 'parent' ) ).toHaveValue( '"foo"' );
			} );

			it( '"Focus" should be rendered', () => {
				const focusHeader = screen.getByRole( 'heading', { level: 3, name: /Focus/ } );
				const focusList = focusHeader.nextElementSibling;
				const scoped = within( focusList );

				expect( scoped.getByLabelText( 'offset' ) ).toHaveValue( '0' );
				expect( scoped.getByLabelText( 'isAtEnd' ) ).toHaveValue( 'false' );
				expect( scoped.getByLabelText( 'isAtStart' ) ).toHaveValue( 'true' );
				expect( scoped.getByLabelText( 'parent' ) ).toHaveValue( '"foo"' );
			} );

			it( '"Ranges" should be rendered', () => {
				const rangesHeader = screen.getByRole( 'heading', { level: 3, name: /Ranges/ } );
				const rangesList = rangesHeader.nextElementSibling;
				const scoped = within( rangesList );

				expect( scoped.getAllByLabelText( 'offset' ).map( node => node.value ) ).toEqual( [ '0', '0' ] );
				expect( scoped.getAllByLabelText( 'parent' ).map( node => node.value ) ).toEqual( [ '"foo"', '"foo"' ] );
			} );
		} );
	} );
} );
