/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export const TOGGLE_IS_COLLAPSED = 'TOGGLE_IS_COLLAPSED';
export const SET_HEIGHT = 'SET_HEIGHT';
export const SET_SIDE_PANE_WIDTH = 'SET_SIDE_PANE_WIDTH';
export const SET_EDITORS = 'SET_EDITORS';
export const SET_CURRENT_EDITOR_NAME = 'SET_CURRENT_EDITOR_NAME';
export const UPDATE_CURRENT_EDITOR_IS_READ_ONLY = 'UPDATE_CURRENT_EDITOR_IS_READ_ONLY';
export const SET_ACTIVE_INSPECTOR_TAB = 'SET_ACTIVE_INSPECTOR_TAB';

export function toggleIsCollapsed() {
	return { type: TOGGLE_IS_COLLAPSED };
}

export function setHeight( newHeight ) {
	return { type: SET_HEIGHT, newHeight };
}

export function setSidePaneWidth( newWidth ) {
	return { type: SET_SIDE_PANE_WIDTH, newWidth };
}

export function setEditors( editors ) {
	return { type: SET_EDITORS, editors };
}

export function setCurrentEditorName( editorName ) {
	return { type: SET_CURRENT_EDITOR_NAME, editorName };
}

export function setActiveTab( tabName ) {
	return { type: SET_ACTIVE_INSPECTOR_TAB, tabName };
}

export function updateCurrentEditorIsReadOnly() {
	return { type: UPDATE_CURRENT_EDITOR_IS_READ_ONLY };
}
