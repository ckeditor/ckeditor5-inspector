/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

let unnamedEditorCount = 0;

export function normalizeArguments( args ) {
	const normalized = {
		editors: {}
	};

	const editorOrEditorPairs = args[ 0 ];

	// attach( editor );
	if ( isEditorInstance( editorOrEditorPairs ) ) {
		normalized.editors[ getNextEditorName() ] = args[ 0 ];
	}
	// attach( { foo: editor1, bar: editor2, ... } );
	else {
		for ( const name in editorOrEditorPairs ) {
			normalized.editors[ name ] = editorOrEditorPairs[ name ];
		}
	}

	// attach( editor, { options } );
	// attach( { foo: editor1, bar: editor2 }, { options } );
	normalized.options = args[ 1 ] || {};

	return normalized;
}

function getNextEditorName() {
	return `editor-${ ++unnamedEditorCount }`;
}

function isEditorInstance( arg ) {
	// Quack! 🦆
	return !!arg.model;
}
