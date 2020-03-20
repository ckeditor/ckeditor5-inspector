/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
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
	SET_ACTIVE_TAB
} from '../../data/actions';

import {
	getEditorViewRanges,
	getEditorViewRoots,
	getEditorViewTreeDefinition,
	getEditorViewNodeDefinition
} from './utils';

import LocalStorageManager from '../../localstoragemanager';

const LOCAL_STORAGE_ACTIVE_TAB = 'active-view-tab-name';
const LOCAL_STORAGE_ELEMENT_TYPES = 'view-element-types';

export default function( globalState, viewState, action ) {
	const newState = viewReducer( globalState, viewState, action );

	newState.ui = viewUIReducer( globalState, newState.ui, action );

	return newState;
}

function viewReducer( globalState, viewState, action ) {
	if ( !viewState ) {
		return getBlankViewState( globalState, viewState );
	}

	// Performance optimization: don't create the view state unless necessary.
	if ( globalState.ui.activeTab !== 'View' ) {
		return viewState;
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

		// * SET_ACTIVE_TAB – Because of the performance optimization at the beginning, update the state
		// if we're back in the view tab.
		// * UPDATE_MODEL_STATE – An action called by the editorEventObserver for the view document render.
		case SET_ACTIVE_TAB:
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
	const currentEditor = globalState.currentEditor;
	const roots = getEditorViewRoots( currentEditor );
	const currentRootName = roots[ 0 ].rootName;

	return {
		...viewState,

		...getEssentialState( globalState, viewState, { currentRootName } ),
		roots,
		currentRootName,
		currentNode: null,
		currentNodeDefinition: null
	};
}

function getEssentialState( globalState, viewState, modelStateOverrides ) {
	const overriddenModelState = { ...viewState, ...modelStateOverrides };
	const ranges = getEditorViewRanges( globalState.currentEditor );
	const treeDefinition = getEditorViewTreeDefinition( {
		currentEditor: globalState.currentEditor,
		currentRootName: overriddenModelState.currentRootName,
		ranges
	} );

	const currentRootName = overriddenModelState.currentRootName;
	let currentNode = overriddenModelState.currentNode;
	let currentNodeDefinition = overriddenModelState.currentNodeDefinition;

	if ( currentNode ) {
		// If the currentNode no longer belongs to the root, reset the state.
		// This can happen when, for instance, inspecting an element, and it gets removed from the editor content.
		if ( currentNode.root.rootName !== currentRootName ) {
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
