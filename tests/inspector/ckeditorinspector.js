/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

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
		vi.spyOn( Logger, 'log' ).mockImplementation( () => {} );
		warnStub = vi.spyOn( Logger, 'warn' ).mockImplementation( () => {} );

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;
		} );
	} );

	afterEach( () => {
		element.remove();

		CKEditorInspector.destroy();

		return editor.destroy();
	} );

	describe( 'CKEDITOR_INSPECTOR_VERSION', () => {
		it( 'should be set', () => {
			expect( typeof window.CKEDITOR_INSPECTOR_VERSION ).toBe( 'string' );
		} );
	} );

	it( 'should warn if called the constructor()', () => {
		// eslint-disable-next-line no-unused-vars
		const inspector = new CKEditorInspector();

		expect( warnStub ).toHaveBeenCalledWith( expect.stringMatching(
			/\[CKEditorInspector\] Whoops! Looks like you tried to create an instance of the CKEditorInspector class\./
		) );
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

			expect( warnStub ).toHaveBeenCalledWith( expect.stringMatching(
				/^\[CKEditorInspector\] The inspector requires using CKEditor 5 in version 34 or higher\./
			) );
		} );

		it( 'should not warn if using CKEditor 5 in version 34', () => {
			window.CKEDITOR_VERSION = '34.0.0';

			CKEditorInspector.attach( { foo: editor } );

			expect( warnStub ).not.toHaveBeenCalled();
		} );

		it( 'should warn if cannot determine a version of CKEditor 5', () => {
			delete window.CKEDITOR_VERSION;

			CKEditorInspector.attach( { foo: editor } );

			expect( warnStub ).toHaveBeenCalledWith( expect.stringMatching(
				/^\[CKEditorInspector\] Could not determine a version of CKEditor 5. Some of the functionalities may not work as expected\./
			) );
		} );

		it( 'should add the inspector to DOM', () => {
			expect( document.querySelector( '.ck-inspector-wrapper' ) ).toBeNull();
			expect( CKEditorInspector._wrapper ).toBeNull();

			CKEditorInspector.attach( { foo: editor } );

			expect( CKEditorInspector._wrapper ).toBeInstanceOf( HTMLElement );

			const wrapper = CKEditorInspector._wrapper;

			expect( wrapper.tagName.toLowerCase() ).toBe( 'div' );
			expect( wrapper.parentNode ).toBe( document.body );
			expect( wrapper.childNodes ).toHaveLength( 1 );
			expect( wrapper.firstChild.classList.contains( 'ck-inspector' ) ).toBe( true );
		} );

		describe( 'redux #_store', () => {
			it( 'should be created with the first editor', () => {
				CKEditorInspector.attach( { foo: editor } );

				const state = getStoreState();

				expect( state.editors.get( 'foo' ) ).toBe( CKEditorInspector._editors.get( 'foo' ) );
				expect( state.currentEditorName ).toBe( 'foo' );
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

						expect( firstReference ).toBe( secondReference );

						return anotherEditor.destroy();
					} );
			} );
		} );

		describe( '#_editorListener', () => {
			describe( 'document#change and view#render events', () => {
				it( 'should start listening to the document#change and view#render events', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = vi.spyOn( CKEditorInspector._store, 'dispatch' ).mockImplementation( () => {} );

					editor.model.document.fire( 'change' );

					expect( spy ).toHaveBeenCalledTimes( 3 );
					expect( spy ).toHaveBeenNthCalledWith( 1, { type: UPDATE_MODEL_STATE } );
					expect( spy ).toHaveBeenNthCalledWith( 2, { type: UPDATE_COMMANDS_STATE } );

					// After model->view conversion.
					expect( spy ).toHaveBeenNthCalledWith( 3, { type: UPDATE_VIEW_STATE } );

					editor.editing.view.fire( 'render' );
					expect( spy ).toHaveBeenCalledTimes( 4 );
					expect( spy ).toHaveBeenNthCalledWith( 4, { type: UPDATE_VIEW_STATE } );

					spy.mockRestore();
				} );

				// https://github.com/ckeditor/ckeditor5-inspector/issues/80
				it( 'should not respond to the document#change and view#render events when the inspector UI is collapsed', () => {
					CKEditorInspector.attach( { foo: editor } );
					dispatchStoreAction( toggleIsCollapsed() );

					const spy = vi.spyOn( CKEditorInspector._store, 'dispatch' ).mockImplementation( () => {} );

					editor.model.document.fire( 'change' );
					expect( spy ).not.toHaveBeenCalled();

					spy.mockRestore();
				} );

				it( 'should stop listening to the document#change and view#render events when the inspector is being detached', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = vi.spyOn( CKEditorInspector._store, 'dispatch' );

					editor.model.document.fire( 'change' );
					expect( spy ).toHaveBeenCalledTimes( 3 );

					CKEditorInspector.detach( 'foo' );

					editor.model.document.fire( 'change' );

					expect( spy ).toHaveBeenCalledTimes( 4 );
					expect( spy ).toHaveBeenNthCalledWith( 4, { type: SET_EDITORS, editors: expect.any( Map ) } );
				} );

				it( 'should stop listening to the document#change and view#render events when the inspector is being destroyed', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = vi.spyOn( CKEditorInspector._store, 'dispatch' );

					editor.model.document.fire( 'change' );
					expect( spy ).toHaveBeenCalledTimes( 3 );

					CKEditorInspector.destroy();

					editor.model.document.fire( 'change' );
					expect( spy ).toHaveBeenCalledTimes( 3 );
				} );
			} );

			it( 'should stop listening to the previous one and start listening to the one when switching editors', () => {
				const anotherEditorElement = document.createElement( 'div' );
				document.body.appendChild( anotherEditorElement );

				return TestEditor.create( anotherEditorElement )
					.then( anotherEditor => {
						CKEditorInspector.attach( { foo: editor, bar: anotherEditor } );

						const spy = vi.spyOn( CKEditorInspector._store, 'dispatch' );

						editor.model.document.fire( 'change' );
						expect( spy ).toHaveBeenCalledTimes( 3 );

						dispatchStoreAction( setCurrentEditorName( 'bar' ) );
						spy.mockClear();

						editor.model.document.fire( 'change' );
						expect( spy ).not.toHaveBeenCalled();

						anotherEditor.model.document.fire( 'change' );
						expect( spy ).toHaveBeenCalledTimes( 3 );

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

						expect( firstReference ).toBe( secondReference );

						return anotherEditor.destroy();
					} );
			} );

			describe( 'change:isReadOnly event', () => {
				it( 'should start listening to the editor#change:isReadOnly event', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = vi.spyOn( CKEditorInspector._store, 'dispatch' ).mockImplementation( () => {} );

					editor.enableReadOnlyMode( 'Custom Lock' );

					// FYI: Changing read only triggers view#render in the editor.
					expect( spy ).toHaveBeenCalledTimes( 2 );
					expect( spy ).toHaveBeenNthCalledWith( 1, { type: UPDATE_VIEW_STATE } );
					expect( spy ).toHaveBeenNthCalledWith( 2, { type: UPDATE_CURRENT_EDITOR_IS_READ_ONLY } );

					editor.disableReadOnlyMode( 'Custom Lock' );

					expect( spy ).toHaveBeenCalledTimes( 4 );
					expect( spy ).toHaveBeenNthCalledWith( 3, { type: UPDATE_VIEW_STATE } );
					expect( spy ).toHaveBeenNthCalledWith( 4, { type: UPDATE_CURRENT_EDITOR_IS_READ_ONLY } );

					spy.mockRestore();
				} );

				it( 'should continue listening to the editor#change:isReadOnly event when the inspector is collapsed', () => {
					CKEditorInspector.attach( { foo: editor } );
					dispatchStoreAction( toggleIsCollapsed() );

					const spy = vi.spyOn( CKEditorInspector._store, 'dispatch' ).mockImplementation( () => {} );

					editor.enableReadOnlyMode( 'Custom Lock' );
					expect( spy ).toHaveBeenCalledTimes( 1 );
					// FYI: UPDATE_VIEW_STATE will not happen when the inspector is collapsed.
					expect( spy ).toHaveBeenCalledWith( { type: UPDATE_CURRENT_EDITOR_IS_READ_ONLY } );

					spy.mockRestore();
				} );

				it( 'should stop listening to the editor#change:isReadOnly event when the inspector is being detached', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = vi.spyOn( CKEditorInspector._store, 'dispatch' );

					editor.enableReadOnlyMode( 'Custom Lock' );
					expect( spy ).toHaveBeenCalledTimes( 2 );

					CKEditorInspector.detach( 'foo' );

					editor.disableReadOnlyMode( 'Custom Lock' );

					expect( spy ).toHaveBeenCalledTimes( 3 );
					expect( spy ).toHaveBeenNthCalledWith( 3, { type: SET_EDITORS, editors: expect.any( Map ) } );
				} );

				it( 'should stop listening to the editor#change:isReadOnly event when the inspector is being destroyed', () => {
					CKEditorInspector.attach( { foo: editor } );

					const spy = vi.spyOn( CKEditorInspector._store, 'dispatch' );

					editor.enableReadOnlyMode( 'Custom Lock' );
					expect( spy ).toHaveBeenCalledTimes( 2 );

					CKEditorInspector.destroy();

					editor.disableReadOnlyMode( 'Custom Lock' );
					expect( spy ).toHaveBeenCalledTimes( 2 );
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

					expect( document.querySelectorAll( '.ck-inspector-wrapper' ) ).toHaveLength( 1 );
					expect( document.querySelectorAll( '.ck-inspector' ) ).toHaveLength( 1 );

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

					expect( state.editors.get( 'editor-1' ) ).toBe( editor );
					expect( state.editors.get( 'editor-2' ) ).toBe( anotherEditor );
					expect( state.currentEditorName ).toBe( 'editor-1' );

					expect( firstNames ).toEqual( [ 'editor-1' ] );
					expect( secondNames ).toEqual( [ 'editor-2' ] );

					return anotherEditor.destroy();
				} );
		} );

		it( 'should attach to a named editor', () => {
			CKEditorInspector.attach( { foo: editor } );

			const state = getStoreState();

			expect( state.editors.get( 'foo' ) ).toBe( editor );
			expect( state.currentEditorName ).toBe( 'foo' );
		} );

		it( 'should attach to an editor named like one of core editor properties (used in a duck typing)', () => {
			CKEditorInspector.attach( { model: editor } );
			CKEditorInspector.attach( { editing: editor } );

			const state = getStoreState();

			expect( state.editors.get( 'model' ) ).toBe( editor );
			expect( state.editors.get( 'editing' ) ).toBe( editor );
			expect( state.currentEditorName ).toBe( 'model' );
		} );

		it( 'should attach to multiple editors at a time', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					const names = CKEditorInspector.attach( { foo: editor, bar: anotherEditor } );
					const state = getStoreState();

					expect( state.editors.get( 'foo' ) ).toBe( editor );
					expect( state.editors.get( 'bar' ) ).toBe( anotherEditor );
					expect( state.currentEditorName ).toBe( 'foo' );
					expect( names ).toEqual( expect.arrayContaining( [ 'foo', 'bar' ] ) );
					expect( names ).toHaveLength( 2 );

					return anotherEditor.destroy();
				} );
		} );

		it( 'should support the deprecated syntax but warns', () => {
			CKEditorInspector.attach( 'foo', editor );

			const editors = getStoreState().editors;

			expect( editors.get( 'foo' ) ).toBe( editor );
			expect( warnStub ).toHaveBeenCalledWith( expect.stringMatching( /^\[CKEditorInspector\] The CKEditorInspector\.attach/ ) );
		} );

		it( 'should detach when the editor is destroyed', () => {
			const spy = vi.spyOn( CKEditorInspector, 'detach' );

			CKEditorInspector.attach( { bar: editor } );

			return editor.destroy().then( () => {
				const state = getStoreState();

				expect( spy ).toHaveBeenCalledTimes( 1 );
				expect( spy ).toHaveBeenCalledWith( 'bar' );

				expect( state.editors.size ).toBe( 0 );
				expect( state.currentEditorName ).toBeNull();
			} );
		} );

		// https://github.com/ckeditor/ckeditor5-inspector/issues/80
		it( 'should update model/view/commands state immediatelly when the inspector UI uncollapses', () => {
			CKEditorInspector.attach( { foo: editor } );

			dispatchStoreAction( toggleIsCollapsed() );

			const spy = vi.spyOn( CKEditorInspector._store, 'dispatch' );

			editor.model.document.fire( 'change' );
			expect( spy ).not.toHaveBeenCalled();

			dispatchStoreAction( toggleIsCollapsed() );

			expect( spy ).toHaveBeenCalledTimes( 4 );
			// Note: The 0 call was TOGGLE_IS_COLLAPSED.
			expect( spy ).toHaveBeenNthCalledWith( 2, { type: UPDATE_MODEL_STATE } );
			expect( spy ).toHaveBeenNthCalledWith( 3, { type: UPDATE_COMMANDS_STATE } );
			expect( spy ).toHaveBeenNthCalledWith( 4, { type: UPDATE_VIEW_STATE } );

			spy.mockRestore();
		} );

		describe( 'options', () => {
			describe( '#isCollapsed', () => {
				it( 'should be false if unspecified', () => {
					CKEditorInspector.attach( editor );

					expect( getStoreState().ui.isCollapsed ).toBe( false );
				} );

				it( 'should control the initial collapsed state of the inspector (single editor)', () => {
					CKEditorInspector.attach( editor, { isCollapsed: true } );

					expect( getStoreState().ui.isCollapsed ).toBe( true );
				} );

				it( 'should control the initial collapsed state of the inspector (multiple editors)', () => {
					CKEditorInspector.attach( { foo: editor }, { isCollapsed: true } );

					expect( getStoreState().ui.isCollapsed ).toBe( true );
				} );

				it( 'should override the configuration in the LocalStorage', () => {
					LocalStorageManager.set( LOCAL_STORAGE_IS_COLLAPSED, 'true' );

					CKEditorInspector.attach( { foo: editor }, { isCollapsed: false } );

					expect( getStoreState().ui.isCollapsed ).toBe( false );
				} );
			} );

			describe( '#container', () => {
				let customContainer;

				beforeEach( () => {
					customContainer = document.createElement( 'div' );
					document.body.appendChild( customContainer );
				} );

				afterEach( () => {
					customContainer.remove();
				} );

				it( 'should mount the inspector wrapper inside the provided container instead of document.body', () => {
					CKEditorInspector.attach( editor, { container: customContainer } );

					const wrapper = CKEditorInspector._wrapper;

					expect( wrapper ).toBeInstanceOf( HTMLElement );
					expect( wrapper.parentNode ).toBe( customContainer );
					expect( wrapper.parentNode ).not.toBe( document.body );
				} );

				it( 'should render the inspector UI inside the provided container', () => {
					CKEditorInspector.attach( editor, { container: customContainer } );

					expect( customContainer.querySelector( '.ck-inspector' ) ).not.toBeNull();
					expect( CKEditorInspector._wrapper.parentNode ).not.toBe( document.body );
				} );

				it( 'should create the wrapper element using ownerDocument of the provided container', () => {
					CKEditorInspector.attach( editor, { container: customContainer } );

					const wrapper = CKEditorInspector._wrapper;

					expect( wrapper.ownerDocument ).toBe( customContainer.ownerDocument );
				} );

				it( 'should work the same as default when container is document.body', () => {
					CKEditorInspector.attach( editor, { container: document.body } );

					const wrapper = CKEditorInspector._wrapper;

					expect( wrapper.parentNode ).toBe( document.body );
					expect( wrapper.firstChild.classList.contains( 'ck-inspector' ) ).toBe( true );
				} );

				it( 'should not mount a second wrapper when attaching a second editor with a different container', async () => {
					const anotherContainer = document.createElement( 'div' );
					document.body.appendChild( anotherContainer );

					CKEditorInspector.attach( editor, { container: customContainer } );

					const firstWrapper = CKEditorInspector._wrapper;
					const anotherEditor = await TestEditor.create( element );

					CKEditorInspector.attach( anotherEditor, { container: anotherContainer } );

					expect( CKEditorInspector._wrapper ).toBe( firstWrapper );
					expect( document.querySelectorAll( '.ck-inspector-wrapper' ) ).toHaveLength( 1 );

					anotherContainer.remove();

					await anotherEditor.destroy();
				} );

				it( 'should still function correctly (attach/detach/destroy) when using a custom container', () => {
					CKEditorInspector.attach( { foo: editor }, { container: customContainer } );

					let state = getStoreState();

					expect( state.editors.get( 'foo' ) ).toBe( editor );

					CKEditorInspector.detach( 'foo' );

					state = getStoreState();

					expect( state.editors.size ).toBe( 0 );

					CKEditorInspector.destroy();

					expect( CKEditorInspector._wrapper ).toBeNull();
					expect( customContainer.querySelector( '.ck-inspector-wrapper' ) ).toBeNull();
				} );

				it( 'should accept the container option passed with named editors', () => {
					CKEditorInspector.attach( { foo: editor }, { container: customContainer } );

					expect( CKEditorInspector._wrapper.parentNode ).toBe( customContainer );
				} );
			} );

			describe( '#container in a cross-document environment', () => {
				let iframe, hostDocument, hostWindow, hostContainer, outerMarkerStyle;

				beforeEach( () => {
					// A same-origin iframe gives us a real, distinct document/window pair
					// that mirrors a multi-window setup (Electron BrowserWindow, WebView2
					// popup, iframe) — the case the fix is meant to cover.
					iframe = document.createElement( 'iframe' );
					document.body.appendChild( iframe );

					hostDocument = iframe.contentDocument;
					hostWindow = iframe.contentWindow;

					hostContainer = hostDocument.createElement( 'div' );
					hostDocument.body.appendChild( hostContainer );

					// Simulate an inspector-related <style> tag living in the module
					// realm (as happens when the bundler injects CSS at import time).
					// The mount logic is expected to clone it into the host document.
					outerMarkerStyle = document.createElement( 'style' );
					outerMarkerStyle.textContent = '.ck-inspector-cross-doc-marker { color: red; }';
					document.head.appendChild( outerMarkerStyle );
				} );

				afterEach( () => {
					outerMarkerStyle.remove();
					iframe.remove();
				} );

				it( 'should create the wrapper element in the host document', () => {
					CKEditorInspector.attach( editor, { container: hostContainer } );

					expect( CKEditorInspector._wrapper.ownerDocument ).toBe( hostDocument );
					expect( CKEditorInspector._wrapper.ownerDocument ).not.toBe( document );
				} );

				it( 'should render the inspector UI into the host document only', () => {
					CKEditorInspector.attach( editor, { container: hostContainer } );

					expect( hostDocument.querySelector( '.ck-inspector' ) ).not.toBeNull();
					expect( document.body.querySelector( '.ck-inspector' ) ).toBeNull();
				} );

				it( 'should clone inspector-related <style> tags into the host document <head>', () => {
					CKEditorInspector.attach( editor, { container: hostContainer } );

					const clones = hostDocument.head.querySelectorAll( 'style[data-ck-inspector-clone="true"]' );

					expect( clones.length ).toBeGreaterThan( 0 );

					const markerClone = [ ...clones ].find( c => c.textContent.includes( '.ck-inspector-cross-doc-marker' ) );

					expect( markerClone ).toBeDefined();
					expect( markerClone.textContent ).toContain( 'color: red' );
				} );

				it( 'should not clone <style> tags when the container is in the module document', () => {
					CKEditorInspector.attach( editor, { container: document.body } );

					const clones = document.head.querySelectorAll( 'style[data-ck-inspector-clone="true"]' );

					expect( clones.length ).toBe( 0 );
				} );

				it( 'should toggle body classes on the host document, not the module document', () => {
					CKEditorInspector.attach( editor, { container: hostContainer } );

					const hasHostClass =
						hostDocument.body.classList.contains( 'ck-inspector-body-expanded' ) ||
						hostDocument.body.classList.contains( 'ck-inspector-body-collapsed' );

					expect( hasHostClass ).toBe( true );
					expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).toBe( false );
					expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).toBe( false );
				} );

				it( 'should bind the Alt+F12 shortcut to the host window', () => {
					CKEditorInspector.attach( editor, { container: hostContainer } );

					const before = getStoreState().ui.isCollapsed;

					// Dispatch the shortcut on the host window; the outer window
					// listener (if any lingered) must not receive it.
					const event = new hostWindow.KeyboardEvent( 'keydown', {
						key: 'F12',
						altKey: true,
						bubbles: true
					} );
					hostWindow.dispatchEvent( event );

					expect( getStoreState().ui.isCollapsed ).toBe( !before );
				} );

				it( 'should remove cloned <style> tags on destroy()', () => {
					CKEditorInspector.attach( editor, { container: hostContainer } );

					expect(
						hostDocument.head.querySelectorAll( 'style[data-ck-inspector-clone="true"]' ).length
					).toBeGreaterThan( 0 );

					CKEditorInspector.destroy();

					expect(
						hostDocument.head.querySelectorAll( 'style[data-ck-inspector-clone="true"]' ).length
					).toBe( 0 );
				} );

				it( 'should clean up host document body classes on destroy()', () => {
					CKEditorInspector.attach( editor, { container: hostContainer } );

					CKEditorInspector.destroy();

					expect( hostDocument.body.classList.contains( 'ck-inspector-body-expanded' ) ).toBe( false );
					expect( hostDocument.body.classList.contains( 'ck-inspector-body-collapsed' ) ).toBe( false );
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
					const attachedEditors = editorNames.map( name => state.editors.get( name ) );

					expect( attachedEditors ).toEqual( expect.arrayContaining( [ editor, anotherEditor ] ) );
					expect( editorNames ).toEqual( expect.arrayContaining( [ state.currentEditorName ] ) );

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
					const initialEditorCount = editors.size;

					expect( [ ...editors.values() ] ).toEqual( expect.arrayContaining( [ editor, anotherEditor ] ) );

					CKEditorInspector.attachToAll();

					editors = getStoreState().editors;

					expect( editors.size ).toBe( initialEditorCount );

					return anotherEditor.destroy();
				} );
		} );

		it( 'should pass the options to #attach()', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					document.body.appendChild( editor.ui.view.element );
					document.body.appendChild( anotherEditor.ui.view.element );

					const spy = vi.spyOn( CKEditorInspector, 'attach' );
					const options = { foo: true };
					CKEditorInspector.attachToAll( options );

					expect( spy ).toHaveBeenCalledWith( editor, options );
					expect( spy ).toHaveBeenCalledWith( anotherEditor, options );

					return anotherEditor.destroy();
				} );
		} );
	} );

	describe( '#detach()', () => {
		it( 'should detach an editor', () => {
			CKEditorInspector.attach( { foo: editor } );

			let state = getStoreState();

			expect( state.editors.get( 'foo' ) ).toBe( editor );
			expect( state.currentEditorName ).toBe( 'foo' );

			CKEditorInspector.detach( 'foo' );

			state = getStoreState();

			expect( state.editors.size ).toBe( 0 );
			expect( state.currentEditorName ).toBeNull();
		} );

		it( 'should not throw if executed multiple times', () => {
			CKEditorInspector.attach( { foo: editor } );

			expect( () => {
				CKEditorInspector.detach( 'foo' );
				CKEditorInspector.detach( 'foo' );
			} ).not.toThrow();
		} );
	} );

	describe( '#destroy()', () => {
		it( 'should destroy the entire inspector application', () => {
			CKEditorInspector.attach( { foo: editor } );
			CKEditorInspector.destroy();

			expect( document.querySelector( '.ck-inspector-wrapper' ) ).toBeNull();
			expect( CKEditorInspector._editors.size ).toBe( 0 );
			expect( CKEditorInspector._wrapper ).toBeNull();
			expect( CKEditorInspector._store ).toBeNull();
		} );
	} );
} );
