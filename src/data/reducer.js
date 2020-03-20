/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import modelReducer from '../model/data/reducer';
import viewReducer from '../view/data/reducer';
import commandsReducer from '../commands/data/reducer';

import {
	TOGGLE_IS_COLLAPSED,
	SET_HEIGHT,
	SET_SIDE_PANE_WIDTH,
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	SET_ACTIVE_TAB
} from './actions';

import LocalStorageManager from '../localstoragemanager';
import {
	getFirstEditor,
	getFirstEditorName
} from '../utils';

const LOCAL_STORAGE_ACTIVE_TAB = 'active-tab-name';
const LOCAL_STORAGE_IS_COLLAPSED = 'is-collapsed';
const LOCAL_STORAGE_INSPECTOR_HEIGHT = 'height';
const LOCAL_STORAGE_SIDE_PANE_WIDTH = 'side-pane-width';

export default function( state, action ) {
	const newState = appReducer( state, action );

	newState.ui = appUIReducer( newState.ui, action );
	newState.model = modelReducer( newState, newState.model, action );
	newState.view = viewReducer( newState, newState.view, action );
	newState.commands = commandsReducer( newState, newState.commands, action );

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

function appUIReducer( UIState, action ) {
	switch ( action.type ) {
		case TOGGLE_IS_COLLAPSED:
			return getNewIsCollapsedState( UIState );
		case SET_HEIGHT:
			return getNewHeightState( UIState, action );
		case SET_SIDE_PANE_WIDTH:
			return getNewSidePaneWidthState( UIState, action );
		case SET_ACTIVE_TAB:
			return getNewActiveTabState( UIState, action );
		default:
			return UIState;
	}
}

function getNewCurrentEditorNameState( appState, action ) {
	return {
		...appState,

		currentEditorName: action.editorName,
		currentEditor: appState.editors.get( action.editorName )
	};
}

function getNewEditorsState( appState, action ) {
	const newState = {
		editors: new Map( action.editors )
	};

	if ( !action.editors.has( appState.currentEditorName ) ) {
		newState.currentEditor = getFirstEditor( action.editors );
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
