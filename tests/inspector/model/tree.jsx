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

import {
	SET_MODEL_CURRENT_ROOT_NAME,
	SET_MODEL_CURRENT_NODE,
	SET_MODEL_ACTIVE_TAB,
	TOGGLE_MODEL_SHOW_COMPACT_TEXT,
	TOGGLE_MODEL_SHOW_MARKERS
} from '../../../src/model/data/actions';
import {
	getEditorModelRanges,
	getEditorModelMarkers,
	getEditorModelTreeDefinition
} from '../../../src/model/data/utils';

import ModelTree from '../../../src/model/tree';

describe( '<ModelTree />', () => {
	let editor, renderResult, element, store, dispatchSpy;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( async () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ],
			initialData: '<p>foobar</p>'
		} );

		editor.model.change( writer => {
			const paragraph = editor.model.document.getRoot().getChild( 0 );

			writer.setSelection(
				writer.createRange( writer.createPositionAt( paragraph, 1 ), writer.createPositionAt( paragraph, 3 ) )
			);
		} );

		const ranges = getEditorModelRanges( editor, 'main' );
		const markers = getEditorModelMarkers( editor, 'main' );
		const definition = getEditorModelTreeDefinition( {
			currentEditor: editor,
			currentRootName: 'main',
			ranges,
			markers
		} );

		store = createStore( state => state, {
			editors: new Map( [ [ 'test-editor', editor ] ] ),
			currentEditorName: 'test-editor',
			model: {
				roots: [ ...editor.model.document.roots ],
				ranges,
				markers,
				treeDefinition: definition,
				currentRootName: 'main',
				currentNode: editor.model.document.getRoot(),
				ui: {
					showMarkers: false,
					showCompactText: false
				}
			}
		} );

		dispatchSpy = vi.spyOn( store, 'dispatch' );

		renderResult = render( <Provider store={store}><ModelTree /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should dispatch setModelCurrentNode when a tree node is clicked', () => {
			const node = document.querySelector( '.ck-inspector-tree-node' );
			fireEvent.click( node );

			expect( dispatchSpy ).toHaveBeenCalledWith( expect.objectContaining( {
				type: SET_MODEL_CURRENT_NODE
			} ) );
		} );

		it( 'should dispatch setModelActiveTab when a tree node is double-clicked', () => {
			const node = document.querySelector( '.ck-inspector-tree-node' );
			fireEvent.click( node, { detail: 2 } );

			expect( dispatchSpy ).toHaveBeenCalledWith( expect.objectContaining( {
				type: SET_MODEL_ACTIVE_TAB,
				tabName: 'Inspect'
			} ) );
		} );

		it( 'should render a model root <Select> that changes current root name', () => {
			const select = screen.getByLabelText( 'Root:' );
			const options = Array.from( select.options ).map( option => option.value );

			expect( select ).toHaveValue( 'main' );
			expect( options ).toEqual( expect.arrayContaining( [ 'main', '$graveyard' ] ) );

			fireEvent.change( select, { target: { value: '$graveyard' } } );
			expect( dispatchSpy ).toHaveBeenCalledWith( {
				currentRootName: '$graveyard',
				type: SET_MODEL_CURRENT_ROOT_NAME
			} );
		} );

		it( 'should render a compact text <Checkbox>', () => {
			const checkbox = screen.getByLabelText( 'Compact text' );
			expect( checkbox ).not.toBeChecked();

			fireEvent.click( checkbox );
			expect( dispatchSpy ).toHaveBeenCalledWith( {
				type: TOGGLE_MODEL_SHOW_COMPACT_TEXT
			} );
		} );

		it( 'should render a show markers <Checkbox>', () => {
			const checkbox = screen.getByLabelText( 'Show markers' );
			expect( checkbox ).not.toBeChecked();

			fireEvent.click( checkbox );
			expect( dispatchSpy ).toHaveBeenCalledWith( {
				type: TOGGLE_MODEL_SHOW_MARKERS
			} );
		} );

		it( 'should use a <Tree> component', () => {
			const tree = document.querySelector( '.ck-inspector-tree' );
			expect( tree ).toHaveClass( 'ck-inspector-model-tree__hide-markers' );
			expect( tree ).toHaveClass( 'ck-inspector-tree_text-direction_ltr' );
			expect( tree ).not.toHaveClass( 'ck-inspector-tree_compact-text' );
			expect( document.querySelector( '.ck-inspector-tree-node_active' ) ).toBeTruthy();
		} );

		it( 'should not add hide-markers class when showMarkers is true', () => {
			const showMarkersStore = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				model: {
					roots: [ ...editor.model.document.roots ],
					ranges: [],
					markers: [],
					treeDefinition: [],
					currentRootName: 'main',
					currentNode: null,
					ui: {
						showMarkers: true,
						showCompactText: false
					}
				}
			} );

			const { container, unmount } = render( <Provider store={showMarkersStore}><ModelTree /></Provider> );
			const tree = container.querySelector( '.ck-inspector-tree' );

			expect( tree ).not.toHaveClass( 'ck-inspector-model-tree__hide-markers' );
			unmount();
		} );
	} );
} );
