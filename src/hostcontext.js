/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';

/**
 * Host realm (document + window) into which the inspector is mounted.
 *
 * The inspector supports being mounted into a document other than the global
 * `document` of the realm where the module was evaluated (e.g. an Electron
 * BrowserWindow, a WebView2 popup, or an iframe). All DOM reads/writes made
 * from the inspector UI must go through this context instead of the module
 * globals to work correctly in that setup.
 *
 * The default value falls back to the module globals so consumers that don't
 * pass a `container` (single-realm case) continue to work unchanged.
 */
/* v8 ignore start -- @preserve: SSR / non-DOM fallback, unreachable in jsdom-based test runs */

export const HostContext = React.createContext( {
	document: typeof document === 'undefined' ? null : document,
	window: typeof window === 'undefined' ? null : window
} );

/* v8 ignore stop */
