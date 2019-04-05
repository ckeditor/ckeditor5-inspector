/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window, CKEDITOR_INSPECTOR_VERSION */

import React from 'react';
import ReactDOM from 'react-dom';

import InspectorUI from './components/ui';
import Logger from './logger';
import './ckeditorinspector.css';

// From changelog -> webpack.
window.CKEDITOR_INSPECTOR_VERSION = CKEDITOR_INSPECTOR_VERSION;

const container = document.createElement( 'div' );
container.className = 'ck-inspector-wrapper';

let unnamedEditorCount = 0;

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

		if ( !CKEditorInspector._isMounted ) {
			CKEditorInspector._mount( options );
		}

		CKEditorInspector._updateState();

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
		CKEditorInspector._updateState();
	}

	/**
	 * Destroys the entire inspector application and removes it from DOM.
	 */
	static destroy() {
		ReactDOM.unmountComponentAtNode( container );
		CKEditorInspector._editors.clear();
		container.remove();
	}

	static _updateState() {
		// Don't update state if the application was destroy()ed.
		if ( !CKEditorInspector._isMounted ) {
			return;
		}

		CKEditorInspector._inspectorRef.current.setState( {
			editors: CKEditorInspector._editors
		} );
	}

	static _mount( options ) {
		document.body.appendChild( container );

		ReactDOM.render(
			<InspectorUI
				ref={CKEditorInspector._inspectorRef}
				editors={CKEditorInspector._editors}
				isCollapsed={options.isCollapsed}
			/>,
			container );
	}

	get _isMounted() {
		return !!CKEditorInspector._inspectorRef.current;
	}
}

function normalizeArguments( args ) {
	const normalized = {};

	// attach( editor );
	if ( args.length === 1 ) {
		normalized.editorName = getNextEditorName();
		normalized.editorInstance = args[ 0 ];
	}
	// attach( 'foo', editor );
	// attach( editor, { options } );
	else if ( args.length === 2 ) {
		// attach( 'foo', editor );
		if ( typeof args[ 0 ] === 'string' ) {
			normalized.editorName = args[ 0 ];
			normalized.editorInstance = args[ 1 ];
		}
		// attach( editor, { options } );
		else {
			normalized.editorName = getNextEditorName();
			normalized.editorInstance = args[ 0 ];
			normalized.options = args[ 1 ];
		}
	}
	// attach( 'foo', editor, { options } );
	else {
		normalized.editorName = args[ 0 ];
		normalized.editorInstance = args[ 1 ];
		normalized.options = args[ 2 ];
	}

	normalized.options = normalized.options || {};

	return normalized;
}

function getNextEditorName() {
	return `editor-${ ++unnamedEditorCount }`;
}

CKEditorInspector._editors = new Map();
CKEditorInspector._inspectorRef = React.createRef();

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
