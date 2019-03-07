/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, console, window, CKEDITOR_INSPECTOR_VERSION */

import React from 'react';
import ReactDOM from 'react-dom';

import InspectorUI from './components/ui';
import './app.css';

// From changelog -> webpack.
window.CKEDITOR_INSPECTOR_VERSION = CKEDITOR_INSPECTOR_VERSION;

const editors = new Map();
const container = document.createElement( 'div' );
container.className = 'ck-inspector-wrapper';
const inspectorRef = React.createRef();

let editorCount = 0;

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
	 * @param {Editor|String} editorOrName When an unique string is provided, the editor will be listed in the inspector
	 * under a name (the instance passed as a second argument). If an editor instance is passed, the editor with be
	 * attached and assigned a generated name.
	 * @param {Editor} [editor] An instance of the editor, if the first argument was specified as a string.
	 * @returns {String} The unique name of the editor in the inspector. Useful when using `CKEditorInspector.detach()`.
	 */
	static attach( editorOrName, editor ) {
		let name, instance;

		if ( typeof editorOrName === 'string' ) {
			name = editorOrName;
			instance = editor;
		} else {
			name = `editor-${ ++editorCount }`;
			instance = editorOrName;
		}

		console.group('%cAttached the inspector to a CKEditor 5 instance. To learn more, visit https://ckeditor.com/docs/ckeditor5.',
		'font-weight: bold;' );
		console.log( `Editor instance "${ name }"`, instance );
		console.groupEnd();

		editors.set( name, instance );

		instance.on( 'destroy', () => {
			CKEditorInspector.detach( name );
		} );

		if ( !container.parentNode ) {
			document.body.appendChild( container );
			ReactDOM.render( <InspectorUI ref={inspectorRef} editors={editors} />, container );
		}

		CKEditorInspector._updateEditors( editors );

		return name;
	}

	static detach( name ) {
		editors.delete( name );

		CKEditorInspector._updateEditors( editors );
	}

	static _updateEditors( editors ) {
		inspectorRef.current.setState( {
			editors: editors
		} );
	}
}
