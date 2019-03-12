/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../../utils/testeditor';
import CommandSidebar from '../../../../src/components/commands/sidebar';
import CommandInspector from '../../../../src/components/commands/inspector';

describe( '<CommandSidebar />', () => {
	let editor, wrapper, element;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			wrapper = shallow(
				<CommandSidebar editor={editor} />,
				{ attachTo: container }
			);
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	it( 'renders panes with a command inspector', () => {
		wrapper.setProps( { inspectedCommandName: 'foo' } );

		expect( wrapper.find( CommandInspector ).props().editor ).to.equal( editor );
		expect( wrapper.find( CommandInspector ).props().label ).to.equal( 'Inspect' );
		expect( wrapper.find( CommandInspector ).props().inspectedCommandName ).to.equal( 'foo' );
	} );
} );
