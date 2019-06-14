/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window, CKEDITOR_INSPECTOR_VERSION */

import React from 'react';
import ReactDOM from 'react-dom';

import InspectorUI from './components/ui';
import Logger from './logger';
import { normalizeArguments } from './utils';
import './ckeditorinspector.css';

// From changelog -> webpack.
window.CKEDITOR_INSPECTOR_VERSION = CKEDITOR_INSPECTOR_VERSION;

export default class CKEditorInspector {
	/**
	 * Attaches the inspector to an editor instance.
	 *
	 *		ClassicEditor
	 *			.create( ... )
	 *			.then( editor => {
	 *				CKEditorInspector.attach( editor );
	 *
	 *				// Alternatively:
	 *				// CKEditorInspector.attach( 'my-editor', editor );
	 *			} )
	 *			.catch( error => {
	 *				console.error( error );
	 *			} );
	 *
	 * **Note:** You can pass configuration options when attaching:
	 *
	 *		CKEditorInspector.attach( editor, { ... } );
	 *		CKEditorInspector.attach( 'my-editor', editor, { ... } );
	 *
	 * @param {Editor|String} editorOrName When an unique string is provided, the editor will be listed in the inspector
	 * under a name (the instance passed as a second argument). If an editor instance is passed, the editor with be
	 * attached and assigned a generated name.
	 * @param {Editor|CKEditorInspectorConfig} [editorOrOptions] An instance of the editor, if the first argument was specified as a string.
	 * Otherwise, an object of configuration options controlling the behavior of the inspector.
	 * @param {CKEditorInspectorConfig} [options] An object of configuration options controlling the behavior of the inspector.
	 * @returns {String} The unique name of the editor in the inspector. Useful when using `CKEditorInspector.detach()`.
	 */
	static attach( ...args ) {
		const { editorName, editorInstance, options } = normalizeArguments( args );

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

		return editorName;
	}

	/**
	 * Detaches the inspector from an editor instance.
	 *
	 *		CKEditorInspector.attach( 'my-editor', editor );
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
		// Don't update state if the application was destroy()ed.
		if ( !CKEditorInspector._isMounted ) {
			return;
		}

		CKEditorInspector._inspectorRef.current.setState( {
			editors: CKEditorInspector._editors
		} );
	}

	static _mount( options ) {
		if ( CKEditorInspector._wrapper ) {
			return;
		}

		const container = CKEditorInspector._wrapper = document.createElement( 'div' );
		container.className = 'ck-inspector-wrapper';
		document.body.appendChild( container );

		ReactDOM.render(
			<InspectorUI
				ref={CKEditorInspector._inspectorRef}
				editors={CKEditorInspector._editors}
				isCollapsed={options.isCollapsed}
			/>,
			container );
	}

	static get _isMounted() {
		return !!CKEditorInspector._inspectorRef.current;
	}
}

CKEditorInspector._editors = new Map();
CKEditorInspector._inspectorRef = React.createRef();
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
