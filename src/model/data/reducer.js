/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	SET_MODEL_CURRENT_ROOT_NAME,
	SET_MODEL_CURRENT_NODE_PATH,
	SET_MODEL_ACTIVE_TAB,
	TOGGLE_MODEL_SHOW_MARKERS,
	TOGGLE_MODEL_SHOW_COMPACT_TEXT,
	UPDATE_MODEL_STATE
} from './actions';

import {
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	SET_ACTIVE_INSPECTOR_TAB
} from '../../data/actions';

import {
	getEditorModelRanges,
	getEditorModelMarkers,
	getEditorModelRoots
} from './utils/utils';

import { getEditorModelNodeDefinition } from './utils/nodeinspector';
import { getEditorModelTreeDefinition } from './utils/tree';
import { isModelRoot, getEditorModelNodeByRootAndPath } from '../utils';

import LocalStorageManager from '../../localstoragemanager';
import { getCurrentEditorInstance } from '../../data/utils';

export const LOCAL_STORAGE_ACTIVE_TAB = 'active-model-tab-name';
export const LOCAL_STORAGE_SHOW_MARKERS = 'model-show-markers';
export const LOCAL_STORAGE_COMPACT_TEXT = 'model-compact-text';

export function modelReducer( globalState, modelState, action ) {
	const newState = modelDataReducer( globalState, modelState, action );

	if ( newState ) {
		newState.ui = modelUIReducer( newState.ui, action );
	}

	return newState;
}

function modelDataReducer( globalState, modelState, action ) {
	// Performance optimization: don't create the model state unless necessary.
	if ( globalState.ui.activeTab !== 'Model' ) {
		return modelState;
	}

	if ( !modelState ) {
		return getBlankModelState( globalState, modelState );
	}

	switch ( action.type ) {
		case SET_MODEL_CURRENT_ROOT_NAME:
			return getNewCurrentRootNameState( globalState, modelState, action );
		case SET_MODEL_CURRENT_NODE_PATH:
			return {
				...modelState,

				currentNodePath: action.currentNodePath,
				currentNodeDefinition: getEditorModelNodeDefinition(
					getCurrentEditorInstance( globalState ),
					modelState.currentRootName,
					action.currentNodePath
				)
			};

		// * SET_ACTIVE_INSPECTOR_TAB – Because of the performance optimization at the beginning, update the state
		// if we're back in the model tab.
		// * UPDATE_MODEL_STATE – An action called by the EditorListener for the model document change.
		case SET_ACTIVE_INSPECTOR_TAB:
		case UPDATE_MODEL_STATE:
			return { ...modelState, ...getEssentialState( globalState, modelState ) };

		// Actions related to the external state.
		case SET_EDITORS:
		case SET_CURRENT_EDITOR_NAME:
			return getBlankModelState( globalState, modelState );

		default:
			return modelState;
	}
}

function modelUIReducer( UIState, action ) {
	if ( !UIState ) {
		return {
			activeTab: LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Inspect',
			showMarkers: LocalStorageManager.get( LOCAL_STORAGE_SHOW_MARKERS ) === 'true',
			showCompactText: LocalStorageManager.get( LOCAL_STORAGE_COMPACT_TEXT ) === 'true'
		};
	}

	switch ( action.type ) {
		case SET_MODEL_ACTIVE_TAB:
			return getNewActiveTabState( UIState, action );
		case TOGGLE_MODEL_SHOW_MARKERS:
			return getNewShowMarkersState( UIState );
		case TOGGLE_MODEL_SHOW_COMPACT_TEXT:
			return getNewShowCompactTextState( UIState );

		default:
			return UIState;
	}
}

function getNewCurrentRootNameState( globalState, modelState, action ) {
	const currentRootName = action.currentRootName;

	return {
		...modelState,

		...getEssentialState( globalState, modelState, { currentRootName } ),
		currentNodePath: null,
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

function getNewShowMarkersState( UIState ) {
	const showMarkers = !UIState.showMarkers;

	LocalStorageManager.set( LOCAL_STORAGE_SHOW_MARKERS, showMarkers );

	return {
		...UIState,

		showMarkers
	};
}

function getNewShowCompactTextState( UIState ) {
	const showCompactText = !UIState.showCompactText;

	LocalStorageManager.set( LOCAL_STORAGE_COMPACT_TEXT, showCompactText );

	return {
		...UIState,

		showCompactText
	};
}

function getBlankModelState( globalState, modelState = {} ) {
	const currentEditor = getCurrentEditorInstance( globalState );

	if ( !currentEditor ) {
		return {
			ui: modelState.ui
		};
	}

	const currentRootName = getEditorModelRoots( currentEditor )[ 0 ].rootName;

	return {
		...modelState,

		...getEssentialState( globalState, modelState, {
			currentRootName,
			currentNodeDefinition: null
		} ),
		currentRootName,
		currentNodePath: null,
		currentNodeDefinition: null
	};
}

function getEssentialState( globalState, modelState, modelStateOverrides ) {
	const currentEditor = getCurrentEditorInstance( globalState );
	const overriddenModelState = { ...modelState, ...modelStateOverrides };
	const currentRootName = overriddenModelState.currentRootName;

	const ranges = getEditorModelRanges( currentEditor, currentRootName );
	const markers = getEditorModelMarkers( currentEditor, currentRootName );
	const treeDefinition = getEditorModelTreeDefinition( {
		currentEditor,
		currentRootName: overriddenModelState.currentRootName,
		ranges,
		markers
	} );

	let currentNodeDefinition = overriddenModelState.currentNodeDefinition || null;
	let currentNodePath = null;

	// If there was an inspected node definition, try updating it.
	if ( currentNodeDefinition ) {
		currentNodePath	= currentNodeDefinition.path;

		// It could be the root has changed so the current node does no belong to the new inspected root.
		if ( !getEditorModelNodeByRootAndPath( currentEditor, currentRootName, currentNodePath ) ) {
			currentNodePath = null;
			currentNodeDefinition = null;
		} else {
			// Update the current node definition each time the new model state is created.
			currentNodeDefinition = getEditorModelNodeDefinition( currentEditor, currentRootName, currentNodePath );
		}
	}

	return {
		treeDefinition,
		currentNodePath,
		currentNodeDefinition,
		ranges,
		markers
	};
}
