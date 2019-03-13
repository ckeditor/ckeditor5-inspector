/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console */

export default class Logger {
	static group( ...args ) {
		console.group( ...args );
	}

	static groupEnd( ...args ) {
		console.groupEnd( ...args );
	}

	static log( ...args ) {
		console.log( ...args );
	}
}
