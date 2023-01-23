/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export default class EditorListener {
	constructor( config ) {
		this._config = config;
	}

	startListening( currentEditor ) {
		currentEditor.model.document.on( 'change', this._config.onModelChange );
		currentEditor.editing.view.on( 'render', this._config.onViewRender );
		currentEditor.on( 'change:isReadOnly', this._config.onReadOnlyChange );
	}

	stopListening( currentEditor ) {
		currentEditor.model.document.off( 'change', this._config.onModelChange );
		currentEditor.editing.view.off( 'render', this._config.onViewRender );
		currentEditor.off( 'change:isReadOnly', this._config.onReadOnlyChange );
	}
}

export function getCurrentEditor( globalState ) {
	return globalState.editors.get( globalState.currentEditorName );
}
