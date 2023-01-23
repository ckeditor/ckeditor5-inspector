/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window, HTMLElement */

import TestEditor from '../utils/testeditor';
import CKEditorInspector from '../../src/ckeditorinspector';

import Logger from '../../src/logger';
import {
	getStoreState,
	dispatchStoreAction
} from '../utils/utils';

import {
	SET_EDITORS,
	UPDATE_CURRENT_EDITOR_IS_READ_ONLY,
	setCurrentEditorName,
	toggleIsCollapsed
} from '../../src/data/actions';

import {
	LOCAL_STORAGE_IS_COLLAPSED
} from '../../src/data/reducer';

import { UPDATE_MODEL_STATE } from '../../src/model/data/actions';
import { UPDATE_VIEW_STATE } from '../../src/view/data/actions';
import { UPDATE_COMMANDS_STATE } from '../../src/commands/data/actions';
import LocalStorageManager from '../../src/localstoragemanager';

describe( 'CKEditorInspector', () => {
	let editor, element, warnStub;

	beforeEach( () => {
		window.localStorage.clear();

		// Silence inspector logs.
		sinon.stub( Logger, 'log' ).callsFake( () => {} );
		warnStub = sinon.stub( Logger, 'warn' ).callsFake( () => {} );

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;
		} );
	} );

	afterEach( () => {
		sinon.restore();
		element.remove();

		CKEditorInspector.destroy();

		return editor.destroy();
	} );

	describe( 'CKEDITOR_INSPECTOR_VERSION', () => {
		it( 'should be set', () => {
			expect( window.CKEDITOR_INSPECTOR_VERSION ).to.be.a( 'string' );
		} );
	} );

	it( 'should warn if called the constructor()', () => {
		// eslint-disable-next-line no-unused-vars
		const inspector = new CKEditorInspector();

		sinon.assert.calledWithMatch(
			warnStub,
			/\[CKEditorInspector\] Whoops! Looks like you tried to create an instance of the CKEditorInspector class\./
		);
	} );

	describe( '#attach()', () => {
		let CKEDITOR_VERSION;

		beforeEach( () => {
			CKEDITOR_VERSION = window.CKEDITOR_VERSION;
		} );

		afterEach( () => {
			window.CKEDITOR_VERSION = CKEDITOR_VERSION;
		} );

		it( 'should warn if using CKEditor 5 in lower versions than 34', () => {
			window.CKEDITOR_VERSION = '33.0.0';

			CKEditorInspector.attach( { foo: editor } );

			sinon.assert.calledWithMatch(
				warnStub,
				/^\[CKEditorInspector\] The inspector requires using CKEditor 5 in version 34 or higher\./
			);
		} );

		it( 'should not warn if using CKEditor 5 in version 34', () => {
			window.CKEDITOR_VERSION = '34.0.0';

			CKEditorInspector.attach( { foo: editor } );

			expect( warnStub.called ).to.equal( false );
		} );

		it( 'should warn if cannot determine a version of CKEditor 5', () => {
			delete window.CKEDITOR_VERSION;

			CKEditorInspector.attach( { foo: editor } );

			sinon.assert.calledWithMatch(
				warnStub,
				/^\[CKEditorInspector\] Could not determine a version of CKEditor 5. Some of the functionalities may not work as expected\./
			);
		} );

		it( 'should add the inspector to DOM', () => {
			expect( document.querySelector( '.ck-inspector-wrapper' ) ).to.be.null;
			expect( CKEditorInspector._wrapper ).to.be.null;

			CKEditorInspector.attach( { foo: editor } );

			expect( CKEditorInspector._wrapper ).to.be.instanceOf( HTMLElement );

			const wrapper = CKEditorInspector._wrapper;

			expect( wrapper.tagName.toLowerCase() ).to.equal( 'div' );
			expect( wrapper.parentNode ).to.equal( document.body );
			expect( wrapper.childNodes.length ).to.equal( 1 );
			expect( wrapper.firstChild.classList.contains( 'ck-inspector' ) ).to.be.true;
		} );

		describe( 'redux #_store', () => {
			it( 'should be created with the first editor', () => {
				CKEditorInspector.attach( { foo: editor } );

				const state = getStoreState();

				expect( state.editors.get( 'foo' ) ).to.equal( CKEditorInspector._editors.get( 'foo' ) );
				expect( state.currentEditorName ).to.equal( 'foo' );
			} );

			it( 'should be created only once when attaching to the first editor', () => {
				const anotherEditorElement = document.createElement( 'div' );
				document.body.appendChild( anotherEditorElement );

				return TestEditor.create( anotherEditorElement )
					.then( anotherEditor => {
						CKEditorInspector.attach( { foo: editor } );

						const firstReference = CKEditorInspector._store;

						CKEditorInspector.attach( { bar: anotherEditor } );

						const secondReference = CKEditorInspector._store;

						expect( firstReference ).to.equal( secondReference );

						return anotherEditor.destroy();
					} );
			} );
		} );

		describe( '#_editorListener', () => {
			describe( 'document#change and view#render events', () => {
				it( 'should start listening to the document#change and view#render events', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = sinon.stub( CKEditorInspector._store, 'dispatch' );

					editor.model.document.fire( 'change' );

					sinon.assert.calledThrice( spy );
					sinon.assert.calledWithExactly( spy.firstCall, { type: UPDATE_MODEL_STATE } );
					sinon.assert.calledWithExactly( spy.secondCall, { type: UPDATE_COMMANDS_STATE } );

					// After model->view conversion.
					sinon.assert.calledWithExactly( spy.thirdCall, { type: UPDATE_VIEW_STATE } );

					editor.editing.view.fire( 'render' );
					sinon.assert.callCount( spy, 4 );
					sinon.assert.calledWithExactly( spy.getCall( 3 ), { type: UPDATE_VIEW_STATE } );

					spy.restore();
				} );

				// https://github.com/ckeditor/ckeditor5-inspector/issues/80
				it( 'should not respond to the document#change and view#render events when the inspector UI is collapsed', () => {
					CKEditorInspector.attach( { foo: editor } );
					dispatchStoreAction( toggleIsCollapsed() );

					const spy = sinon.stub( CKEditorInspector._store, 'dispatch' );

					editor.model.document.fire( 'change' );
					sinon.assert.notCalled( spy );

					spy.restore();
				} );

				it( 'should stop listening to the document#change and view#render events when the inspector is being detached', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = sinon.spy( CKEditorInspector._store, 'dispatch' );

					editor.model.document.fire( 'change' );
					sinon.assert.calledThrice( spy );

					CKEditorInspector.detach( 'foo' );

					editor.model.document.fire( 'change' );

					sinon.assert.callCount( spy, 4 );
					sinon.assert.calledWithExactly( spy.getCall( 3 ), { type: SET_EDITORS, editors: sinon.match.map } );
				} );

				it( 'should stop listening to the document#change and view#render events when the inspector is being destroyed', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = sinon.spy( CKEditorInspector._store, 'dispatch' );

					editor.model.document.fire( 'change' );
					sinon.assert.calledThrice( spy );

					CKEditorInspector.destroy();

					editor.model.document.fire( 'change' );
					sinon.assert.calledThrice( spy );
				} );
			} );

			it( 'should stop listening to the previous one and start listening to the one when switching editors', () => {
				const anotherEditorElement = document.createElement( 'div' );
				document.body.appendChild( anotherEditorElement );

				return TestEditor.create( anotherEditorElement )
					.then( anotherEditor => {
						CKEditorInspector.attach( { foo: editor, bar: anotherEditor } );

						const spy = sinon.spy( CKEditorInspector._store, 'dispatch' );

						editor.model.document.fire( 'change' );
						sinon.assert.calledThrice( spy );

						dispatchStoreAction( setCurrentEditorName( 'bar' ) );
						spy.resetHistory();

						editor.model.document.fire( 'change' );
						sinon.assert.notCalled( spy );

						anotherEditor.model.document.fire( 'change' );
						sinon.assert.calledThrice( spy );

						return anotherEditor.destroy();
					} );
			} );

			it( 'should be created only once when attaching to the first editor', () => {
				const anotherEditorElement = document.createElement( 'div' );
				document.body.appendChild( anotherEditorElement );

				return TestEditor.create( anotherEditorElement )
					.then( anotherEditor => {
						CKEditorInspector.attach( { foo: editor } );

						const firstReference = CKEditorInspector._editorListener;

						CKEditorInspector.attach( { bar: anotherEditor } );

						const secondReference = CKEditorInspector._editorListener;

						expect( firstReference ).to.equal( secondReference );

						return anotherEditor.destroy();
					} );
			} );

			describe( 'change:isReadOnly event', () => {
				it( 'should start listening to the editor#change:isReadOnly event', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = sinon.stub( CKEditorInspector._store, 'dispatch' );

					editor.enableReadOnlyMode( 'Custom Lock' );

					// FYI: Changing read only triggers view#render in the editor.
					sinon.assert.callCount( spy, 2 );
					sinon.assert.calledWithExactly( spy.firstCall, { type: UPDATE_VIEW_STATE } );
					sinon.assert.calledWithExactly( spy.secondCall, { type: UPDATE_CURRENT_EDITOR_IS_READ_ONLY } );

					editor.disableReadOnlyMode( 'Custom Lock' );

					sinon.assert.callCount( spy, 4 );
					sinon.assert.calledWithExactly( spy.thirdCall, { type: UPDATE_VIEW_STATE } );
					sinon.assert.calledWithExactly( spy.getCall( 3 ), { type: UPDATE_CURRENT_EDITOR_IS_READ_ONLY } );

					spy.restore();
				} );

				it( 'should continue listening to the editor#change:isReadOnly event when the inspector is collapsed', () => {
					CKEditorInspector.attach( { foo: editor } );
					dispatchStoreAction( toggleIsCollapsed() );

					const spy = sinon.stub( CKEditorInspector._store, 'dispatch' );

					editor.enableReadOnlyMode( 'Custom Lock' );
					sinon.assert.calledOnce( spy );
					// FYI: UPDATE_VIEW_STATE will not happen when the inspector is collapsed.
					sinon.assert.calledWithExactly( spy.firstCall, { type: UPDATE_CURRENT_EDITOR_IS_READ_ONLY } );

					spy.restore();
				} );

				it( 'should stop listening to the editor#change:isReadOnly event when the inspector is being detached', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = sinon.spy( CKEditorInspector._store, 'dispatch' );

					editor.enableReadOnlyMode( 'Custom Lock' );
					sinon.assert.calledTwice( spy );

					CKEditorInspector.detach( 'foo' );

					editor.disableReadOnlyMode( 'Custom Lock' );

					sinon.assert.callCount( spy, 3 );
					sinon.assert.calledWithExactly( spy.getCall( 2 ), { type: SET_EDITORS, editors: sinon.match.map } );
				} );

				it( 'should stop listening to the editor#change:isReadOnly event when the inspector is being destroyed', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = sinon.spy( CKEditorInspector._store, 'dispatch' );

					editor.enableReadOnlyMode( 'Custom Lock' );
					sinon.assert.calledTwice( spy );

					CKEditorInspector.destroy();

					editor.disableReadOnlyMode( 'Custom Lock' );
					sinon.assert.calledTwice( spy );
				} );
			} );
		} );

		it( 'should add the inspector to DOM only once when attaching to the first editor', () => {
			const anotherEditorElement = document.createElement( 'div' );
			document.body.appendChild( anotherEditorElement );

			return TestEditor.create( anotherEditorElement )
				.then( anotherEditor => {
					CKEditorInspector.attach( { foo: editor } );
					CKEditorInspector.attach( { bar: anotherEditor } );

					expect( document.querySelectorAll( '.ck-inspector-wrapper' ) ).to.be.lengthOf( 1 );
					expect( document.querySelectorAll( '.ck-inspector' ) ).to.be.lengthOf( 1 );

					anotherEditorElement.remove();

					return anotherEditor.destroy();
				} );
		} );

		it( 'should attach to multiple editors under generated editor names', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					const firstNames = CKEditorInspector.attach( editor );
					const secondNames = CKEditorInspector.attach( anotherEditor );
					const state = getStoreState();

					expect( state.editors.get( 'editor-1' ) ).to.equal( editor );
					expect( state.editors.get( 'editor-2' ) ).to.equal( anotherEditor );
					expect( state.currentEditorName ).to.equal( 'editor-1' );

					expect( firstNames ).to.have.members( [ 'editor-1' ] );
					expect( secondNames ).to.have.members( [ 'editor-2' ] );

					return anotherEditor.destroy();
				} );
		} );

		it( 'should attach to a named editor', () => {
			CKEditorInspector.attach( { foo: editor } );

			const state = getStoreState();

			expect( state.editors.get( 'foo' ) ).to.equal( editor );
			expect( state.currentEditorName ).to.equal( 'foo' );
		} );

		it( 'should attach to an editor named like one of core editor properties (used in a duck typing)', () => {
			CKEditorInspector.attach( { model: editor } );
			CKEditorInspector.attach( { editing: editor } );

			const state = getStoreState();

			expect( state.editors.get( 'model' ) ).to.equal( editor );
			expect( state.editors.get( 'editing' ) ).to.equal( editor );
			expect( state.currentEditorName ).to.equal( 'model' );
		} );

		it( 'should attach to multiple editors at a time', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					const names = CKEditorInspector.attach( { foo: editor, bar: anotherEditor } );
					const state = getStoreState();

					expect( state.editors.get( 'foo' ) ).to.equal( editor );
					expect( state.editors.get( 'bar' ) ).to.equal( anotherEditor );
					expect( state.currentEditorName ).to.equal( 'foo' );
					expect( names ).to.have.members( [ 'foo', 'bar' ] );

					return anotherEditor.destroy();
				} );
		} );

		it( 'should support the deprecated syntax but warns', () => {
			CKEditorInspector.attach( 'foo', editor );

			const editors = getStoreState().editors;

			expect( editors.get( 'foo' ) ).to.equal( editor );
			sinon.assert.calledWithMatch( warnStub, /^\[CKEditorInspector\] The CKEditorInspector\.attach/ );
		} );

		it( 'should detach when the editor is destroyed', () => {
			const spy = sinon.spy( CKEditorInspector, 'detach' );

			CKEditorInspector.attach( { bar: editor } );

			return editor.destroy().then( () => {
				const state = getStoreState();

				sinon.assert.calledOnce( spy );
				sinon.assert.calledWith( spy, 'bar' );

				expect( state.editors.size ).to.equal( 0 );
				expect( state.currentEditorName ).to.be.null;
			} );
		} );

		// https://github.com/ckeditor/ckeditor5-inspector/issues/80
		it( 'should update model/view/commands state immediatelly when the inspector UI uncollapses', () => {
			CKEditorInspector.attach( { foo: editor } );

			dispatchStoreAction( toggleIsCollapsed() );

			const spy = sinon.spy( CKEditorInspector._store, 'dispatch' );

			editor.model.document.fire( 'change' );
			sinon.assert.notCalled( spy );

			dispatchStoreAction( toggleIsCollapsed() );

			sinon.assert.callCount( spy, 4 );
			// Note: The 0 call was TOGGLE_IS_COLLAPSED.
			sinon.assert.calledWithExactly( spy.getCall( 1 ), { type: UPDATE_MODEL_STATE } );
			sinon.assert.calledWithExactly( spy.getCall( 2 ), { type: UPDATE_COMMANDS_STATE } );
			sinon.assert.calledWithExactly( spy.getCall( 3 ), { type: UPDATE_VIEW_STATE } );

			spy.restore();
		} );

		describe( 'options', () => {
			describe( '#isCollapsed', () => {
				it( 'should be false if unspecified', () => {
					CKEditorInspector.attach( editor );

					expect( getStoreState().ui.isCollapsed ).to.be.false;
				} );

				it( 'should control the initial collapsed state of the inspector (single editor)', () => {
					CKEditorInspector.attach( editor, { isCollapsed: true } );

					expect( getStoreState().ui.isCollapsed ).to.be.true;
				} );

				it( 'should control the initial collapsed state of the inspector (multiple editors)', () => {
					CKEditorInspector.attach( { foo: editor }, { isCollapsed: true } );

					expect( getStoreState().ui.isCollapsed ).to.be.true;
				} );

				it( 'should override the configuration in the LocalStorage', () => {
					LocalStorageManager.set( LOCAL_STORAGE_IS_COLLAPSED, 'true' );

					CKEditorInspector.attach( { foo: editor }, { isCollapsed: false } );

					expect( getStoreState().ui.isCollapsed ).to.be.false;
				} );
			} );
		} );
	} );

	describe( '#attachToAll()', () => {
		it( 'should attach to all editors in DOM', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					document.body.appendChild( editor.ui.view.element );
					document.body.appendChild( anotherEditor.ui.view.element );

					const editorNames = CKEditorInspector.attachToAll();
					const state = getStoreState();

					expect( state.editors.size ).to.equal( 2 );
					expect( state.editors.get( 'editor-5' ) ).to.equal( editor );
					expect( state.editors.get( 'editor-6' ) ).to.equal( anotherEditor );
					expect( state.currentEditorName ).to.equal( 'editor-5' );

					expect( editorNames ).to.have.members( [ 'editor-5', 'editor-6' ] );

					return anotherEditor.destroy();
				} );
		} );

		it( 'should detect and prevent duplicates', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					document.body.appendChild( editor.ui.view.element );
					document.body.appendChild( anotherEditor.ui.view.element );

					CKEditorInspector.attachToAll();

					let editors = getStoreState().editors;

					expect( editors.size ).to.equal( 2 );
					expect( editors.get( 'editor-7' ) ).to.equal( editor );
					expect( editors.get( 'editor-8' ) ).to.equal( anotherEditor );

					CKEditorInspector.attachToAll();

					editors = getStoreState().editors;

					expect( editors.size ).to.equal( 2 );

					return anotherEditor.destroy();
				} );
		} );

		it( 'should pass the options to #attach()', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					document.body.appendChild( editor.ui.view.element );
					document.body.appendChild( anotherEditor.ui.view.element );

					const spy = sinon.spy( CKEditorInspector, 'attach' );
					const options = { foo: true };
					CKEditorInspector.attachToAll( options );

					sinon.assert.calledWithExactly( spy.firstCall, editor, options );
					sinon.assert.calledWithExactly( spy.secondCall, anotherEditor, options );

					return anotherEditor.destroy();
				} );
		} );
	} );

	describe( '#detach()', () => {
		it( 'should detach an editor', () => {
			CKEditorInspector.attach( { foo: editor } );

			let state = getStoreState();

			expect( state.editors.get( 'foo' ) ).to.equal( editor );
			expect( state.currentEditorName ).to.equal( 'foo' );

			CKEditorInspector.detach( 'foo' );

			state = getStoreState();

			expect( state.editors.size ).to.equal( 0 );
			expect( state.currentEditorName ).to.be.null;
		} );

		it( 'should not throw if executed multiple times', () => {
			CKEditorInspector.attach( { foo: editor } );

			expect( () => {
				CKEditorInspector.detach( 'foo' );
				CKEditorInspector.detach( 'foo' );
			} ).to.not.throw();
		} );
	} );

	describe( '#destroy()', () => {
		it( 'should destroy the entire inspector application', () => {
			CKEditorInspector.attach( { foo: editor } );
			CKEditorInspector.destroy();

			expect( document.querySelector( '.ck-inspector-wrapper' ) ).to.be.null;
			expect( CKEditorInspector._editors.size ).to.equal( 0 );
			expect( CKEditorInspector._wrapper ).to.be.null;
			expect( CKEditorInspector._store ).to.be.null;
		} );
	} );
} );
