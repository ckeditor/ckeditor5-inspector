/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import MiniInspectorUI from './miniinspectorui';

export default class MiniCKEditorInspector {
	static attach( editor, container ) {
		ReactDOM.render( <MiniInspectorUI editor={editor} />, container );
	}
}
