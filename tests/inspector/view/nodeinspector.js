/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { getEditorViewNodeDefinition } from '../../../src/view/data/utils';

import Button from '../../../src/components/button';
import ObjectInspector from '../../../src/components/objectinspector';
import Logger from '../../../src/logger';
import ViewNodeInspector from '../../../src/view/nodeinspector';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( '<ViewNodeInspector />', () => {
	let editor, wrapper, element, root, store;

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ],
			initialData: '<p>foo</p>'
		} ).then( newEditor => {
			editor = newEditor;

			root = editor.editing.view.document.getRoot();

			store = createStore( state => state, {
				view: {
					currentNode: root.getChild( 0 ),
					currentNodeDefinition: getEditorViewNodeDefinition( root.getChild( 0 ) )
				}
			} );

			wrapper = mount( <Provider store={store}><ViewNodeInspector /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();
		sinon.restore();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a placeholder when no props#currentNodeDefinition', () => {
			const store = createStore( state => state, {
				view: {
					currentNode: null,
					currentNodeDefinition: null
				}
			} );

			const wrapper = mount( <Provider store={store}><ViewNodeInspector /></Provider> );

			expect( wrapper.text() ).to.match( /^Select a node / );

			wrapper.unmount();
		} );

		it( 'should render an object inspector when there is props#currentNodeDefinition', () => {
			expect( wrapper.find( ObjectInspector ) ).to.have.length( 1 );
		} );

		it( 'should render the log button in the header', () => {
			const logNodeButton = wrapper.find( Button ).first();
			const logSpy = sinon.stub( Logger, 'log' ).callsFake( () => {} );

			logNodeButton.simulate( 'click' );
			sinon.assert.calledOnce( logSpy );
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

			const wrapper = mount( <Provider store={store}><ViewNodeInspector /></Provider> );

			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'RootEditableElement:main' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {
				'aria-label': { value: '"Editor editing area: main"' },
				class: { value: '"ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline"' },
				contenteditable: { value: '"true"' },
				dir: { value: '"ltr"' },
				lang: { value: '"en"' },
				role: { value: '"textbox"' }
			} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				index: { value: 'null' },
				isEmpty: { value: 'false' },
				childCount: { value: '1' }
			} );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );

			const items = lists[ 2 ].itemDefinitions;

			expect( items ).to.deep.equal( {
				'Symbol(rootName)': { value: '"main"' },
				foo: { value: '"bar"' }
			} );

			wrapper.unmount();
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

			const wrapper = mount( <Provider store={store}><ViewNodeInspector /></Provider> );

			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'ContainerElement:p' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				index: { value: '0' },
				isEmpty: { value: 'false' },
				childCount: { value: '1' }
			} );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );
			expect( lists[ 2 ].itemDefinitions ).to.deep.equal( {
				foo: { value: '"bar"' }
			} );

			wrapper.unmount();
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

			const wrapper = mount( <Provider store={store}><ViewNodeInspector /></Provider> );

			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'AttributeElement:strong' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				index: { value: '0' },
				isEmpty: { value: 'false' },
				childCount: { value: '1' }
			} );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );
			expect( lists[ 2 ].itemDefinitions ).to.deep.equal( {
				foo: { value: '"bar"' }
			} );

			wrapper.unmount();
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

			const wrapper = mount( <Provider store={store}><ViewNodeInspector /></Provider> );

			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'EmptyElement:foo' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				index: { value: '0' },
				isEmpty: { value: 'true' },
				childCount: { value: '0' }
			} );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );
			expect( lists[ 2 ].itemDefinitions ).to.deep.equal( {
				foo: { value: '"bar"' }
			} );

			wrapper.unmount();
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

			const wrapper = mount( <Provider store={store}><ViewNodeInspector /></Provider> );

			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'UIElement:foo' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				index: { value: '0' },
				isEmpty: { value: 'true' },
				childCount: { value: '0' }
			} );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );
			expect( lists[ 2 ].itemDefinitions ).to.deep.equal( {
				foo: { value: '"bar"' }
			} );

			wrapper.unmount();
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

			const wrapper = mount( <Provider store={store}><ViewNodeInspector /></Provider> );

			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'RawElement:foo' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {
				class: { value: '"bar"' }
			} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				index: { value: '0' },
				isEmpty: { value: 'true' },
				childCount: { value: '0' }
			} );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );
			expect( lists[ 2 ].itemDefinitions ).to.deep.equal( {
				foo: { value: '"bar"' }
			} );

			wrapper.unmount();
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

			const wrapper = mount( <Provider store={store}><ViewNodeInspector /></Provider> );

			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'EditableElement:p' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				index: { value: '0' },
				isEmpty: { value: 'true' },
				childCount: { value: '0' }
			} );

			const items = lists[ 2 ].itemDefinitions;

			expect( items ).to.deep.equal( {
				foo: { value: '"bar"' }
			} );

			wrapper.unmount();
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

			const wrapper = mount( <Provider store={store}><ViewNodeInspector /></Provider> );

			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'Text:foo' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {} );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
				index: { value: '0' }
			} );

			wrapper.unmount();
		} );
	} );
} );
