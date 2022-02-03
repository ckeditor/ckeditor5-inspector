/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import MiniInspectorUI from './miniinspectorui';

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
	 * @param {Editor|Object} editorOrEditors If an editor instance is passed, the inspect will attach to the editor
	 * with an auto–generated name. It is possible to pass an object with `name: instance` pairs to attach to
	 * multiple editors at a time with unique names.
	 * @param {Element} container HTML element in which the mini inspector will be rendered in.
	 */
	static attach( editor, container ) {
		ReactDOM.render( <MiniInspectorUI editor={editor} />, container );
	}
}
