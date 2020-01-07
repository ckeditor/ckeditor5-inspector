/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../../../utils/testeditor';
import CommandsPane from '../../../../src/components/commands/pane';
import CommandTree from '../../../../src/components/commands/tree';
import CommandInspector from '../../../../src/components/commands/commandinspector';

describe( '<CommandsPane />', () => {
	let editor, wrapper, element;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			wrapper = mount(
				<CommandsPane editor={editor} />,
				{ attachTo: container }
			);
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'state', () => {
		it( 'has initial state', () => {
			const state = wrapper.state();

			expect( state.editor ).to.equal( editor );
			expect( state.currentCommandName ).to.be.null;
		} );
	} );

	describe( 'handleTreeClick()', () => {
		it( 'changes state#currentCommandName', () => {
			const evt = {
				persist: sinon.spy(),
				stopPropagation: sinon.spy()
			};

			wrapper.instance().handleTreeClick( evt, 'bar' );

			expect( wrapper.state().currentCommandName ).to.equal( 'bar' );
			sinon.assert.calledOnce( evt.persist );
			sinon.assert.calledOnce( evt.stopPropagation );
		} );
	} );

	describe( 'render()', () => {
		it( 'renders a placeholder when no props#editor', () => {
			wrapper.setProps( { editor: null } );

			expect( wrapper.text() ).to.match( /^Nothing to show/ );
		} );

		it( 'renders a <CommandTree/>', () => {
			wrapper.setState( { currentCommandName: 'foo' } );

			expect( wrapper.find( CommandTree ).props().editor ).to.equal( editor );
			expect( wrapper.find( CommandTree ).props().currentCommandName ).to.equal( 'foo' );
			expect( wrapper.find( CommandTree ).props().onClick ).to.equal( wrapper.instance().handleTreeClick );
		} );

		it( 'renders a <CommandInspector/>', () => {
			wrapper.setState( { currentCommandName: 'foo' } );

			expect( wrapper.find( CommandInspector ).props().editor ).to.equal( editor );
			expect( wrapper.find( CommandInspector ).props().label ).to.equal( 'Inspect' );
			expect( wrapper.find( CommandInspector ).props().inspectedCommandName ).to.equal( 'foo' );
		} );
	} );

	describe( 'getDerivedStateFromProps()', () => {
		it( 'resets the command name when the editor changes', () => {
			wrapper.setState( { currentCommandName: 'foo' } );

			return TestEditor.create( element ).then( anotherEditor => {
				wrapper.setState( { editor: anotherEditor } );

				expect( wrapper.state().currentCommandName ).to.be.null;
			} );
		} );
	} );
} );
