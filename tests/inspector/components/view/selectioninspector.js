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
import ViewSelectionInspector from '../../../../src/components/view/selectioninspector';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( '<ViewSelectionInspector />', () => {
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

			wrapper = shallow( <ViewSelectionInspector editor={editor} /> );
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
			const wrapper = mount( <ViewSelectionInspector editor={editor} /> );
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

			expect( lists[ 0 ].name ).to.equal( 'Properties' );
			expect( lists[ 0 ].items ).to.deep.equal( [
				[ 'isCollapsed', 'true' ],
				[ 'isBackward', 'false' ],
				[ 'isFake', 'false' ],
				[ 'rangeCount', '1' ],
			] );

			expect( lists[ 1 ].name ).to.equal( 'Anchor' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'offset', '0' ],
				[ 'isAtEnd', 'false' ],
				[ 'isAtStart', 'true' ],
				[ 'parent', '"foo"' ],
			] );

			expect( lists[ 2 ].name ).to.equal( 'Focus' );
			expect( lists[ 2 ].items ).to.deep.equal( [
				[ 'offset', '0' ],
				[ 'isAtEnd', 'false' ],
				[ 'isAtStart', 'true' ],
				[ 'parent', '"foo"' ],
			] );
		} );

		it( 'refreshes the selection info on editor.editing.view.document#render', () => {
			const root = editor.editing.view.document.getRoot();

			editor.setData( '<p>a<b>bc</b>d</p>' );

			// <paragraph>a<$text bold>b[]c</$text>d</paragraph>
			editor.editing.view.change( writer => {
				writer.setSelection( root.getChild( 0 ), 1 );
			} );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Properties' );
			expect( lists[ 0 ].items ).to.deep.equal( [
				[ 'isCollapsed', 'true' ],
				[ 'isBackward', 'false' ],
				[ 'isFake', 'false' ],
				[ 'rangeCount', '1' ],
			] );

			expect( lists[ 1 ].name ).to.equal( 'Anchor' );
			expect( lists[ 1 ].items ).to.deep.equal( [
				[ 'offset', '1' ],
				[ 'isAtEnd', 'false' ],
				[ 'isAtStart', 'false' ],
				[ 'parent', '"container:p"' ],
			] );

			expect( lists[ 2 ].name ).to.equal( 'Focus' );
			expect( lists[ 2 ].items ).to.deep.equal( [
				[ 'offset', '1' ],
				[ 'isAtEnd', 'false' ],
				[ 'isAtStart', 'false' ],
				[ 'parent', '"container:p"' ],
			] );
		} );
	} );
} );
