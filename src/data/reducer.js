/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	TOGGLE_IS_COLLAPSED,
	SET_HEIGHT,
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	SET_ACTIVE_TAB
} from './actions';

import LocalStorageManager from '../localstoragemanager';
import { getFirstEditorName } from '../utils';

const LOCAL_STORAGE_ACTIVE_TAB = 'active-tab-name';
const LOCAL_STORAGE_IS_COLLAPSED = 'is-collapsed';
const LOCAL_STORAGE_INSPECTOR_HEIGHT = 'height';

export default function reducer( state, action ) {
	switch ( action.type ) {
		case TOGGLE_IS_COLLAPSED:
			return getNewIsCollapsedState( state );
		case SET_HEIGHT:
			return getNewHeightState( state, action );
		case SET_EDITORS:
			return getNewEditorsState( state, action );
		case SET_CURRENT_EDITOR_NAME:
			return { ...state, currentEditorName: action.editorName };
		case SET_ACTIVE_TAB:
			return getNewActiveTabState( state, action );
		default:
			return state;
	}
}

function getNewHeightState( state, action ) {
	LocalStorageManager.set( LOCAL_STORAGE_INSPECTOR_HEIGHT, action.newHeight );

	return { ...state, height: action.newHeight };
}

function getNewIsCollapsedState( state ) {
	const newState = !state.isCollapsed;

	LocalStorageManager.set( LOCAL_STORAGE_IS_COLLAPSED, newState );

	return { ...state, isCollapsed: newState };
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
		newState.currentEditorName = getFirstEditorName( action.editors );
	}

	return { ...state, ...newState };
}
