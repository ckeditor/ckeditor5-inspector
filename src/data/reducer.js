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

function appReducer( state, action ) {
	switch ( action.type ) {
		case TOGGLE_IS_COLLAPSED:
			return getNewIsCollapsedState( state );
		case SET_HEIGHT:
			return getNewHeightState( state, action );
		case SET_EDITORS:
			return getNewEditorsState( state, action );
		case SET_CURRENT_EDITOR_NAME:
			return getNewCurrentEditorNameState( state, action );
		case SET_ACTIVE_TAB:
			return getNewActiveTabState( state, action );
		default:
			return state;
	}
}

export default function( state, action ) {
	const newState = appReducer( state, action );

	newState.model = modelReducer( newState, newState.model, action );
	newState.view = viewReducer( newState, newState.view, action );
	newState.commands = commandsReducer( newState, newState.commands, action );

	return {
		...state,
		...newState
	};
}

function getNewHeightState( state, action ) {
	LocalStorageManager.set( LOCAL_STORAGE_INSPECTOR_HEIGHT, action.newHeight );

	return { ...state, height: action.newHeight };
}

function getNewIsCollapsedState( state ) {
	const isCollapsed = !state.isCollapsed;

	LocalStorageManager.set( LOCAL_STORAGE_IS_COLLAPSED, isCollapsed );

	return { ...state, isCollapsed };
}

function getNewCurrentEditorNameState( state, action ) {
	return {
		...state,

		currentEditorName: action.editorName,
		currentEditor: state.editors.get( action.editorName )
	};
}

function getNewActiveTabState( state, action ) {
	LocalStorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, action.tabName );

	return { ...state, activeTab: action.tabName };
}

function getNewEditorsState( state, action ) {
	const newState = {
		editors: new Map( action.editors )
	};

	if ( !action.editors.has( state.currentEditorName ) ) {
		newState.currentEditor = getFirstEditor( action.editors );
		newState.currentEditorName = getFirstEditorName( action.editors );
	}

	return { ...state, ...newState };
}
