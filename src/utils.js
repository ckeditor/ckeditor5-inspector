/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

let unnamedEditorCount = 0;

export function normalizeArguments( args ) {
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
