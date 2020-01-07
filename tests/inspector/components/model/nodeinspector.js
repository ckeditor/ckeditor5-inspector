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
import ModelNodeInspector from '../../../../src/components/model/nodeinspector';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( '<ModelNodeInspector />', () => {
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

			root = editor.model.document.getRoot();

			wrapper = mount( <ModelNodeInspector editor={editor} currentRootName="main" /> );
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

			wrapper.setProps( {
				inspectedNode: root
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'RootElement:main' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'childCount', '1' ],
				[ 'startOffset', 'null' ],
				[ 'endOffset', 'null' ],
				[ 'maxOffset', '1' ],
				[ 'path', '[]' ]
			] );
		} );

		it( 'renders for an Element', () => {
			editor.setData( '<p>foo</p>' );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 )
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'Element:paragraph' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'childCount', '1' ],
				[ 'startOffset', '0' ],
				[ 'endOffset', '1' ],
				[ 'maxOffset', '3' ],
				[ 'path', '[0]' ]
			] );
		} );

		it( 'renders for a Text', () => {
			editor.setData( '<p><b>f</b>oo</p>' );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 ).getChild( 0 )
			} );

			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'Text:f' );
			expect( wrapper.childAt( 0 ).find( 'h2 a' ) ).to.have.attr( 'href' ).match( /^https:\/\/ckeditor.com\/docs/ );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [
				[ 'bold', 'true', [ [ 'isFormatting', 'true' ], [ 'copyOnEnter', 'true' ] ] ]
			] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'startOffset', '0' ],
				[ 'endOffset', '1' ],
				[ 'offsetSize', '1' ],
				[ 'path', '[0,0]' ]
			] );
		} );

		it( 'refreshes the info on editor.model.document#change', () => {
			const wrapper = shallow( <ModelNodeInspector editor={editor} currentRootName="main" /> );

			editor.setData( '<p>foo</p>' );

			wrapper.setProps( {
				inspectedNode: root.getChild( 0 )
			} );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'childCount', '1' ],
				[ 'startOffset', '0' ],
				[ 'endOffset', '1' ],
				[ 'maxOffset', '3' ],
				[ 'path', '[0]' ]
			] );

			editor.model.change( writer => {
				writer.insertText( 'bar', root.getChild( 0 ), 0 );
			} );

			expect( wrapper.find( ObjectInspector ).props().lists[ 1 ].items ).to.deep.equal( [
				[ 'childCount', '1' ],
				[ 'startOffset', '0' ],
				[ 'endOffset', '1' ],
				[ 'maxOffset', '6' ],
				[ 'path', '[0]' ]
			] );

			wrapper.unmount();
		} );
	} );
} );
