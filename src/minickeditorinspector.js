/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import ReactDOM from 'react-dom';

import MiniInspectorUI from './minickeditorinspectorui';

// From changelog -> webpack.
window.CKEDITOR_MINI_INSPECTOR_VERSION = CKEDITOR_INSPECTOR_VERSION;

export default class MiniCKEditorInspector {
	/**
	 * Attaches the mini inspector to an editor instance and renders it in the specified HTML element.
	 *
	 *		ClassicEditor
	 *			.create( ... )
	 *			.then( editor => {
	 *				MiniCKEditorInspector.attach( editor, document.querySelector( '#inspector-render-element' ) );
	 *			} )
	 *			.catch( error => {
	 *				console.error( error );
	 *			} );
	 *
	 * @param {Editor} editor CKEditor 5 instance the mini inspector will attach to.
	 * @param {Element} container HTML element in which the mini inspector will be rendered in.
	 */
	static attach( editor, container ) {
		ReactDOM.render( <MiniInspectorUI editor={editor} />, container );
	}
}
