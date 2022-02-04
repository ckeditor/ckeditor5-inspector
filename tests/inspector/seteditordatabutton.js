/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../utils/testeditor';

import SetEditorDataButton from '../../src/seteditordatabutton';

import LoadDataIcon from '../../src/assets/img/load-data.svg';

// TODO: Let's move this button to components maybe?
describe( '<EditorQuickActions />', () => {
	let editor, wrapper, element, inspectorWrapperDomElement;

	beforeEach( () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		// <Modal> needs this. It will warn otherwise.
		inspectorWrapperDomElement = document.createElement( 'div' );
		inspectorWrapperDomElement.classList.add( 'ck-inspector-wrapper' );
		document.body.appendChild( inspectorWrapperDomElement );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			wrapper = mount( <SetEditorDataButton editor={editor} /> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();

		element.remove();

		inspectorWrapperDomElement.remove();

		return editor.destroy();
	} );

	describe( 'constructor()', () => {
		it( 'should have initial state', () => {
			expect( wrapper.state() ).to.deep.equal( {
				isSetDataModalOpen: false,
				setDataModalValue: ''
			} );
		} );
	} );

	describe( 'render()', () => {
		describe( '<Button>', () => {
			it( 'should render a <Button>', () => {
				expect( wrapper.childAt( 0 ).props().text ).to.equal( 'Set editor data' );
				expect( wrapper.childAt( 0 ).props().icon.type ).to.equal( LoadDataIcon );
				expect( wrapper.childAt( 0 ).props().isEnabled ).to.be.true;
			} );

			it( 'should open the modal when the button is clicked', () => {
				wrapper.childAt( 0 ).simulate( 'click' );
				wrapper.update();

				expect( wrapper.state() ).to.deep.equal( {
					isSetDataModalOpen: true,
					setDataModalValue: ''
				} );
			} );
		} );

		describe( '<Modal>', () => {
			let modal;

			beforeEach( () => {
				modal = wrapper.childAt( 1 );
			} );

			it( 'should render a <Modal>', () => {
				expect( modal.props().isOpen ).to.be.false;
				expect( modal.props().appElement ).to.equal( inspectorWrapperDomElement );
				expect( modal.props().overlayClassName ).to.equal( 'ck-inspector-modal ck-inspector-quick-actions__set-data-modal' );
				expect( modal.props().className ).to.equal( 'ck-inspector-quick-actions__set-data-modal__content' );
				expect( modal.props().portalClassName ).to.equal( 'ck-inspector-portal' );
				expect( modal.props().shouldCloseOnEsc ).to.be.true;
				expect( modal.props().shouldCloseOnOverlayClick ).to.be.true;
			} );

			it( 'should open upon #isSetDataModalOpen change ', () => {

			} );

			it( 'should set #setDataModalValue after being open', () => {

			} );

			it( 'should update #isSetDataModalOpen when close is requested (e.g. via click or Esc)', () => {

			} );

			describe( 'textarea', () => {
				it( 'should have value bound to #setDataModalValue', () => {

				} );

				it( 'should have a placeholder', () => {

				} );

				it( 'should update #setDataModalValue on change', () => {

				} );

				it( 'should set editor data and close the modal on Shift+Enter ', () => {

				} );
			} );

			describe( 'load data button', () => {
				it( 'should update #setDataModalValue and focus textarea', () => {

				} );

				it( 'should have a text label', () => {

				} );
			} );

			describe( 'Cancel button', () => {
				it( 'should not set editor data and close the modal', () => {

				} );
			} );

			describe( 'Set data button', () => {
				it( 'should set editor data and close the modal', () => {

				} );
			} );
		} );
	} );
} );
