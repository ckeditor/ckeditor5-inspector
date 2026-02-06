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

import { getEditorModelMarkers } from '../../../src/model/data/utils';

import Logger from '../../../src/logger';
import ModelMarkerInspector from '../../../src/model/markerinspector';

describe( '<ModelMarkerInspector />', () => {
	let editor, renderResult, element, store;

	beforeEach( async () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ],
			initialData: '<p>foo</p>'
		} );

		editor.model.change( writer => {
			const root = editor.model.document.getRoot();
			const range = editor.model.createRange(
				editor.model.createPositionFromPath( root, [ 0, 1 ] ),
				editor.model.createPositionFromPath( root, [ 0, 3 ] )
			);

			writer.addMarker( 'foo:marker', { range, usingOperation: false, affectsData: true } );
		} );

		store = createStore( state => state, {
			editors: new Map( [ [ 'foo', editor ] ] ),
			currentEditorName: 'foo',
			model: {
				markers: getEditorModelMarkers( editor, 'main' )
			}
		} );

		renderResult = render( <Provider store={store}><ModelMarkerInspector /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render the inspector', () => {
			const logSpy = vi.spyOn( Logger, 'log' ).mockImplementation( () => {} );

			expect( screen.getByRole( 'heading', { level: 2 } ) ).toHaveTextContent( 'Markers' );
			fireEvent.click( screen.getByRole( 'button', { name: 'Log in console' } ) );
			expect( logSpy ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'should render markers tree', () => {
			expect( screen.getByRole( 'heading', { level: 3, name: 'Markers tree' } ) ).toBeInTheDocument();
			expect( screen.getByLabelText( 'foo' ) ).toHaveValue( '1 marker' );
			expect( screen.getByLabelText( 'name' ) ).toHaveValue( '"foo:marker"' );
			expect( screen.getByLabelText( 'start' ) ).toHaveValue( '[0,1]' );
			expect( screen.getByLabelText( 'end' ) ).toHaveValue( '[0,3]' );
			expect( screen.getByLabelText( 'affectsData' ) ).toHaveValue( 'true' );
			expect( screen.getByLabelText( 'managedUsingOperations' ) ).toHaveValue( 'false' );

			const colorBox = document.querySelector( '.ck-inspector-property-list__title__color-box' );
			expect( colorBox ).toBeTruthy();
			expect( colorBox.getAttribute( 'style' ) ).toMatch( /rgb\(3,\s*169,\s*244\)/ );
		} );
	} );
} );
