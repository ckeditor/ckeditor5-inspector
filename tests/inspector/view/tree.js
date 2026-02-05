/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { Paragraph, BoldEditing } from 'ckeditor5';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import { SET_VIEW_CURRENT_ROOT_NAME, TOGGLE_VIEW_SHOW_ELEMENT_TYPES } from '../../../src/view/data/actions';
import ViewTree from '../../../src/view/tree';

describe( '<ViewTree />', () => {
	let editor, renderResult, element, store, dispatchSpy;

	beforeEach( async () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ]
		} );

		store = createStore( ( state, action ) => ( { ...state, ...action.state } ), {
			editors: new Map( [ [ 'test-editor', editor ] ] ),
			currentEditorName: 'test-editor',
			ui: {
				activeTab: 'View'
			},
			view: {
				roots: [ ...editor.editing.view.document.roots ],
				ranges: [],
				treeDefinition: null,
				currentRootName: 'main',
				currentNode: editor.editing.view.document.getRoot(),
				ui: {
					activeTab: 'Selection',
					showElementTypes: false
				}
			}
		} );

		dispatchSpy = vi.spyOn( store, 'dispatch' );

		renderResult = render( <Provider store={store}><ViewTree /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a view root <Select> that changes the current root name', () => {
			const select = screen.getByLabelText( 'Root:' );

			expect( select ).toHaveValue( 'main' );
			expect( select.querySelectorAll( 'option' ) ).toHaveLength( 1 );

			fireEvent.change( select, { target: { value: 'main' } } );
			expect( dispatchSpy ).toHaveBeenCalledWith( {
				currentRootName: 'main',
				type: SET_VIEW_CURRENT_ROOT_NAME
			} );
		} );

		it( 'should render a show element types <Checkbox>', () => {
			const checkbox = screen.getByLabelText( 'Show element types' );
			expect( checkbox ).not.toBeChecked();

			fireEvent.click( checkbox );
			expect( dispatchSpy ).toHaveBeenCalledWith( {
				type: TOGGLE_VIEW_SHOW_ELEMENT_TYPES
			} );
		} );

		it( 'should use a <Tree> component', () => {
			const tree = document.querySelector( '.ck-inspector-tree' );
			expect( tree ).toHaveClass( 'ck-inspector-tree_compact-text' );
			expect( tree ).toHaveClass( 'ck-inspector-tree_text-direction_ltr' );
		} );
	} );
} );
