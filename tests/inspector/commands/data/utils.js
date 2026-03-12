/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import TestEditor from '../../../utils/testeditor';

import {
	getCommandsTreeDefinition
} from '../../../../src/commands/data/utils';

describe( 'commands data utils', () => {
	describe( 'getCommandsTreeDefinition()', () => {
		let editor, element;

		beforeEach( () => {
			element = document.createElement( 'div' );
			document.body.appendChild( element );

			return TestEditor.create( element ).then( newEditor => {
				editor = newEditor;
			} );
		} );

		afterEach( () => {
			element.remove();

			return editor.destroy();
		} );

		it( 'returns an empty array when the editor is not found', () => {
			const result = getCommandsTreeDefinition( {
				editors: new Map(),
				currentEditorName: 'non-existent'
			} );

			expect( result ).toEqual( [] );
		} );

		it( 'marks disabled commands with a CSS class', () => {
			editor.commands.get( 'foo' ).forceDisabled( 'test' );

			const tree = getCommandsTreeDefinition( {
				editors: new Map( [ [ 'test', editor ] ] ),
				currentEditorName: 'test'
			} );

			const fooNode = tree.find( item => item.name === 'foo' );

			expect( fooNode.presentation.cssClass ).toContain( 'ck-inspector-tree-node_disabled' );
		} );
	} );
} );
