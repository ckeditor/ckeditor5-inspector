/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, console, window, CKEDITOR_INSPECTOR_VERSION */

import React from 'react';
import ReactDOM from 'react-dom';

import InspectorUI from './components/ui';
import './app.css';


// From package.json -> webpack.
window.CKEDITOR_INSPECTOR_VERSION = CKEDITOR_INSPECTOR_VERSION;

const editors = new Map();
const container = document.createElement( 'div' );
container.className = 'ck-inspector-wrapper';
const inspectorRef = React.createRef();

export default class CKEditorInspector {
	static attach( name, editor ) {
		console.group('%cAttached the inspector to a CKEditor 5 instance. To learn more, visit https://ckeditor.com/docs/ckeditor5.',
		'font-weight: bold;' );
		console.log( `Editor instance "${ name }"`, editor );
		console.groupEnd();

		editors.set( name, editor );

		editor.on( 'destroy', () => {
			CKEditorInspector.detach( name );
		} );

		if ( !container.parentNode ) {
			document.body.appendChild( container );
			ReactDOM.render( <InspectorUI ref={inspectorRef} editors={editors} />, container );
		}

		CKEditorInspector._updateEditors( editors );
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
