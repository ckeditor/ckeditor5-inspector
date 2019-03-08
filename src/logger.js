/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console */

export default class Logger {
	static group( name ) {
		console.group( name );
	}

	static groupEnd( name ) {
		console.groupEnd( name );
	}

	static log( message ) {
		console.log( message );
	}
}
