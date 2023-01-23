/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { getEditorCommandDefinition } from '../../../src/commands/data/utils';

import Button from '../../../src/components/button';
import ObjectInspector from '../../../src/components/objectinspector';
import Logger from '../../../src/logger';
import CommandInspector from '../../../src/commands/commandinspector';

describe( '<CommandInspector />', () => {
	let editor, wrapper, element, store;

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			const editors = new Map( [ [ 'test-editor', editor ] ] );
			const currentEditorName = 'test-editor';

			store = createStore( state => state, {
				editors,
				currentEditorName,
				ui: {
					activeTab: 'Commands'
				},
				commands: {
					currentCommandName: 'foo',
					currentCommandDefinition: getEditorCommandDefinition( { editors, currentEditorName }, 'foo' ),
					treeDefinition: null
				}
			} );

			wrapper = mount( <Provider store={store}><CommandInspector /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();
		sinon.restore();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a placeholder when no props#currentCommandDefinition', () => {
			const store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				commands: {
					currentCommandDefinition: null
				}
			} );

			const wrapper = mount( <Provider store={store}><CommandInspector /></Provider> );

			expect( wrapper.childAt( 0 ).text() ).to.match( /^Select a command to/ );

			wrapper.unmount();
		} );

		it( 'should render an object inspector when there is props#currentCommandDefinition', () => {
			expect( wrapper.find( ObjectInspector ) ).to.have.length( 1 );
		} );

		it( 'should render the execute command button in the header', () => {
			const execCommandButton = wrapper.find( Button ).first();
			const execSpy = sinon.spy( editor.commands.get( 'foo' ), 'execute' );

			execCommandButton.simulate( 'click' );
			sinon.assert.calledOnce( execSpy );
		} );

		it( 'should render the log button in the header', () => {
			const logCommandButton = wrapper.find( Button ).last();
			const logSpy = sinon.stub( Logger, 'log' ).callsFake( () => {} );

			logCommandButton.simulate( 'click' );
			sinon.assert.calledOnce( logSpy );
		} );

		it( 'renders command info', () => {
			wrapper.setProps( { inspectedCommandName: 'foo' } );

			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {
				isEnabled: { value: 'true' },
				value: { value: 'undefined' }
			} );
		} );
	} );
} );
