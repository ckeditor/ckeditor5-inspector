/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global window */

export default class LocalStorageManager {
	static set( name, value ) {
		window.localStorage.setItem( 'ck5-inspector-' + name, value );
	}

	static get( name ) {
		return window.localStorage.getItem( 'ck5-inspector-' + name );
	}
}
