/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Logger from './logger';

let unnamedEditorCount = 0;

export function normalizeArguments( args ) {
	const normalized = {
		editors: {},

		// attach( ..., { options } );
		options: args[ 1 ] || {}
	};

	let editorOrEditorPairs = args[ 0 ];

	if ( typeof editorOrEditorPairs === 'string' ) {
		Logger.warn(
			'[CKEditorInspector] The CKEditorInspector.attach( \'editorName\', editor ) syntax has been deprecated and will be removed ' +
			'in the near future. To pass a name of an editor instance, use CKEditorInspector.attach( { editorName: editor } ) instead.'
		);

		editorOrEditorPairs = { [ editorOrEditorPairs ]: args[ 1 ] };
	}

	// attach( editor );
	if ( isEditorInstance( editorOrEditorPairs ) ) {
		normalized.editors[ getNextEditorName() ] = editorOrEditorPairs;
	}
	// attach( { foo: editor1, bar: editor2, ... } );
	else {
		for ( const name in editorOrEditorPairs ) {
			normalized.editors[ name ] = editorOrEditorPairs[ name ];
		}
	}

	return normalized;
}

function getNextEditorName() {
	return `editor-${ ++unnamedEditorCount }`;
}

function isEditorInstance( arg ) {
	// Quack! 🦆
	return !!arg.model;
}
