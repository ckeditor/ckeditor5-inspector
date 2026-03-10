/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { Paragraph } from 'ckeditor5';
import { fireEvent, render } from '@testing-library/react';

import MiniCKEditorInspectorUI from '../../src/minickeditorinspectorui';
import TestEditor from '../utils/testeditor';

describe( '<MiniCKEditorInspectorUI />', () => {
	let editor, element, renderResult;

	beforeEach( async () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element, {
			plugins: [ Paragraph ],
			initialData: '<p>foo</p>'
		} );

		renderResult = render( <MiniCKEditorInspectorUI editor={editor} /> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		await editor.destroy();
	} );

	it( 'should render the mini inspector', () => {
		expect( document.querySelector( '.ck-mini-inspector' ) ).toBeTruthy();
	} );

	it( 'should render model and view trees', () => {
		const trees = document.querySelectorAll( '.ck-inspector-tree' );

		expect( trees.length ).toBeGreaterThanOrEqual( 2 );
	} );

	it( 'should handle clicks on tree nodes without errors', () => {
		const nodes = document.querySelectorAll( '.ck-inspector-tree-node' );

		expect( () => {
			nodes.forEach( node => fireEvent.click( node ) );
		} ).not.toThrow();
	} );

	it( 'should update trees when the model changes', async () => {
		const treeNodesBefore = document.querySelectorAll( '.ck-inspector-tree-node' ).length;

		editor.model.change( writer => {
			const root = editor.model.document.getRoot();
			const paragraph = writer.createElement( 'paragraph' );

			writer.insert( paragraph, root, 'end' );
		} );

		// Wait for the state update triggered by the 'change' event.
		await new Promise( resolve => setTimeout( resolve, 0 ) );

		const treeNodesAfter = document.querySelectorAll( '.ck-inspector-tree-node' ).length;

		expect( treeNodesAfter ).toBeGreaterThan( treeNodesBefore );
	} );
} );
