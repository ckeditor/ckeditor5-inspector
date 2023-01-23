/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { modelReducer } from '../model/data/reducer';
import { viewReducer } from '../view/data/reducer';
import commandsReducer from '../commands/data/reducer';
import schemaReducer from '../schema/data/reducer';

import {
	TOGGLE_IS_COLLAPSED,
	SET_HEIGHT,
	SET_SIDE_PANE_WIDTH,
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	UPDATE_CURRENT_EDITOR_IS_READ_ONLY,
	SET_ACTIVE_INSPECTOR_TAB
} from './actions';

import { getFirstEditorName } from '../utils';
import { getCurrentEditor } from './utils';

import LocalStorageManager from '../localstoragemanager';

export const LOCAL_STORAGE_ACTIVE_TAB = 'active-tab-name';
export const LOCAL_STORAGE_IS_COLLAPSED = 'is-collapsed';
export const LOCAL_STORAGE_INSPECTOR_HEIGHT = 'height';
export const LOCAL_STORAGE_SIDE_PANE_WIDTH = 'side-pane-width';

export function reducer( state, action ) {
	const newState = appReducer( state, action );

	newState.currentEditorGlobals = currentEditorGlobalsReducer( newState, newState.currentEditorGlobals, action );
	newState.ui = appUIReducer( newState.ui, action );
	newState.model = modelReducer( newState, newState.model, action );
	newState.view = viewReducer( newState, newState.view, action );
	newState.commands = commandsReducer( newState, newState.commands, action );
	newState.schema = schemaReducer( newState, newState.schema, action );

	return {
		...state,
		...newState
	};
}

function appReducer( state, action ) {
	switch ( action.type ) {
		case SET_EDITORS:
			return getNewEditorsState( state, action );
		case SET_CURRENT_EDITOR_NAME:
			return getNewCurrentEditorNameState( state, action );
		default:
			return state;
	}
}

function currentEditorGlobalsReducer( state, globalsState, action ) {
	switch ( action.type ) {
		case SET_EDITORS:
		case SET_CURRENT_EDITOR_NAME:
			return getCurrentEditorGlobalState( state );
		case UPDATE_CURRENT_EDITOR_IS_READ_ONLY:
			return getNewCurrentEditorIsReadOnlyState( state, globalsState );
		default:
			return globalsState;
	}
}

function appUIReducer( UIState, action ) {
	// This happens when the inspector store is created for the first time only.
	// Only #isCollapsed is passed then because it's configurable in inspector options.
	// The rest should be loaded from the LocalStorage or from defaults.
	if ( !UIState.activeTab ) {
		let isCollapsed;

		// If it was provided as "preloadedState" createStore()...
		if ( UIState.isCollapsed !== undefined ) {
			isCollapsed = UIState.isCollapsed;
		} else {
			isCollapsed = LocalStorageManager.get( LOCAL_STORAGE_IS_COLLAPSED ) === 'true';
		}

		return {
			...UIState,

			isCollapsed,
			activeTab: LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Model',
			height: LocalStorageManager.get( LOCAL_STORAGE_INSPECTOR_HEIGHT ) || '400px',
			sidePaneWidth: LocalStorageManager.get( LOCAL_STORAGE_SIDE_PANE_WIDTH ) || '500px'
		};
	}

	switch ( action.type ) {
		case TOGGLE_IS_COLLAPSED:
			return getNewIsCollapsedState( UIState );
		case SET_HEIGHT:
			return getNewHeightState( UIState, action );
		case SET_SIDE_PANE_WIDTH:
			return getNewSidePaneWidthState( UIState, action );
		case SET_ACTIVE_INSPECTOR_TAB:
			return getNewActiveTabState( UIState, action );
		default:
			return UIState;
	}
}

function getNewCurrentEditorNameState( appState, action ) {
	return {
		...appState,

		currentEditorName: action.editorName
	};
}

function getCurrentEditorGlobalState( appState ) {
	const isReadOnlyState = getNewCurrentEditorIsReadOnlyState( appState, {} );

	return {
		...isReadOnlyState
	};
}

function getNewCurrentEditorIsReadOnlyState( appState, globalsState ) {
	const editor = getCurrentEditor( appState );

	return {
		...globalsState,

		isReadOnly: editor ? editor.isReadOnly : false
	};
}

function getNewEditorsState( appState, action ) {
	const newState = {
		editors: new Map( action.editors )
	};

	if ( !action.editors.size ) {
		newState.currentEditorName = null;
	} else if ( !action.editors.has( appState.currentEditorName ) ) {
		newState.currentEditorName = getFirstEditorName( action.editors );
	}

	return { ...appState, ...newState };
}

function getNewHeightState( UIState, action ) {
	LocalStorageManager.set( LOCAL_STORAGE_INSPECTOR_HEIGHT, action.newHeight );

	return { ...UIState, height: action.newHeight };
}

function getNewSidePaneWidthState( UIState, action ) {
	LocalStorageManager.set( LOCAL_STORAGE_SIDE_PANE_WIDTH, action.newWidth );

	return { ...UIState, sidePaneWidth: action.newWidth };
}

function getNewIsCollapsedState( UIState ) {
	const isCollapsed = !UIState.isCollapsed;

	LocalStorageManager.set( LOCAL_STORAGE_IS_COLLAPSED, isCollapsed );

	return { ...UIState, isCollapsed };
}

function getNewActiveTabState( UIState, action ) {
	LocalStorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, action.tabName );

	return { ...UIState, activeTab: action.tabName };
}
