/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	SET_VIEW_CURRENT_ROOT_NAME,
	SET_VIEW_CURRENT_NODE,
	SET_VIEW_ACTIVE_TAB,
	TOGGLE_VIEW_SHOW_ELEMENT_TYPES,
	UPDATE_VIEW_STATE
} from './actions';

import {
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	SET_ACTIVE_INSPECTOR_TAB
} from '../../data/actions';

import {
	getEditorViewRanges,
	getEditorViewRoots,
	getEditorViewTreeDefinition,
	getEditorViewNodeDefinition
} from './utils';

import { isViewRoot } from '../utils';
import { getCurrentEditor } from '../../data/utils';

import LocalStorageManager from '../../localstoragemanager';

export const LOCAL_STORAGE_ACTIVE_TAB = 'active-view-tab-name';
export const LOCAL_STORAGE_ELEMENT_TYPES = 'view-element-types';

export function viewReducer( globalState, viewState, action ) {
	const newState = dataReducer( globalState, viewState, action );

	if ( newState ) {
		newState.ui = viewUIReducer( globalState, newState.ui, action );
	}

	return newState;
}

function dataReducer( globalState, viewState, action ) {
	// Performance optimization: don't create the view state unless necessary.
	if ( globalState.ui.activeTab !== 'View' ) {
		return viewState;
	}

	if ( !viewState ) {
		return getBlankViewState( globalState, viewState );
	}

	switch ( action.type ) {
		case SET_VIEW_CURRENT_ROOT_NAME:
			return getNewCurrentRootNameState( globalState, viewState, action );
		case SET_VIEW_CURRENT_NODE:
			return {
				...viewState,

				currentNode: action.currentNode,
				currentNodeDefinition: getEditorViewNodeDefinition( action.currentNode )
			};

		// * SET_ACTIVE_INSPECTOR_TAB – Because of the performance optimization at the beginning, update the state
		// if we're back in the view tab.
		// * UPDATE_MODEL_STATE – An action called by the editorEventObserver for the view document render.
		case SET_ACTIVE_INSPECTOR_TAB:
		case UPDATE_VIEW_STATE:
			return { ...viewState, ...getEssentialState( globalState, viewState ) };

		// Actions related to the external state.
		case SET_EDITORS:
		case SET_CURRENT_EDITOR_NAME:
			return getBlankViewState( globalState, viewState );

		default:
			return viewState;
	}
}

function viewUIReducer( globalState, UIState, action ) {
	if ( !UIState ) {
		return {
			activeTab: LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Inspect',
			showElementTypes: LocalStorageManager.get( LOCAL_STORAGE_ELEMENT_TYPES ) === 'true'
		};
	}

	switch ( action.type ) {
		case SET_VIEW_ACTIVE_TAB:
			return getNewActiveTabState( UIState, action );
		case TOGGLE_VIEW_SHOW_ELEMENT_TYPES:
			return getNewShowElementTypesState( globalState, UIState );

		default:
			return UIState;
	}
}

function getNewCurrentRootNameState( globalState, viewState, action ) {
	const currentRootName = action.currentRootName;

	return {
		...viewState,

		...getEssentialState( globalState, viewState, { currentRootName } ),
		currentNode: null,
		currentNodeDefinition: null,
		currentRootName
	};
}

function getNewActiveTabState( UIState, action ) {
	LocalStorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, action.tabName );

	return {
		...UIState,

		activeTab: action.tabName
	};
}

function getNewShowElementTypesState( globalState, UIState ) {
	const showElementTypes = !UIState.showElementTypes;

	LocalStorageManager.set( LOCAL_STORAGE_ELEMENT_TYPES, showElementTypes );

	return {
		...UIState,

		showElementTypes
	};
}

function getBlankViewState( globalState, viewState = {} ) {
	const currentEditor = getCurrentEditor( globalState );
	const roots = getEditorViewRoots( currentEditor );
	const currentRootName = roots[ 0 ] ? roots[ 0 ].rootName : null;

	return {
		...viewState,

		...getEssentialState( globalState, viewState, { currentRootName } ),
		currentRootName,
		currentNode: null,
		currentNodeDefinition: null
	};
}

function getEssentialState( globalState, viewState, viewStateOverrides ) {
	const overriddenViewState = { ...viewState, ...viewStateOverrides };
	const currentRootName = overriddenViewState.currentRootName;

	const ranges = getEditorViewRanges( getCurrentEditor( globalState ), currentRootName );
	const treeDefinition = getEditorViewTreeDefinition( {
		currentEditor: getCurrentEditor( globalState ),
		currentRootName,
		ranges
	} );

	let currentNode = overriddenViewState.currentNode;
	let currentNodeDefinition = overriddenViewState.currentNodeDefinition;

	if ( currentNode ) {
		// If the currentNode no longer belongs to the root, reset the state.
		// This can happen when, for instance, inspecting an element, and it gets removed from the editor content.
		if ( currentNode.root.rootName !== currentRootName || ( !isViewRoot( currentNode ) && !currentNode.parent ) ) {
			currentNode = null;
			currentNodeDefinition = null;
		} else {
			// Update the current node definition each time the new model state is created.
			currentNodeDefinition = getEditorViewNodeDefinition( currentNode );
		}
	} else {
		// No current node, no definition.
		currentNodeDefinition = null;
	}

	return {
		treeDefinition,
		currentNode,
		currentNodeDefinition,
		ranges
	};
}
