/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Logger from './logger';

let unnamedEditorCount = 0;

export function normalizeArguments( args ) {
	const normalized = {
		editors: {},
		options: {}
	};

	// Deprecated // attach( 'name', editor );
	if ( typeof args[ 0 ] === 'string' ) {
		Logger.warn(
			`[CKEditorInspector] The CKEditorInspector.attach( '${ args[ 0 ] }', editor ) syntax has been deprecated ` +
			'and will be removed in the near future. To pass a name of an editor instance, use ' +
			`CKEditorInspector.attach( { '${ args[ 0 ] }': editor } ) instead. ` +
			'Learn more in https://github.com/ckeditor/ckeditor5-inspector/blob/master/README.md.'
		);

		normalized.editors[ args[ 0 ] ] = args[ 1 ];
	} else {
		// attach( editor );
		if ( isEditorInstance( args[ 0 ] ) ) {
			normalized.editors[ getNextEditorName() ] = args[ 0 ];
		}
		// attach( { foo: editor1, bar: editor2, ... } );
		else {
			for ( const name in args[ 0 ] ) {
				normalized.editors[ name ] = args[ 0 ][ name ];
			}
		}

		// attach( ..., { options } );
		normalized.options = args[ 1 ] || normalized.options;
	}

	return normalized;
}

function getNextEditorName() {
	return `editor-${ ++unnamedEditorCount }`;
}

function isEditorInstance( arg ) {
	// Quack! 🦆
	return !!arg.model && !!arg.editing;
}
