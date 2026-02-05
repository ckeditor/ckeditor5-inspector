/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { Paragraph } from 'ckeditor5';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { getSchemaTreeDefinition } from '../../../src/schema/data/utils';
import { reducer } from '../../../src/data/reducer';
import SchemaTree from '../../../src/schema/tree';

describe( '<SchemaTree />', () => {
	let editor, renderResult, element, store;

	beforeEach( async () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element, {
			plugins: [ Paragraph ]
		} );

		const editors = new Map( [ [ 'test-editor', editor ] ] );
		const currentEditorName = 'test-editor';

		store = createStore( reducer, {
			editors,
			currentEditorName,
			ui: {
				activeTab: 'Schema'
			},
			schema: {
				currentSchemaDefinitionName: 'paragraph',
				treeDefinition: getSchemaTreeDefinition( { editors, currentEditorName } )
			}
		} );

		renderResult = render( <Provider store={store}><SchemaTree /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should use a <Tree> component', () => {
			const active = document.querySelector( '.ck-inspector-tree-node_active' );
			expect( active ).toBeTruthy();
			expect( active.querySelector( '.ck-inspector-tree-node__name' ) ).toHaveTextContent( 'paragraph' );
		} );

		it( 'should render a <Tree> with schema items in alphabetical order', () => {
			const names = Array.from(
				document.querySelectorAll( '.ck-inspector-tree-node__name:not(.ck-inspector-tree-node__name_close)' )
			).map( node => node.textContent );

			const rootIndex = names.indexOf( '$root' );
			const textIndex = names.indexOf( '$text' );
			const paragraphIndex = names.indexOf( 'paragraph' );

			expect( rootIndex ).toBeGreaterThan( -1 );
			expect( textIndex ).toBeGreaterThan( -1 );
			expect( paragraphIndex ).toBeGreaterThan( -1 );
			expect( rootIndex ).toBeLessThan( textIndex );
			expect( textIndex ).toBeLessThan( paragraphIndex );
		} );

		it( 'should start inspecting a schema definition when an item was clicked', () => {
			const element = document.querySelector( '.ck-inspector-tree-node' );
			fireEvent.click( element );
			expect( store.getState().schema.currentSchemaDefinitionName ).toBe( '$block' );
		} );
	} );
} );
