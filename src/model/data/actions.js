/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export const SET_MODEL_TREE_DEFINITION = 'SET_MODEL_TREE_DEFINITION';
export const SET_MODEL_MARKERS = 'SET_MODEL_MARKERS';
export const SET_MODEL_RANGES = 'SET_MODEL_RANGES';
export const SET_MODEL_ROOTS = 'SET_MODEL_ROOTS';
export const SET_MODEL_CURRENT_ROOT_NAME = 'SET_MODEL_CURRENT_ROOT_NAME';
export const SET_MODEL_CURRENT_NODE = 'SET_MODEL_CURRENT_NODE';
export const SET_MODEL_ACTIVE_TAB = 'SET_MODEL_ACTIVE_TAB';
export const TOGGLE_MODEL_SHOW_MARKERS = 'TOGGLE_MODEL_SHOW_MARKERS';
export const TOGGLE_MODEL_SHOW_COMPACT_TEXT = 'TOGGLE_MODEL_SHOW_COMPACT_TEXT';
export const UPDATE_MODEL_STATE = 'UPDATE_MODEL_STATE';

export function setModelTreeDefinition( treeDefinition ) {
	return { type: SET_MODEL_TREE_DEFINITION, treeDefinition };
}

export function setModelMarkers( markers ) {
	return { type: SET_MODEL_MARKERS, markers };
}

export function setModelRanges( ranges ) {
	return { type: SET_MODEL_RANGES, ranges };
}

export function setModelRoots( roots ) {
	return { type: SET_MODEL_ROOTS, roots };
}

export function setModelCurrentRootName( currentRootName ) {
	return { type: SET_MODEL_CURRENT_ROOT_NAME, currentRootName };
}

export function setModelCurrentNode( currentNode ) {
	return { type: SET_MODEL_CURRENT_NODE, currentNode };
}

export function setModelActiveTab( tabName ) {
	return { type: SET_MODEL_ACTIVE_TAB, tabName };
}

export function toggleModelShowMarkers() {
	return { type: TOGGLE_MODEL_SHOW_MARKERS };
}

export function toggleModelShowCompactText() {
	return { type: TOGGLE_MODEL_SHOW_COMPACT_TEXT };
}

export function updateModelState() {
	return { type: UPDATE_MODEL_STATE };
}
