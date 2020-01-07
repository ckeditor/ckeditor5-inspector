/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../../utils/testeditor';
import Button from '../../../../src/components/button';
import ObjectInspector from '../../../../src/components/objectinspector';
import Pane from '../../../../src/components/pane';
import Logger from '../../../../src/logger';
import CommandInspector from '../../../../src/components/commands/commandinspector';

describe( '<CommandInspector />', () => {
	let editor, wrapper, element;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			wrapper = shallow( <CommandInspector editor={editor} /> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();
		sinon.restore();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'renders a placeholder when no props#inspectedCommandName', () => {
			wrapper.setProps( { inspectedCommandName: null } );

			expect( wrapper.type() ).to.equal( Pane );
			expect( wrapper.childAt( 0 ).text() ).to.match( /^Select a command to/ );
		} );

		it( 'renders the inspector', () => {
			const wrapper = mount( <CommandInspector editor={editor} /> );

			wrapper.setProps( { inspectedCommandName: 'foo' } );

			const execButton = wrapper.find( Button ).first();
			const logButton = wrapper.find( Button ).last();
			const execSpy = sinon.spy( editor.commands.get( 'foo' ), 'execute' );
			const logSpy = sinon.stub( Logger, 'log' ).callsFake( () => {} );

			expect( wrapper.childAt( 0 ).type() ).to.equal( ObjectInspector );
			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'Command:foo' );

			execButton.simulate( 'click' );
			sinon.assert.calledOnce( execSpy );

			logButton.simulate( 'click' );
			sinon.assert.calledOnce( logSpy );

			wrapper.unmount();
		} );

		it( 'renders command info', () => {
			wrapper.setProps( { inspectedCommandName: 'foo' } );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].items ).to.deep.equal( [
				[ 'isEnabled', 'true' ],
				[ 'value', 'undefined' ]
			] );
		} );

		it( 'refreshes command info on editor.model.document#change', () => {
			wrapper.setProps( { inspectedCommandName: 'foo' } );

			editor.commands.get( 'foo' ).value = 'bar';
			editor.model.document.fire( 'change' );

			expect( wrapper.find( ObjectInspector ).props().lists[ 0 ].items ).to.deep.equal( [
				[ 'isEnabled', 'true' ],
				[ 'value', '"bar"' ]
			] );
		} );
	} );
} );
