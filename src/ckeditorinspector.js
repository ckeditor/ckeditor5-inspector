/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window, CKEDITOR_INSPECTOR_VERSION */

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './data/reducer';
import { setEditors } from './data/actions';

import InspectorUI from './ui';
import Logger from './logger';
import LocalStorageManager from './localstoragemanager';
import { normalizeArguments, getFirstEditorName } from './utils';
import './ckeditorinspector.css';

// From changelog -> webpack.
window.CKEDITOR_INSPECTOR_VERSION = CKEDITOR_INSPECTOR_VERSION;

const LOCAL_STORAGE_ACTIVE_TAB = 'active-tab-name';
const LOCAL_STORAGE_IS_COLLAPSED = 'is-collapsed';
const LOCAL_STORAGE_INSPECTOR_HEIGHT = 'height';

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
		CKEditorInspector._wrapper = null;
	}

	static _updateEditorsState() {
		CKEditorInspector._store.dispatch( setEditors( CKEditorInspector._editors ) );
	}

	static _mount( options ) {
		if ( CKEditorInspector._wrapper ) {
			return;
		}

		const container = CKEditorInspector._wrapper = document.createElement( 'div' );
		container.className = 'ck-inspector-wrapper';
		document.body.appendChild( container );

		CKEditorInspector._store = createStore( reducer, {
			editors: CKEditorInspector._editors,
			currentEditorName: getFirstEditorName( CKEditorInspector._editors ),
			activeTab: LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Model',
			isCollapsed: options.isCollapsed || LocalStorageManager.get( LOCAL_STORAGE_IS_COLLAPSED ) === 'true',
			height: LocalStorageManager.get( LOCAL_STORAGE_INSPECTOR_HEIGHT ) || '400px'
		} );

		ReactDOM.render(
			<Provider store={CKEditorInspector._store}>
				<InspectorUI />
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
