/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

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

	static warn( ...args ) {
		console.warn( ...args );
	}
}
