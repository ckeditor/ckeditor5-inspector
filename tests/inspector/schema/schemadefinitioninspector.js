/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { Paragraph } from 'ckeditor5';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, within } from '@testing-library/react';

import { getSchemaDefinition } from '../../../src/schema/data/utils';

import { reducer } from '../../../src/data/reducer';
import SchemaDefinitionInspector from '../../../src/schema/schemadefinitioninspector';

describe( '<SchemaDefinitionInspector />', () => {
	let editor, renderResult, element, store;

	const renderWithStore = localStore => render( <Provider store={localStore}><SchemaDefinitionInspector /></Provider> );

	beforeEach( async () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element, {
			plugins: [
				Paragraph,
				function( editor ) {
					this.afterInit = () => {
						editor.model.schema.extend( 'paragraph', {
							allowAttributes: [ 'foo' ]
						} );
						editor.model.schema.setAttributeProperties( 'foo', {
							someProperty: 123
						} );
					};
				}
			]
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
				currentSchemaDefinition: getSchemaDefinition( { editors, currentEditorName }, 'paragraph' ),
				treeDefinition: null
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
		it( 'should render a placeholder when no props#currentSchemaDefinition', () => {
			const localStore = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				schema: {
					currentSchemaDefinition: null
				}
			} );

			const { unmount } = renderWithStore( localStore );
			expect( screen.getByText( /^Select a schema definition/ ) ).toBeInTheDocument();
			unmount();
		} );

		it( 'should render an object inspector when there is props#currentSchemaDefinition', () => {
			expect( screen.getByRole( 'heading', { level: 2 } ) ).toBeInTheDocument();
		} );

		describe( 'scheme definition info', () => {
			it( 'should render schema definition properties', () => {
				const link = screen.getByRole( 'link', { name: 'Properties' } );
				expect( link ).toHaveAttribute( 'href', expect.stringMatching( /^https:\/\/ckeditor.com\/docs\// ) );

				const header = screen.getByRole( 'heading', { level: 3, name: 'Properties' } );
				const list = header.nextElementSibling;
				expect( within( list ).getByLabelText( 'isBlock' ) ).toHaveValue( 'true' );
			} );

			it( 'should render schema definition allowed attributes', () => {
				const link = screen.getByRole( 'link', { name: 'Allowed attributes' } );
				expect( link ).toHaveAttribute( 'href', expect.stringMatching( /^https:\/\/ckeditor.com\/docs\// ) );

				expect( screen.getByLabelText( 'foo' ) ).toHaveValue( 'true' );
				expect( screen.getByLabelText( 'someProperty' ) ).toHaveValue( '123' );
			} );

			it( 'should render schema definition allowed children', () => {
				const link = screen.getByRole( 'link', { name: 'Allowed children' } );
				expect( link ).toHaveAttribute( 'href', expect.stringMatching( /^https:\/\/ckeditor.com\/docs\// ) );

				const label = screen.getByText( '$text', { selector: 'label' } );
				expect( label ).toHaveAttribute( 'title', 'Click to see the definition of $text' );
				expect( screen.getByLabelText( '$text' ) ).toHaveValue( 'true' );
			} );

			it( 'should render schema definition allowed in', () => {
				const link = screen.getByRole( 'link', { name: 'Allowed in' } );
				expect( link ).toHaveAttribute( 'href', expect.stringMatching( /^https:\/\/ckeditor.com\/docs\// ) );

				const rootLabel = screen.getByText( '$root', { selector: 'label' } );
				expect( rootLabel ).toHaveAttribute( 'title', 'Click to see the definition of $root' );
				expect( screen.getByLabelText( '$root' ) ).toHaveValue( 'true' );
			} );
		} );

		it( 'should navigate to another definition upon clicking a name in "allowed children"', () => {
			const label = screen.getByText( '$text', { selector: 'label' } );
			fireEvent.click( label );

			expect( store.getState().schema.currentSchemaDefinitionName ).toBe( '$text' );
		} );

		it( 'should navigate to another definition upon clicking a name in "allowed in"', () => {
			const label = screen.getByText( '$root', { selector: 'label' } );
			fireEvent.click( label );

			expect( store.getState().schema.currentSchemaDefinitionName ).toBe( '$root' );
		} );
	} );
} );
