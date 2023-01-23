/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../../utils/testeditor';

import SetEditorDataButton from '../../../src/components/seteditordatabutton';

import LoadDataIcon from '../../../src/assets/img/load-data.svg';

describe( '<SetEditorDataButton />', () => {
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
				isModalOpen: false,
				editorDataValue: ''
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
					isModalOpen: true,
					editorDataValue: ''
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

			it( 'should open upon #isModalOpen change', () => {
				expect( modal.props().isOpen ).to.be.false;

				wrapper.instance().setState( {
					isModalOpen: true
				} );

				wrapper.update();
				modal = wrapper.childAt( 1 );

				expect( modal.props().isOpen ).to.be.true;
			} );

			it( 'should set #editorDataValue after being open', () => {
				// React modal uses this internally.
				const rafStub = sinon.stub( window, 'requestAnimationFrame' ).callsFake( callback => {
					callback();
				} );

				const getDataStub = sinon.stub( editor, 'getData' ).returns( '<p>foo</p>' );

				wrapper.instance().setState( {
					isModalOpen: true
				} );

				expect( wrapper.state() ).to.deep.equal( {
					isModalOpen: true,
					editorDataValue: '<p>foo</p>'
				} );

				rafStub.restore();
				getDataStub.restore();
			} );

			it( 'should update #isModalOpen when close is requested (e.g. via click or Esc)', () => {
				// React modal uses this internally.
				const rafStub = sinon.stub( window, 'requestAnimationFrame' ).callsFake( callback => {
					callback();
				} );

				const getDataStub = sinon.stub( editor, 'getData' ).returns( '<p>foo</p>' );

				wrapper.instance().setState( {
					isModalOpen: true
				} );

				expect( wrapper.state() ).to.deep.equal( {
					isModalOpen: true,
					editorDataValue: '<p>foo</p>'
				} );

				modal = wrapper.childAt( 1 );

				modal.props().onRequestClose();

				expect( wrapper.state() ).to.deep.equal( {
					isModalOpen: false,
					editorDataValue: '<p>foo</p>'
				} );

				rafStub.restore();
				getDataStub.restore();
			} );

			describe( 'modal content', () => {
				let textarea, rafStub, getDataStub, loadDataButton, cancelButton, saveButton;

				beforeEach( () => {
					// React modal uses this internally.
					rafStub = sinon.stub( window, 'requestAnimationFrame' ).callsFake( callback => {
						callback();
					} );

					getDataStub = sinon.stub( editor, 'getData' ).returns( '<p>foo</p>' );

					wrapper.instance().setState( {
						isModalOpen: true
					} );

					wrapper.update();
					modal = wrapper.childAt( 1 );

					textarea = wrapper.find( 'textarea' );
					loadDataButton = modal.find( 'button' ).first();
					cancelButton = modal.find( 'button' ).at( 1 );
					saveButton = modal.find( 'button' ).at( 2 );
				} );

				afterEach( () => {
					rafStub.restore();
					getDataStub.restore();
				} );

				describe( 'textarea', () => {
					it( 'should have value bound to #editorDataValue', () => {
						expect( textarea.props().value ).to.equal( '<p>foo</p>' );
					} );

					it( 'should have a placeholder', () => {
						expect( textarea.props().placeholder ).to.equal( 'Paste HTML here...' );
					} );

					it( 'should update #editorDataValue on change', () => {
						const evt = {
							target: {
								value: '<b>bar</b>'
							}
						};

						textarea.simulate( 'change', evt );

						expect( wrapper.state() ).to.deep.equal( {
							isModalOpen: true,
							editorDataValue: '<b>bar</b>'
						} );
					} );

					it( 'should set editor data and close the modal on Shift+Enter ', () => {
						const setDataSpy = sinon.spy( editor, 'setData' );
						const evt = {
							key: 'Enter',
							shiftKey: true
						};

						textarea.simulate( 'keyPress', evt );

						sinon.assert.calledOnce( setDataSpy );

						expect( wrapper.state() ).to.deep.equal( {
							isModalOpen: false,
							editorDataValue: '<p>foo</p>'
						} );
					} );

					it( 'should do nothing special on Enter ', () => {
						const setDataSpy = sinon.spy( editor, 'setData' );
						const evt = {
							key: 'Enter'
						};

						textarea.simulate( 'keyPress', evt );

						sinon.assert.notCalled( setDataSpy );

						expect( wrapper.state() ).to.deep.equal( {
							isModalOpen: true,
							editorDataValue: '<p>foo</p>'
						} );
					} );
				} );

				describe( 'load data button', () => {
					it( 'should update #editorDataValue and focus textarea', () => {
						const focusSpy = sinon.spy( wrapper.find( 'textarea' ).getDOMNode(), 'focus' );

						getDataStub.returns( 'abcd' );

						loadDataButton.simulate( 'click' );
						wrapper.update();

						expect( wrapper.state() ).to.deep.equal( {
							isModalOpen: true,
							editorDataValue: 'abcd'
						} );

						sinon.assert.calledOnce( focusSpy );
					} );

					it( 'should have a text label', () => {
						expect( loadDataButton.text() ).to.equal( 'Load data' );
					} );
				} );

				describe( 'Cancel button', () => {
					it( 'should not set editor data and close the modal', () => {
						const setDataSpy = sinon.spy( editor, 'setData' );

						cancelButton.simulate( 'click' );

						wrapper.update();
						expect( wrapper.state() ).to.deep.equal( {
							isModalOpen: false,
							editorDataValue: '<p>foo</p>'
						} );

						sinon.assert.notCalled( setDataSpy );
					} );

					it( 'should have a text label', () => {
						expect( cancelButton.text() ).to.equal( 'Cancel' );
					} );
				} );

				describe( 'Set data button', () => {
					it( 'should set editor data and close the modal', () => {
						const setDataSpy = sinon.spy( editor, 'setData' );

						saveButton.simulate( 'click' );

						wrapper.update();
						expect( wrapper.state() ).to.deep.equal( {
							isModalOpen: false,
							editorDataValue: '<p>foo</p>'
						} );

						sinon.assert.calledOnce( setDataSpy );
					} );

					it( 'should have a text label', () => {
						expect( saveButton.text() ).to.equal( 'Set data' );
					} );
				} );
			} );
		} );
	} );
} );
