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
	SET_CURRENT_EDITOR_NAME
} from '../../data/actions';

import {
	getEditorViewRanges,
	getEditorViewRoots,
	getEditorViewTreeDefinition
} from './utils';

import LocalStorageManager from '../../localstoragemanager';

const LOCAL_STORAGE_ACTIVE_TAB = 'active-view-tab-name';
const LOCAL_STORAGE_ELEMENT_TYPES = 'view-element-types';

export default function modelReducer( globalState, viewState, action ) {
	if ( !viewState ) {
		return {
			...getBlankViewState( globalState, viewState ),

			activeTab: LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Inspect',
			showTypes: LocalStorageManager.get( LOCAL_STORAGE_ELEMENT_TYPES ) === 'true'
		};
	}

	switch ( action.type ) {
		case SET_VIEW_CURRENT_ROOT_NAME:
			return getNewCurrentRootNameState( globalState, viewState, action );
		case SET_VIEW_CURRENT_NODE:
			return { ...viewState, currentNode: action.currentNode };
		case SET_VIEW_ACTIVE_TAB:
			return getNewActiveTabState( viewState, action );
		case TOGGLE_VIEW_SHOW_ELEMENT_TYPES:
			return getNewShowTypesState( globalState, viewState );

		// An action called by the editor model change observer.
		case UPDATE_VIEW_STATE:
			return { ...viewState, ...getTreeDefinitionRanges( globalState, viewState ) };

		// Actions related to the external state.
		case SET_EDITORS:
		case SET_CURRENT_EDITOR_NAME:
			return getBlankViewState( globalState, viewState );

		default:
			return viewState;
	}
}

function getNewCurrentRootNameState( globalState, viewState, action ) {
	// Changing the current root name changes:
	// * the model definition tree,
	// * the ranges
	// * the markers
	const currentRootName = action.currentRootName;

	return {
		...viewState,

		...getTreeDefinitionRanges( globalState, viewState, { currentRootName } ),
		currentRootName
	};
}

function getNewActiveTabState( viewState, action ) {
	LocalStorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, action.tabName );

	return {
		...viewState,

		activeTab: action.tabName
	};
}

function getNewShowTypesState( globalState, viewState ) {
	const showTypes = !viewState.showTypes;

	// Changing showTypes state need re-render the tree definition.
	const { treeDefinition } = getTreeDefinitionRanges( globalState, viewState, {
		showTypes
	} );

	LocalStorageManager.set( LOCAL_STORAGE_ELEMENT_TYPES, showTypes );

	return {
		...viewState,

		showTypes,
		treeDefinition
	};
}

function getBlankViewState( globalState, viewState = {} ) {
	const currentEditor = globalState.currentEditor;
	const roots = getEditorViewRoots( currentEditor );
	const currentRootName = roots[ 0 ].rootName;

	return {
		...viewState,

		...getTreeDefinitionRanges( globalState, viewState, { currentRootName } ),
		roots,
		currentRootName,
		currentNode: null
	};
}

function getTreeDefinitionRanges( globalState, viewState, modelStateOverrides ) {
	const overriddenModelState = { ...viewState, ...modelStateOverrides };
	const ranges = getEditorViewRanges( globalState.currentEditor );
	const treeDefinition = getEditorViewTreeDefinition( {
		currentEditor: globalState.currentEditor,
		currentRootName: overriddenModelState.currentRootName,
		ranges
	} );

	return {
		treeDefinition,
		ranges
	};
}
