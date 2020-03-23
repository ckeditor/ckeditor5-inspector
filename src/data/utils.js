/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export default class EditorListener {
	constructor( config ) {
		this._config = config;
	}

	startListening( currentEditor ) {
		currentEditor.model.document.on( 'change', this._config.onModelChange );
		currentEditor.editing.view.on( 'render', this._config.onViewRender );
	}

	stopListening( currentEditor ) {
		currentEditor.model.document.off( 'change', this._config.onModelChange );
		currentEditor.editing.view.off( 'render', this._config.onViewRender );
	}
}
