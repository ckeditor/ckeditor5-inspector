/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../../utils/testeditor';
import Button from '../../../../src/components/button';
import Pane from '../../../../src/components/pane';
import ObjectInspector from '../../../../src/components/objectinspector';
import Logger from '../../../../src/logger';
import ViewNodeInspector from '../../../../src/components/view/nodeinspector';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( '<ViewNodeInspector />', () => {
	let editor, wrapper, element, root;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ]
		} ).then( newEditor => {
			editor = newEditor;

			root = editor.editing.view.document.getRoot();

			wrapper = mount( <ViewNodeInspector editor={editor} currentRootName="main" /> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();
		sinon.restore();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'renders a placeholder when no props#inspectedNode', () => {
			wrapper.setProps( { inspectedNode: null } );

			expect( wrapper.childAt( 0 ).type() ).to.equal( Pane );
			expect( wrapper.childAt( 0 ).text() ).to.match( /^Select a node / );
		} );

		it( 'renders a placeholder when props#inspectedNode is detached', () => {
			editor.setData( '<p>foo</p>' );

			const node = root.getChild( 0 );
			node.parent = null;

			wrapper.setProps( {
				inspectedNode: node
			} );

			expect( wrapper.childAt( 0 ).type() ).to.equal( Pane );
			expect( wrapper.childAt( 0 ).text() ).to.match( /^Select a node / );
		} );

		it( 'renders a placeholder when props#inspectedNode is from another root', () => {
			editor.setData( '<p>foo</p>' );

			const node = root.getChild( 0 );
			node.root.rootName = 'foo';

			wrapper.setProps( {
				inspectedNode: node
			} );

			expect( wrapper.childAt( 0 ).type() ).to.equal( Pane );
			expect( wrapper.childAt( 0 ).text() ).to.match( /^Select a node / );
		} );

		it( 'renders an object inspector when there is props#inspectedNode', () => {
			editor.setData( '<p>foo</p>' );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 )
			} );

			expect( wrapper.childAt( 0 ).type() ).to.equal( ObjectInspector );
		} );

		it( 'renders the log button in the header', () => {
			editor.setData( '<p>foo</p>' );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 )
			} );

			const logNodeButton = wrapper.find( Button ).first();
			const logSpy = sinon.stub( Logger, 'log' ).callsFake( () => {} );

			logNodeButton.simulate( 'click' );
			sinon.assert.calledOnce( logSpy );
		} );

		it( 'renders for a RootElement', () => {
			editor.setData( '<p>foo</p>' );

			editor.editing.view.change( writer => {
				writer.setCustomProperty( 'foo', 'bar', editor.editing.view.document.getRoot() );
			} );

			wrapper.setProps( {
				inspectedNode: root
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'RootEditableElement:main' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items.sort( ( itemA, itemB ) => itemA[ 0 ] > itemB[ 0 ] ? 1 : -1 ) )
				.to.deep.equal( [
					[ 'aria-label', '"Rich Text Editor, main"' ],
					[ 'class', '"ck-blurred ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline"' ],
					[ 'contenteditable', '"true"' ],
					[ 'dir', '"ltr"' ],
					[ 'lang', '"en"' ],
					[ 'role', '"textbox"' ]
				] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'index', 'null' ],
				[ 'isEmpty', 'false' ],
				[ 'childCount', '1' ],
			] );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );

			const items = lists[ 2 ].items;
			expect( items[ 0 ] ).to.have.members( [ 'Symbol(rootName)', '"main"' ] );
			expect( items[ 1 ][ 0 ] ).to.equal( 'Symbol(document)' );
			expect( items[ 1 ][ 1 ] ).to.match( /^{/ );
			expect( items[ 2 ] ).to.have.members( [ 'foo', '"bar"' ] );
		} );

		it( 'renders for a ContainerElement', () => {
			editor.setData( '<p>foo</p>' );

			editor.editing.view.change( writer => {
				writer.setCustomProperty( 'foo', 'bar', editor.editing.view.document.getRoot().getChild( 0 ) );
			} );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 )
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'ContainerElement:p' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'index', '0' ],
				[ 'isEmpty', 'false' ],
				[ 'childCount', '1' ],
			] );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );
			expect( lists[ 2 ].items ).to.deep.equal( [
				[ 'foo', '"bar"' ]
			] );
		} );

		it( 'renders for an AttributeElement', () => {
			editor.setData( '<p><b>foo</b></p>' );

			editor.editing.view.change( writer => {
				writer.setCustomProperty( 'foo', 'bar', editor.editing.view.document.getRoot().getChild( 0 ).getChild( 0 ) );
			} );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 ).getChild( 0 )
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'AttributeElement:strong' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'index', '0' ],
				[ 'isEmpty', 'false' ],
				[ 'childCount', '1' ],
			] );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );
			expect( lists[ 2 ].items ).to.deep.equal( [
				[ 'foo', '"bar"' ]
			] );
		} );

		it( 'renders for an EmptyElement', () => {
			editor.setData( '<p>foo</p>' );

			editor.editing.view.change( writer => {
				const foo = writer.createEmptyElement( 'foo' );
				writer.insert( editor.editing.view.document.selection.getFirstPosition(), foo );
				writer.setCustomProperty( 'foo', 'bar', foo );
			} );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 ).getChild( 0 )
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'EmptyElement:foo' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'index', '0' ],
				[ 'isEmpty', 'true' ],
				[ 'childCount', '0' ],
			] );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );
			expect( lists[ 2 ].items ).to.deep.equal( [
				[ 'foo', '"bar"' ]
			] );
		} );

		it( 'renders for an UIElement', () => {
			editor.setData( '<p>foo</p>' );

			editor.editing.view.change( writer => {
				const foo = writer.createUIElement( 'foo' );
				writer.insert( editor.editing.view.document.selection.getFirstPosition(), foo );
				writer.setCustomProperty( 'foo', 'bar', foo );
			} );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 ).getChild( 0 )
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'UIElement:foo' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'index', '0' ],
				[ 'isEmpty', 'true' ],
				[ 'childCount', '0' ],
			] );

			expect( lists[ 2 ].name ).to.equal( 'Custom Properties' );
			expect( lists[ 2 ].items ).to.deep.equal( [
				[ 'foo', '"bar"' ]
			] );
		} );

		it( 'renders for an EditableElement', () => {
			editor.setData( '' );

			editor.editing.view.change( writer => {
				const foo = writer.createEditableElement( 'p' );
				writer.insert( editor.editing.view.document.selection.getFirstPosition(), foo );
				writer.setCustomProperty( 'foo', 'bar', foo );
			} );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 ).getChild( 0 )
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'EditableElement:p' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'index', '0' ],
				[ 'isEmpty', 'true' ],
				[ 'childCount', '0' ],
			] );

			const items = lists[ 2 ].items;
			expect( items[ 0 ][ 0 ] ).to.equal( 'Symbol(document)' );
			expect( items[ 0 ][ 1 ] ).to.match( /^{/ );
			expect( items[ 1 ] ).to.have.members( [ 'foo', '"bar"' ] );
		} );

		it( 'renders for a Text', () => {
			editor.setData( '<p>foo</p>' );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 ).getChild( 0 )
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'Text:foo' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'index', '0' ]
			] );
		} );

		it( 'refreshes the info on editor.editing.view#render', () => {
			editor.setData( '<p>foo</p>' );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 )
			} );

			editor.editing.view.change( writer => {
				writer.insert(
					writer.createPositionAt( root.getChild( 0 ), 1 ),
					writer.createEmptyElement( 'foo' ) );
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'ContainerElement:p' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'index', '0' ],
				[ 'isEmpty', 'false' ],
				[ 'childCount', '1' ]
			] );
		} );
	} );
} );
