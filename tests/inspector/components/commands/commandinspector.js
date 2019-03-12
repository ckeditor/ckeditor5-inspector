/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../../utils/testeditor';
import Button from '../../../../src/components/button';
import PropertyList from '../../../../src/components/propertylist';
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

			wrapper = shallow(
				<CommandInspector editor={editor} />,
				{ attachTo: container }
			);
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'renders a placeholder when no props#inspectedCommandName', () => {
			wrapper.setProps( { inspectedCommandName: null } );

			expect( wrapper.text() ).to.match( /^Select a command to/ );
		} );

		it( 'renders command header', () => {
			wrapper.setProps( { inspectedCommandName: 'foo' } );

			const header = wrapper.find( 'h2.ck-inspector-code' );
			const execButton = wrapper.find( Button ).first();
			const logButton = wrapper.find( Button ).last();
			const execSpy = sinon.spy( editor.commands.get( 'foo' ), 'execute' );
			const logSpy = sinon.stub( Logger, 'log' ).callsFake( () => {} );

			expect( header.text() ).to.equal( 'Command:foo<Button /><Button />' );

			execButton.simulate( 'click' );
			sinon.assert.calledOnce( execSpy );

			logButton.simulate( 'click' );
			sinon.assert.calledOnce( logSpy );

			logSpy.restore();
		} );

		it( 'renders command info', () => {
			wrapper.setProps( { inspectedCommandName: 'foo' } );

			const list = wrapper.find( PropertyList );

			expect( list.props().items ).to.deep.equal( [
				[ 'isEnabled', 'true' ],
				[ 'value', 'undefined' ]
			] );
		} );

		it( 'refreshes command info on editor.model.document#change', () => {
			wrapper.setProps( { inspectedCommandName: 'foo' } );

			editor.commands.get( 'foo' ).value = 'bar';
			editor.model.document.fire( 'change' );

			expect( wrapper.find( PropertyList ).props().items ).to.deep.equal( [
				[ 'isEnabled', 'true' ],
				[ 'value', '"bar"' ]
			] );
		} );
	} );
} );
