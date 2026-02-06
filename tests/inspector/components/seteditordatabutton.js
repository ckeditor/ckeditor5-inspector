/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TestEditor from '../../utils/testeditor';
import SetEditorDataButton from '../../../src/components/seteditordatabutton';

describe( '<SetEditorDataButton />', () => {
	let editor, element, inspectorWrapperDomElement, renderResult, getDataSpy;

	const openModal = async () => {
		fireEvent.click( screen.getByRole( 'button', { name: 'Set editor data' } ) );
		return screen.findByRole( 'heading', { name: 'Set editor data' } );
	};

	beforeEach( async () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		// <Modal> needs this. It will warn otherwise.
		inspectorWrapperDomElement = document.createElement( 'div' );
		inspectorWrapperDomElement.classList.add( 'ck-inspector-wrapper' );
		document.body.appendChild( inspectorWrapperDomElement );

		editor = await TestEditor.create( element );
		renderResult = render( <SetEditorDataButton editor={editor} /> );
	} );

	afterEach( async () => {
		renderResult.unmount();
		element.remove();
		inspectorWrapperDomElement.remove();
		await editor.destroy();
	} );

	describe( '<Button>', () => {
		it( 'should render a <Button>', () => {
			const button = screen.getByRole( 'button', { name: 'Set editor data' } );

			expect( button ).toHaveClass( 'ck-inspector-button' );
			expect( button ).not.toHaveClass( 'ck-inspector-button_disabled' );
			expect( button.querySelector( 'svg' ) ).toBeTruthy();
		} );

		it( 'should open the modal when the button is clicked', async () => {
			await openModal();

			expect( screen.getByRole( 'heading', { name: 'Set editor data' } ) ).toBeInTheDocument();
		} );
	} );

	describe( '<Modal>', () => {
		it( 'should render modal classes when opened', async () => {
			await openModal();

			expect( document.querySelector( '.ck-inspector-portal' ) ).toBeTruthy();
			expect( document.querySelector( '.ck-inspector-modal' ) ).toBeTruthy();
			expect( document.querySelector( '.ck-inspector-quick-actions__set-data-modal__content' ) ).toBeTruthy();
		} );

		it( 'should set textarea value after being open', async () => {
			vi.spyOn( window, 'requestAnimationFrame' ).mockImplementation( callback => {
				callback();
				return 0;
			} );
			vi.spyOn( editor, 'getData' ).mockReturnValue( '<p>foo</p>' );

			await openModal();

			expect( screen.getByPlaceholderText( 'Paste HTML here...' ) ).toHaveValue( '<p>foo</p>' );
		} );
	} );

	describe( 'modal content', () => {
		beforeEach( () => {
			vi.spyOn( window, 'requestAnimationFrame' ).mockImplementation( callback => {
				callback();
				return 0;
			} );
			getDataSpy = vi.spyOn( editor, 'getData' ).mockReturnValue( '<p>foo</p>' );
		} );

		it( 'should have a placeholder', async () => {
			await openModal();
			expect( screen.getByPlaceholderText( 'Paste HTML here...' ) ).toBeInTheDocument();
		} );

		it( 'should update textarea value on change', async () => {
			await openModal();
			const textarea = screen.getByPlaceholderText( 'Paste HTML here...' );

			fireEvent.change( textarea, { target: { value: '<b>bar</b>' } } );
			expect( textarea ).toHaveValue( '<b>bar</b>' );
		} );

		it( 'should set editor data and close the modal on Shift+Enter', async () => {
			const setDataSpy = vi.spyOn( editor, 'setData' );

			await openModal();
			const textarea = screen.getByPlaceholderText( 'Paste HTML here...' );

			fireEvent.keyPress( textarea, {
				key: 'Enter',
				keyCode: 13,
				charCode: 13,
				shiftKey: true
			} );

			expect( setDataSpy ).toHaveBeenCalledTimes( 1 );
			expect( screen.queryByRole( 'heading', { name: 'Set editor data' } ) ).toBeNull();
		} );

		it( 'should do nothing special on Enter', async () => {
			const setDataSpy = vi.spyOn( editor, 'setData' );

			await openModal();
			const textarea = screen.getByPlaceholderText( 'Paste HTML here...' );

			fireEvent.keyDown( textarea, { key: 'Enter' } );

			expect( setDataSpy ).not.toHaveBeenCalled();
			expect( screen.getByRole( 'heading', { name: 'Set editor data' } ) ).toBeInTheDocument();
		} );

		it( 'should update editor data and focus textarea when loading data', async () => {
			const textarea = await openModal().then( () => screen.getByPlaceholderText( 'Paste HTML here...' ) );
			getDataSpy.mockReturnValue( 'abcd' );

			fireEvent.click( screen.getByRole( 'button', { name: 'Load data' } ) );

			expect( textarea ).toHaveValue( 'abcd' );
			expect( textarea ).toHaveFocus();
		} );

		it( 'should not set editor data and close the modal on cancel', async () => {
			const setDataSpy = vi.spyOn( editor, 'setData' );

			await openModal();
			fireEvent.click( screen.getByRole( 'button', { name: 'Cancel' } ) );

			expect( setDataSpy ).not.toHaveBeenCalled();
			expect( screen.queryByRole( 'heading', { name: 'Set editor data' } ) ).toBeNull();
		} );

		it( 'should set editor data and close the modal', async () => {
			const setDataSpy = vi.spyOn( editor, 'setData' );

			await openModal();
			fireEvent.click( screen.getByRole( 'button', { name: 'Set data' } ) );

			expect( setDataSpy ).toHaveBeenCalledTimes( 1 );
			expect( screen.queryByRole( 'heading', { name: 'Set editor data' } ) ).toBeNull();
		} );
	} );
} );
