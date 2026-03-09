/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { Paragraph, BoldEditing } from 'ckeditor5';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import TestEditor from '../../utils/testeditor';
import { getEditorViewNodeDefinition } from '../../../src/view/data/utils';
import Logger from '../../../src/logger';
import ViewNodeInspector from '../../../src/view/nodeinspector';

describe( '<ViewNodeInspector />', () => {
	let editor, element, root;

	const renderWithStore = store => render( <Provider store={store}><ViewNodeInspector /></Provider> );

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

		root = editor.editing.view.document.getRoot();
	} );

	afterEach( async () => {
		element.remove();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a placeholder when no props#currentNodeDefinition', () => {
			const store = createStore( state => state, {
				view: {
					currentNode: null,
					currentNodeDefinition: null
				}
			} );

			renderWithStore( store );
			expect( screen.getByText( /^Select a node / ) ).toBeInTheDocument();
		} );

		it( 'should render an object inspector when there is props#currentNodeDefinition', () => {
			const store = createStore( state => state, {
				view: {
					currentNode: root.getChild( 0 ),
					currentNodeDefinition: getEditorViewNodeDefinition( root.getChild( 0 ) )
				}
			} );

			renderWithStore( store );
			expect( screen.getByRole( 'heading', { level: 2 } ) ).toBeInTheDocument();
		} );

		it( 'should render the log button in the header', () => {
			const store = createStore( state => state, {
				view: {
					currentNode: root.getChild( 0 ),
					currentNodeDefinition: getEditorViewNodeDefinition( root.getChild( 0 ) )
				}
			} );
			const logSpy = vi.spyOn( Logger, 'log' ).mockImplementation( () => {} );

			renderWithStore( store );
			fireEvent.click( screen.getByRole( 'button', { name: 'Log in console' } ) );
			expect( logSpy ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'should render for a <RootElement>', () => {
			editor.editing.view.change( writer => {
				writer.setCustomProperty( 'foo', 'bar', editor.editing.view.document.getRoot() );
			} );

			const store = createStore( state => state, {
				view: {
					currentNode: root,
					currentNodeDefinition: getEditorViewNodeDefinition( root )
				}
			} );

			renderWithStore( store );
			expectHeader( 'RootEditableElement:main' );

			expectPropertyValue( 'aria-label', '"Rich Text Editor. Editing area: main"' );
			expectPropertyValue( 'class', '"ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline"' );
			expectPropertyValue( 'contenteditable', '"true"' );
			expectPropertyValue( 'dir', '"ltr"' );
			expectPropertyValue( 'lang', '"en"' );
			expectPropertyValue( 'role', '"textbox"' );

			expectPropertyValue( 'index', 'null' );
			expectPropertyValue( 'isEmpty', 'false' );
			expectPropertyValue( 'childCount', '1' );

			expectPropertyValue( 'Symbol(rootName)', '"main"' );
			expectPropertyValue( 'foo', '"bar"' );
		} );

		it( 'should render for a <ContainerElement>', () => {
			const container = editor.editing.view.document.getRoot().getChild( 0 );

			editor.editing.view.change( writer => {
				writer.setCustomProperty( 'foo', 'bar', container );
			} );

			const store = createStore( state => state, {
				view: {
					currentNode: container,
					currentNodeDefinition: getEditorViewNodeDefinition( container )
				}
			} );

			renderWithStore( store );
			expectHeader( 'ContainerElement:p' );

			expectPropertyValue( 'index', '0' );
			expectPropertyValue( 'isEmpty', 'false' );
			expectPropertyValue( 'childCount', '1' );
			expectPropertyValue( 'foo', '"bar"' );
		} );

		it( 'should render for an <AttributeElement>', () => {
			editor.setData( '<p><b>foo</b></p>' );

			const element = editor.editing.view.document.getRoot().getChild( 0 ).getChild( 0 );

			editor.editing.view.change( writer => {
				writer.setCustomProperty( 'foo', 'bar', element );
			} );

			const store = createStore( state => state, {
				view: {
					currentNode: element,
					currentNodeDefinition: getEditorViewNodeDefinition( element )
				}
			} );

			renderWithStore( store );
			expectHeader( 'AttributeElement:strong' );
			expectPropertyValue( 'index', '0' );
			expectPropertyValue( 'isEmpty', 'false' );
			expectPropertyValue( 'childCount', '1' );
			expectPropertyValue( 'foo', '"bar"' );
		} );

		it( 'should render for an <EmptyElement>', () => {
			editor.setData( '<p>foo</p>' );

			editor.editing.view.change( writer => {
				const foo = writer.createEmptyElement( 'foo' );
				writer.insert( editor.editing.view.document.selection.getFirstPosition(), foo );
				writer.setCustomProperty( 'foo', 'bar', foo );
			} );

			const element = editor.editing.view.document.getRoot().getChild( 0 ).getChild( 0 );
			const store = createStore( state => state, {
				view: {
					currentNode: element,
					currentNodeDefinition: getEditorViewNodeDefinition( element )
				}
			} );

			renderWithStore( store );
			expectHeader( 'EmptyElement:foo' );
			expectPropertyValue( 'index', '0' );
			expectPropertyValue( 'isEmpty', 'true' );
			expectPropertyValue( 'childCount', '0' );
			expectPropertyValue( 'foo', '"bar"' );
		} );

		it( 'should render for an <UIElement>', () => {
			editor.setData( '<p>foo</p>' );

			editor.editing.view.change( writer => {
				const foo = writer.createUIElement( 'foo' );
				writer.insert( editor.editing.view.document.selection.getFirstPosition(), foo );
				writer.setCustomProperty( 'foo', 'bar', foo );
			} );

			const element = editor.editing.view.document.getRoot().getChild( 0 ).getChild( 0 );
			const store = createStore( state => state, {
				view: {
					currentNode: element,
					currentNodeDefinition: getEditorViewNodeDefinition( element )
				}
			} );

			renderWithStore( store );
			expectHeader( 'UIElement:foo' );
			expectPropertyValue( 'index', '0' );
			expectPropertyValue( 'isEmpty', 'true' );
			expectPropertyValue( 'childCount', '0' );
			expectPropertyValue( 'foo', '"bar"' );
		} );

		it( 'should render for a <RawElement>', () => {
			editor.setData( '<p>foo</p>' );

			editor.editing.view.change( writer => {
				const foo = writer.createRawElement( 'foo', {
					class: 'bar'
				}, domElement => {
					domElement.innerHTML = '<b>baz</b>';
				} );

				writer.insert( editor.editing.view.document.selection.getFirstPosition(), foo );
				writer.setCustomProperty( 'foo', 'bar', foo );
			} );

			const element = editor.editing.view.document.getRoot().getChild( 0 ).getChild( 0 );
			const store = createStore( state => state, {
				view: {
					currentNode: element,
					currentNodeDefinition: getEditorViewNodeDefinition( element )
				}
			} );

			renderWithStore( store );
			expectHeader( 'RawElement:foo' );
			expectPropertyValue( 'class', '"bar"' );
			expectPropertyValue( 'index', '0' );
			expectPropertyValue( 'isEmpty', 'true' );
			expectPropertyValue( 'childCount', '0' );
			expectPropertyValue( 'foo', '"bar"' );
		} );

		it( 'should render for an <EditableElement>', () => {
			editor.setData( '' );

			editor.editing.view.change( writer => {
				const foo = writer.createEditableElement( 'p' );
				writer.insert( editor.editing.view.document.selection.getFirstPosition(), foo );
				writer.setCustomProperty( 'foo', 'bar', foo );
			} );

			const element = editor.editing.view.document.getRoot().getChild( 0 ).getChild( 0 );
			const store = createStore( state => state, {
				view: {
					currentNode: element,
					currentNodeDefinition: getEditorViewNodeDefinition( element )
				}
			} );

			renderWithStore( store );
			expectHeader( 'EditableElement:p' );
			expectPropertyValue( 'index', '0' );
			expectPropertyValue( 'isEmpty', 'true' );
			expectPropertyValue( 'childCount', '0' );
			expectPropertyValue( 'foo', '"bar"' );
		} );

		it( 'renders for a Text', () => {
			editor.setData( '<p>foo</p>' );

			const element = editor.editing.view.document.getRoot().getChild( 0 ).getChild( 0 );
			const store = createStore( state => state, {
				view: {
					currentNode: element,
					currentNodeDefinition: getEditorViewNodeDefinition( element )
				}
			} );

			renderWithStore( store );
			expectHeader( 'Text:foo' );
			expectPropertyValue( 'index', '0' );
		} );
	} );
} );
