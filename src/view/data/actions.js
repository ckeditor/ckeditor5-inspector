/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export const SET_VIEW_CURRENT_ROOT_NAME = 'SET_VIEW_CURRENT_ROOT_NAME';
export const SET_VIEW_CURRENT_NODE = 'SET_VIEW_CURRENT_NODE';
export const SET_VIEW_ACTIVE_TAB = 'SET_VIEW_ACTIVE_TAB';
export const TOGGLE_VIEW_SHOW_ELEMENT_TYPES = 'TOGGLE_VIEW_SHOW_ELEMENT_TYPES';
export const UPDATE_VIEW_STATE = 'UPDATE_VIEW_STATE';

export function setViewCurrentRootName( currentRootName ) {
	return { type: SET_VIEW_CURRENT_ROOT_NAME, currentRootName };
}

export function setViewCurrentNode( currentNode ) {
	return { type: SET_VIEW_CURRENT_NODE, currentNode };
}

export function setViewActiveTab( tabName ) {
	return { type: SET_VIEW_ACTIVE_TAB, tabName };
}

export function toggleViewShowElementTypes() {
	return { type: TOGGLE_VIEW_SHOW_ELEMENT_TYPES };
}

export function updateViewState() {
	return { type: UPDATE_VIEW_STATE };
}
