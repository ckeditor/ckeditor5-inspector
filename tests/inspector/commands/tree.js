/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { getCommandsTreeDefinition } from '../../../src/commands/data/utils';
import CommandTree from '../../../src/commands/tree';

describe( '<CommandTree />', () => {
	let editor, renderResult, element, store;

	beforeEach( async () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element );

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
				treeDefinition: getCommandsTreeDefinition( { editors, currentEditorName } )
			}
		} );

		renderResult = render( <Provider store={store}><CommandTree /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should use a <Tree> component', () => {
			const active = document.querySelector( '.ck-inspector-tree-node_active' );
			expect( active ).toBeTruthy();
			expect( active.querySelector( '.ck-inspector-tree-node__name' ) ).toHaveTextContent( 'foo' );
		} );

		it( 'should render a <Tree> with commands in alphabetical order', () => {
			const names = Array.from(
				document.querySelectorAll( '.ck-inspector-tree-node__name:not(.ck-inspector-tree-node__name_close)' )
			).map( node => node.textContent );

			expect( names ).toEqual( [ 'bar', 'foo', 'qux' ] );
		} );
	} );
} );
