/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export const TOGGLE_IS_COLLAPSED = 'TOGGLE_IS_COLLAPSED';
export const SET_HEIGHT = 'SET_HEIGHT';
export const SET_EDITORS = 'SET_EDITORS';
export const SET_CURRENT_EDITOR = 'SET_CURRENT_EDITOR';
export const SET_CURRENT_EDITOR_NAME = 'SET_CURRENT_EDITOR_NAME';
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';

export function toggleIsCollapsed() {
	return { type: TOGGLE_IS_COLLAPSED };
}

export function setHeight( newHeight ) {
	return { type: SET_HEIGHT, newHeight };
}

export function setEditors( editors ) {
	return { type: SET_EDITORS, editors };
}

export function setCurrentEditorName( editorName ) {
	return { type: SET_CURRENT_EDITOR_NAME, editorName };
}

export function setActiveTab( tabName ) {
	return { type: SET_ACTIVE_TAB, tabName };
}
