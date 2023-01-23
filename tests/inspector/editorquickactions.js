/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window, KeyboardEvent */

import React from 'react';
import TestEditor from '../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import EditorQuickActions from '../../src/editorquickactions';

import SourceIcon from '../../src/assets/img/source.svg';
import CopyToClipboardIcon from '../../src/assets/img/copy-to-clipboard.svg';
import CheckmarkIcon from '../../src/assets/img/checkmark.svg';
import LoadDataIcon from '../../src/assets/img/load-data.svg';

describe( '<EditorQuickActions />', () => {
	let editor, store, wrapper, element;

	beforeEach( () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			store = createStore( ( state, action ) => ( { ...state, ...action.state } ), {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				ui: {
					activeTab: 'Model'
				},
				currentEditorGlobals: {},
				model: {
					roots: [],
					ranges: [],
					markers: [],
					treeDefinition: null,
					currentRootName: 'main',
					ui: {
						activeTab: 'Selection',
						showMarkers: false,
						showCompactText: false
					}
				}
			} );

			wrapper = mount( <Provider store={store}><EditorQuickActions /></Provider> );
		} );
	} );

	afterEach( () => {
		if ( wrapper.children().length ) {
			wrapper.unmount();
		}

		element.remove();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render an element with a CSS class', () => {
			expect( wrapper.children().childAt( 0 ) ).to.have.className( 'ck-inspector-editor-quick-actions' );
		} );

		describe( 'log editor button', () => {
			it( 'should be rendered and log the editor in the console', () => {
				const logSpy = sinon.stub( console, 'log' );
				const logButton = wrapper.find( 'Button' ).at( 0 );

				logButton.simulate( 'click' );

				sinon.assert.calledOnce( logSpy );
				sinon.assert.calledWith( logSpy, editor );

				logSpy.restore();
			} );
		} );

		describe( 'log editor data button', () => {
			it( 'should be rendered and log the editor data in the console', () => {
				const logSpy = sinon.stub( console, 'log' );
				const logButton = wrapper.find( 'Button' ).at( 1 );

				logButton.simulate( 'click' );

				sinon.assert.calledOnce( logSpy );
				sinon.assert.calledWith( logSpy, editor.getData() );

				logSpy.restore();
			} );

			it( 'should react to the Shift being pressed and turn into "copy to clipboard" button', () => {
				const quickActions = wrapper.find( 'EditorQuickActions' );
				let logButton = wrapper.find( 'Button' ).at( 1 );

				expect( logButton.props().icon.type ).to.equal( SourceIcon );
				expect( logButton.props().text ).to.equal( 'Log editor data (press with Shift to copy)' );

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: false,
					wasEditorDataJustCopied: false
				} );

				document.dispatchEvent( new KeyboardEvent( 'keydown', { key: 'Shift' } ) );
				wrapper.update();

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: true,
					wasEditorDataJustCopied: false
				} );

				logButton = wrapper.find( 'Button' ).at( 1 );
				expect( logButton.props().icon.type ).to.equal( CopyToClipboardIcon );
				expect( logButton.props().text ).to.equal( 'Log editor data (press with Shift to copy)' );
			} );

			// Note: Due to limitations of the copy-to-clipboard library, this test is unable to check if the
			// actual editor data is copied to clipboard :( It falls back to window.prompt().
			it( 'should copy the content of the editor to the clipboard if clicked with Shift key', done => {
				const clock = sinon.useFakeTimers();
				const promptStub = sinon.stub( window, 'prompt' ).returns( '<p>foo</p>' );
				const quickActions = wrapper.find( 'EditorQuickActions' );
				let logButton = wrapper.find( 'Button' ).at( 1 );

				expect( logButton.props().icon.type ).to.equal( SourceIcon );
				expect( logButton.props().text ).to.equal( 'Log editor data (press with Shift to copy)' );

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: false,
					wasEditorDataJustCopied: false
				} );

				// Press the Shift key. The buttons should start copying to clipboard instead of logging.
				document.dispatchEvent( new KeyboardEvent( 'keydown', { key: 'Shift' } ) );
				logButton.simulate( 'click', { shiftKey: true } );

				wrapper.update();

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: true,
					wasEditorDataJustCopied: true
				} );

				logButton = wrapper.find( 'Button' ).at( 1 );
				expect( logButton.props().icon.type ).to.equal( CheckmarkIcon );
				expect( logButton.props().text ).to.equal( 'Data copied to clipboard.' );

				// Make sure the checkmark icon + text stay for 3000ms.
				clock.tick( 2500 );
				wrapper.update();

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: true,
					wasEditorDataJustCopied: true
				} );

				logButton = wrapper.find( 'Button' ).at( 1 );
				expect( logButton.props().icon.type ).to.equal( CheckmarkIcon );
				expect( logButton.props().text ).to.equal( 'Data copied to clipboard.' );

				// Wait for the checkmark icon + text to disappear.
				clock.tick( 1000 );
				wrapper.update();

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: true,
					wasEditorDataJustCopied: false
				} );

				logButton = wrapper.find( 'Button' ).at( 1 );
				expect( logButton.props().icon.type ).to.equal( CopyToClipboardIcon );
				expect( logButton.props().text ).to.equal( 'Log editor data (press with Shift to copy)' );

				// Release the Shift key.
				document.dispatchEvent( new KeyboardEvent( 'keyup' ) );
				wrapper.update();

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: false,
					wasEditorDataJustCopied: false
				} );

				promptStub.restore();
				clock.restore();

				done();
			} );

			// This one tests clearTimeout() that changes the icon + button text in componentWillUnmount().
			it( 'should not throw if the inspector was destroyed immediatelly after the editor data was copied', done => {
				const clock = sinon.useFakeTimers();
				const promptStub = sinon.stub( window, 'prompt' ).returns( '<p>foo</p>' );
				const errorSpy = sinon.stub( console, 'error' );
				const quickActions = wrapper.find( 'EditorQuickActions' );
				const logButton = wrapper.find( 'Button' ).at( 1 );

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: false,
					wasEditorDataJustCopied: false
				} );

				// Press the Shift key. The button should start copying to clipboard instead of logging.
				document.dispatchEvent( new KeyboardEvent( 'keydown', { key: 'Shift' } ) );
				logButton.simulate( 'click', { shiftKey: true } );

				wrapper.update();

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: true,
					wasEditorDataJustCopied: true
				} );

				wrapper.unmount();
				clock.tick( 5000 );

				sinon.assert.notCalled( errorSpy );

				promptStub.restore();
				errorSpy.restore();
				clock.restore();
				done();
			} );

			// This one tests document.removeEventListener in componentWillUnmount().
			it( 'should not throw if Shift key was pressed or released after the inspector was destroyed', done => {
				const clock = sinon.useFakeTimers();
				const errorSpy = sinon.stub( console, 'error' );
				const quickActions = wrapper.find( 'EditorQuickActions' );

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: false,
					wasEditorDataJustCopied: false
				} );

				// Press the Shift key. The buttons should start copying to clipboard instead of logging.
				document.dispatchEvent( new KeyboardEvent( 'keydown', { key: 'Shift' } ) );
				wrapper.update();

				expect( quickActions.state() ).to.deep.equal( {
					isShiftKeyPressed: true,
					wasEditorDataJustCopied: false
				} );

				wrapper.unmount();
				clock.tick( 5000 );

				document.dispatchEvent( new KeyboardEvent( 'keyup' ) );
				document.dispatchEvent( new KeyboardEvent( 'keydown', { key: 'Shift' } ) );

				sinon.assert.notCalled( errorSpy );

				errorSpy.restore();
				clock.restore();
				done();
			} );
		} );

		describe( 'set editor data button', () => {
			let inspectorWrapper;

			beforeEach( () => {
				// <Modal> needs this. It will warn otherwise.
				inspectorWrapper = document.createElement( 'div' );
				inspectorWrapper.classList.add( 'ck-inspector-wrapper' );
				document.body.appendChild( inspectorWrapper );
			} );

			afterEach( () => {
				inspectorWrapper.remove();
			} );

			it( 'should be rendered', () => {
				const setDataButton = wrapper.find( 'SetEditorDataButton' );

				expect( setDataButton.childAt( 0 ).props().text ).to.equal( 'Set editor data' );
				expect( setDataButton.childAt( 0 ).props().icon.type ).to.equal( LoadDataIcon );
			} );

			it( 'should open a model when clicked', () => {
				const setDataButton = wrapper.find( 'SetEditorDataButton' );

				expect( setDataButton.state() ).to.deep.equal( {
					isModalOpen: false,
					editorDataValue: ''
				}, 'before click' );

				setDataButton.simulate( 'click' );
				wrapper.update();

				expect( setDataButton.state() ).to.deep.equal( {
					isModalOpen: true,
					editorDataValue: ''
				}, 'after click' );
			} );
		} );

		describe( 'toggle read only button', () => {
			it( 'should be rendered and toggle the editor read only state', () => {
				const toggleReadOnlyButton = wrapper.find( 'Button' ).at( 3 );

				toggleReadOnlyButton.simulate( 'click' );
				expect( editor.isReadOnly ).to.be.true;

				toggleReadOnlyButton.simulate( 'click' );
				expect( editor.isReadOnly ).to.be.false;
			} );
		} );

		describe( 'destroy editor button', () => {
			it( 'should be rendered and destory the editor', () => {
				const destroyButton = wrapper.find( 'Button' ).at( 4 );
				const spy = sinon.spy( editor, 'destroy' );

				destroyButton.simulate( 'click' );
				sinon.assert.calledOnce( spy );
			} );
		} );

		it( 'should enable all buttons when there is a current editor', () => {
			wrapper.find( 'Button' ).forEach( button => {
				expect( button.props().isEnabled ).to.be.true;
			} );
		} );

		it( 'should disable all buttons when there is no current editor', () => {
			store.dispatch( {
				type: 'testAction',
				state: {
					editors: new Map(),
					currentEditorName: null
				}
			} );

			wrapper.update();

			wrapper.find( 'Button' ).forEach( button => {
				expect( button.props().isEnabled ).to.be.false;
			} );
		} );
	} );
} );
