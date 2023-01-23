/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window, CKEDITOR_INSPECTOR_VERSION */

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { reducer } from './data/reducer';
import {
	setEditors,
	updateCurrentEditorIsReadOnly
} from './data/actions';
import { updateModelState } from './model/data/actions';
import { updateViewState } from './view/data/actions';
import { updateCommandsState } from './commands/data/actions';
import EditorListener from './data/utils';

import CKEditorInspectorUI from './ckeditorinspectorui';
import Logger from './logger';
import {
	normalizeArguments,
	getFirstEditorName
} from './utils';
import './ckeditorinspector.css';

// From changelog -> webpack.
window.CKEDITOR_INSPECTOR_VERSION = CKEDITOR_INSPECTOR_VERSION;

export default class CKEditorInspector {
	constructor() {
		Logger.warn(
			'[CKEditorInspector] Whoops! Looks like you tried to create an instance of the CKEditorInspector class. ' +
			'To attach the inspector, use the static CKEditorInspector.attach( editor ) method instead. ' +
			'For the latest API, please refer to https://github.com/ckeditor/ckeditor5-inspector/blob/master/README.md. '
		);
	}

	/**
	 * Attaches the inspector to an editor instance.
	 *
	 *		ClassicEditor
	 *			.create( ... )
	 *			.then( editor => {
	 *				CKEditorInspector.attach( editor );
	 *			} )
	 *			.catch( error => {
	 *				console.error( error );
	 *			} );
	 *
	 * **Note:** You can attach to multiple editors at a time under unique names:
	 *
	 *		CKEditorInspector.attach( {
	 *			'header-editor': editor1,
	 *			'footer-editor': editor2,
	 *			// ...
	 *		} );
	 *
	 * **Note:** You can pass global configuration options when attaching:
	 *
	 *		CKEditorInspector.attach( editor, { option: 'value', ... } );
	 *		CKEditorInspector.attach( {
	 *			'header-editor': editor1,
	 *			'footer-editor': editor2
	 *		}, { option: 'value', ... } );
	 *
	 * @param {Editor|Object} editorOrEditors If an editor instance is passed, the inspect will attach to the editor
	 * with an auto–generated name. It is possible to pass an object with `name: instance` pairs to attach to
	 * multiple editors at a time with unique names.
	 * @param {CKEditorInspectorConfig} [options] An object of global configuration options controlling the
	 * behavior of the inspector.
	 * @returns {Array.<String>} Names of the editors the inspector attached to. Useful when using `CKEditorInspector.detach()`
	 * with generated editor names.
	 */
	static attach( ...args ) {
		const { CKEDITOR_VERSION } = window;

		if ( CKEDITOR_VERSION ) {
			const [ major ] = CKEDITOR_VERSION.split( '.' ).map( Number );

			if ( major < 34 ) {
				Logger.warn(
					'[CKEditorInspector] The inspector requires using CKEditor 5 in version 34 or higher. ' +
					'If you cannot update CKEditor 5, consider downgrading the major version of the inspector to version 3.'
				);
			}
		} else {
			Logger.warn(
				'[CKEditorInspector] Could not determine a version of CKEditor 5. Some of the functionalities may not work as expected.'
			);
		}

		const { editors, options } = normalizeArguments( args );

		for ( const editorName in editors ) {
			const editorInstance = editors[ editorName ];

			Logger.group( '%cAttached the inspector to a CKEditor 5 instance. To learn more, visit https://ckeditor.com/docs/ckeditor5.',
				'font-weight: bold;' );
			Logger.log( `Editor instance "${ editorName }"`, editorInstance );
			Logger.groupEnd();

			CKEditorInspector._editors.set( editorName, editorInstance );

			editorInstance.on( 'destroy', () => {
				CKEditorInspector.detach( editorName );
			} );

			CKEditorInspector._mount( options );
			CKEditorInspector._updateEditorsState();
		}

		return Object.keys( editors );
	}

	/**
	 * Attaches the inspector to all CKEditor instances discovered in DOM.
	 *
	 * Editor instances are named `editor-1`, `editor-2`, etc..
	 *
	 * **Note:** This method requires CKEditor 12.3.0 or later.
	 *
	 * **Note:** You can pass global configuration options when attaching:
	 *
	 *		CKEditorInspector.attachToAll( { option: 'value', ... } );
	 *
	 * @param {CKEditorInspectorConfig} [options] An object of global configuration options controlling the
	 * behavior of the inspector.
	 * @returns {Array.<String>} Names of the editors the inspector attached to. Useful when using `CKEditorInspector.detach()`
	 * with generated editor names.
	 */
	static attachToAll( options ) {
		const domEditables = document.querySelectorAll( '.ck.ck-content.ck-editor__editable' );
		const attachedEditorNames = [];

		for ( const domEditable of domEditables ) {
			const editor = domEditable.ckeditorInstance;

			if ( editor && !CKEditorInspector._isAttachedTo( editor ) ) {
				attachedEditorNames.push( ...CKEditorInspector.attach( editor, options ) );
			}
		}

		return attachedEditorNames;
	}

	/**
	 * Detaches the inspector from an editor instance.
	 *
	 *		CKEditorInspector.attach( { 'my-editor': editor } );
	 *
	 *		// The inspector will no longer inspect the "editor".
	 *		CKEditorInspector.detach( 'my-editor' );
	 *
	 * @param {String} string Name of the editor to detach.
	 */
	static detach( name ) {
		if ( !CKEditorInspector._wrapper ) {
			return;
		}

		CKEditorInspector._editors.delete( name );
		CKEditorInspector._updateEditorsState();
	}

	/**
	 * Destroys the entire inspector application and removes it from DOM.
	 */
	static destroy() {
		if ( !CKEditorInspector._wrapper ) {
			return;
		}

		ReactDOM.unmountComponentAtNode( CKEditorInspector._wrapper );
		CKEditorInspector._editors.clear();
		CKEditorInspector._wrapper.remove();

		const state = CKEditorInspector._store.getState();
		const currentEditor = state.editors.get( state.currentEditorName );

		if ( currentEditor ) {
			CKEditorInspector._editorListener.stopListening( currentEditor );
		}

		CKEditorInspector._editorListener = null;
		CKEditorInspector._wrapper = null;
		CKEditorInspector._store = null;
	}

	static _updateEditorsState() {
		CKEditorInspector._store.dispatch( setEditors( CKEditorInspector._editors ) );
	}

	static _mount( options ) {
		if ( CKEditorInspector._wrapper ) {
			return;
		}

		const container = CKEditorInspector._wrapper = document.createElement( 'div' );
		let previousEditor;
		let wasUICollapsed;

		container.className = 'ck-inspector-wrapper';
		document.body.appendChild( container );

		// Create a listener that will trigger the store action when the model
		// is changing or the view is being rendered.
		CKEditorInspector._editorListener = new EditorListener( {
			onModelChange() {
				const store = CKEditorInspector._store;
				const isUICollapsed = store.getState().ui.isCollapsed;

				// Don't update the model and commands state if the entire inspector is collapsed.
				// See https://github.com/ckeditor/ckeditor5-inspector/issues/80.
				if ( isUICollapsed ) {
					return;
				}

				store.dispatch( updateModelState() );
				store.dispatch( updateCommandsState() );
			},
			onViewRender() {
				const store = CKEditorInspector._store;
				const isUICollapsed = store.getState().ui.isCollapsed;

				// Don't update the view state if the entire inspector is collapsed.
				// See https://github.com/ckeditor/ckeditor5-inspector/issues/80.
				if ( isUICollapsed ) {
					return;
				}

				store.dispatch( updateViewState() );
			},
			onReadOnlyChange() {
				CKEditorInspector._store.dispatch( updateCurrentEditorIsReadOnly() );
			}
		} );

		// Create a global Redux store for the entire application. The store is extended by model, view and
		// commands reducers. See the reducer() function to learn more.
		CKEditorInspector._store = createStore( reducer, {
			editors: CKEditorInspector._editors,
			currentEditorName: getFirstEditorName( CKEditorInspector._editors ),
			currentEditorGlobals: {},
			ui: {
				isCollapsed: options.isCollapsed
			}
		} );

		// Watch for changes of the current editor in the global store, and update the
		// EditorListener accordingly. This ensures the EditorListener instance listens
		// to events from the current editor only (but not the previous one).
		CKEditorInspector._store.subscribe( () => {
			const state = CKEditorInspector._store.getState();
			const currentEditor = state.editors.get( state.currentEditorName );

			// Either going from
			// * no editor to a new editor
			// * from one editor to another,
			// * from one editor to no editor,
			if ( previousEditor !== currentEditor ) {
				// If there was no editor before, there's nothing to stop listening to.
				if ( previousEditor ) {
					CKEditorInspector._editorListener.stopListening( previousEditor );
				}

				// If going from one editor to no editor, there's nothing to start listening to.
				if ( currentEditor ) {
					CKEditorInspector._editorListener.startListening( currentEditor );
				}

				previousEditor = currentEditor;
			}
		} );

		// Watch for changes of the current editor in the global store, and update the
		// model/view/commands state when the UI uncollapses. Normally, when the inspector
		// is collapsed, it does not respond to changes in the model/view/commands to improve
		// the performance and DX. See https://github.com/ckeditor/ckeditor5-inspector/issues/80.
		CKEditorInspector._store.subscribe( () => {
			const store = CKEditorInspector._store;
			const isUICollapsed = store.getState().ui.isCollapsed;
			const hasUIUncollapsed = wasUICollapsed && !isUICollapsed;

			wasUICollapsed = isUICollapsed;

			if ( hasUIUncollapsed ) {
				store.dispatch( updateModelState() );
				store.dispatch( updateCommandsState() );
				store.dispatch( updateViewState() );
			}
		} );

		ReactDOM.render(
			<Provider store={CKEditorInspector._store}>
				<CKEditorInspectorUI />
			</Provider>,
			container
		);
	}

	static _isAttachedTo( editor ) {
		return [ ...CKEditorInspector._editors.values() ].includes( editor );
	}
}

CKEditorInspector._editors = new Map();
CKEditorInspector._wrapper = null;

/**
 * The configuration options of the inspector.
 *
 * @interface CKEditorInspectorConfig
 */

/**
 * Controls the initial collapsed state of the inspector. Allows attaching to an editor instance without
 * expanding the UI.
 *
 * **Note**: Works when `attach()` is called for the first time only.
 *
 * @member {Boolean} CKEditorInspectorConfig#isCollapsed
 */
