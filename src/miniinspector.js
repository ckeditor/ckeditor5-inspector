/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import React from 'react';
import ReactDOM from 'react-dom';

import MiniInspectorUI from './miniinspectorui';

export default class MiniCKEditorInspector {
	static attach( editor, container ) {
		ReactDOM.render( <MiniInspectorUI editor={editor} />, container );
	}
}
