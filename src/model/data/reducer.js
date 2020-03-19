/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	SET_MODEL_CURRENT_ROOT_NAME,
	SET_MODEL_CURRENT_NODE,
	SET_MODEL_ACTIVE_TAB,
	TOGGLE_MODEL_SHOW_MARKERS,
	TOGGLE_MODEL_SHOW_COMPACT_TEXT,
	UPDATE_MODEL_STATE
} from './actions';

import {
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	SET_ACTIVE_TAB
} from '../../data/actions';

import {
	getEditorModelRanges,
	getEditorModelMarkers,
	getEditorModelRoots,
	getEditorModelTreeDefinition
} from './utils';

import LocalStorageManager from '../../localstoragemanager';

const LOCAL_STORAGE_ACTIVE_TAB = 'active-model-tab-name';
const LOCAL_STORAGE_SHOW_MARKERS = 'model-show-markers';
const LOCAL_STORAGE_COMPACT_TEXT = 'model-compact-text';

export default function modelReducer( globalState, modelState, action ) {
	// Performance optimization: don't create the model state unless necessary.
	if ( globalState.activeTab !== 'Model' ) {
		return modelState;
	}

	if ( !modelState ) {
		return {
			...getBlankModelState( globalState, modelState ),

			activeTab: LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Inspect',
			showMarkers: LocalStorageManager.get( LOCAL_STORAGE_SHOW_MARKERS ) === 'true',
			showCompactText: LocalStorageManager.get( LOCAL_STORAGE_COMPACT_TEXT ) === 'true'
		};
	}

	switch ( action.type ) {
		case SET_MODEL_CURRENT_ROOT_NAME:
			return getNewCurrentRootNameState( globalState, modelState, action );
		case SET_MODEL_CURRENT_NODE:
			return { ...modelState, currentNode: action.currentNode };
		case SET_MODEL_ACTIVE_TAB:
			return getNewActiveTabState( modelState, action );
		case TOGGLE_MODEL_SHOW_MARKERS:
			return getNewShowMarkersState( globalState, modelState );
		case TOGGLE_MODEL_SHOW_COMPACT_TEXT:
			return getNewShowCompactTextState( globalState, modelState );

		// * SET_ACTIVE_TAB – Because of the performance optimization at the beginning, update the state
		// if we're back in the model tab.
		// * UPDATE_MODEL_STATE – An action called by the editorEventObserver for the model document change.
		case SET_ACTIVE_TAB:
		case UPDATE_MODEL_STATE:
			return { ...modelState, ...getTreeDefinitionRangesMarkers( globalState, modelState ) };

		// Actions related to the external state.
		case SET_EDITORS:
		case SET_CURRENT_EDITOR_NAME:
			return getBlankModelState( globalState, modelState );

		default:
			return modelState;
	}
}

function getNewCurrentRootNameState( globalState, modelState, action ) {
	// Changing the current root name changes:
	// * the model definition tree,
	// * the ranges
	// * the markers
	const currentRootName = action.currentRootName;

	return {
		...modelState,

		...getTreeDefinitionRangesMarkers( globalState, modelState, { currentRootName } ),
		currentRootName
	};
}

function getNewActiveTabState( modelState, action ) {
	LocalStorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, action.tabName );

	return {
		...modelState,

		activeTab: action.tabName
	};
}

function getNewShowMarkersState( globalState, modelState ) {
	const showMarkers = !modelState.showMarkers;

	// Changing showMarkers state need re-render the tree definition.
	const { treeDefinition } = getTreeDefinitionRangesMarkers( globalState, modelState, {
		showMarkers
	} );

	LocalStorageManager.set( LOCAL_STORAGE_SHOW_MARKERS, showMarkers );

	return {
		...modelState,

		showMarkers,
		treeDefinition
	};
}

function getNewShowCompactTextState( globalState, modelState ) {
	const showCompactText = !modelState.showCompactText;

	LocalStorageManager.set( LOCAL_STORAGE_COMPACT_TEXT, showCompactText );

	return {
		...modelState,

		showCompactText
	};
}

function getBlankModelState( globalState, modelState = {} ) {
	const currentEditor = globalState.currentEditor;
	const roots = getEditorModelRoots( currentEditor );
	const currentRootName = roots[ 0 ].rootName;

	return {
		...modelState,

		...getTreeDefinitionRangesMarkers( globalState, modelState, { currentRootName } ),
		roots,
		currentRootName,
		currentNode: null
	};
}

function getTreeDefinitionRangesMarkers( globalState, modelState, modelStateOverrides ) {
	const overriddenModelState = { ...modelState, ...modelStateOverrides };
	const ranges = getEditorModelRanges( globalState.currentEditor );
	const markers = getEditorModelMarkers( globalState.currentEditor );
	const treeDefinition = getEditorModelTreeDefinition( {
		currentEditor: globalState.currentEditor,
		currentRootName: overriddenModelState.currentRootName,
		ranges,
		markers: overriddenModelState.showMarkers ? markers : []
	} );

	return {
		treeDefinition,
		ranges,
		markers
	};
}
