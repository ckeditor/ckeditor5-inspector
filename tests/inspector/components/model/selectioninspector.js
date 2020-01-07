/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../../utils/testeditor';
import Button from '../../../../src/components/button';
import ObjectInspector from '../../../../src/components/objectinspector';
import Logger from '../../../../src/logger';
import ModelSelectionInspector from '../../../../src/components/model/selectioninspector';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( '<ModelSelectionInspector />', () => {
	let editor, wrapper, element;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ]
		} ).then( newEditor => {
			editor = newEditor;

			wrapper = shallow( <ModelSelectionInspector editor={editor} /> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();
		sinon.restore();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'renders the inspector', () => {
			const wrapper = mount( <ModelSelectionInspector editor={editor} /> );
			const logSelButton = wrapper.find( Button ).first();
			const logAnchorButton = wrapper.find( Button ).at( 1 );
			const logFocusButton = wrapper.find( Button ).last();

			const logSpy = sinon.stub( Logger, 'log' ).callsFake( () => {} );

			expect( wrapper.childAt( 0 ).type() ).to.equal( ObjectInspector );
			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'Selection' );

			logSelButton.simulate( 'click' );
			sinon.assert.calledOnce( logSpy );

			logAnchorButton.simulate( 'click' );
			sinon.assert.calledTwice( logSpy );

			logFocusButton.simulate( 'click' );
			sinon.assert.calledThrice( logSpy );

			wrapper.unmount();
		} );

		it( 'renders selection properties', () => {
			editor.setData( '<p>foo</p>' );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'isCollapsed', 'true' ],
				[ 'isBackward', 'false' ],
				[ 'isGravityOverridden', 'false' ],
				[ 'rangeCount', '1' ],
			] );

			expect( lists[ 2 ].name ).to.equal( 'Anchor' );
			expect( lists[ 2 ].items ).to.deep.equal( [
				[ 'path', '[0,0]' ],
				[ 'stickiness', '"toNone"' ],
				[ 'index', '0' ],
				[ 'isAtEnd', 'false' ],
				[ 'isAtStart', 'true' ],
				[ 'offset', '0' ],
				[ 'textNode', 'null' ],
			] );

			expect( lists[ 3 ].name ).to.equal( 'Focus' );
			expect( lists[ 3 ].items ).to.deep.equal( [
				[ 'path', '[0,0]' ],
				[ 'stickiness', '"toNone"' ],
				[ 'index', '0' ],
				[ 'isAtEnd', 'false' ],
				[ 'isAtStart', 'true' ],
				[ 'offset', '0' ],
				[ 'textNode', 'null' ],
			] );
		} );

		it( 'refreshes the selection info on editor.model.document#change', () => {
			const root = editor.model.document.getRoot();

			editor.setData( '<p>a<b>bc</b>d</p>' );

			// <paragraph>a<$text bold>b[]c</$text>d</paragraph>
			editor.model.change( writer => {
				writer.setSelection( root.getChild( 0 ), 2 );
			} );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Attributes' );
			expect( lists[ 0 ].items ).to.deep.equal( [
				[ 'bold', 'true' ]
			] );

			expect( lists[ 1 ].name ).to.equal( 'Properties' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'isCollapsed', 'true' ],
				[ 'isBackward', 'false' ],
				[ 'isGravityOverridden', 'false' ],
				[ 'rangeCount', '1' ],
			] );

			expect( lists[ 2 ].name ).to.equal( 'Anchor' );
			expect( lists[ 2 ].items ).to.deep.equal( [
				[ 'path', '[0,2]' ],
				[ 'stickiness', '"toNone"' ],
				[ 'index', '1' ],
				[ 'isAtEnd', 'false' ],
				[ 'isAtStart', 'false' ],
				[ 'offset', '2' ],
				[ 'textNode', '"bc"' ],
			] );

			expect( lists[ 3 ].name ).to.equal( 'Focus' );
			expect( lists[ 3 ].items ).to.deep.equal( [
				[ 'path', '[0,2]' ],
				[ 'stickiness', '"toNone"' ],
				[ 'index', '1' ],
				[ 'isAtEnd', 'false' ],
				[ 'isAtStart', 'false' ],
				[ 'offset', '2' ],
				[ 'textNode', '"bc"' ],
			] );
		} );
	} );
} );
