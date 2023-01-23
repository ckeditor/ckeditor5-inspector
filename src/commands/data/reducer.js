/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	SET_COMMANDS_CURRENT_COMMAND_NAME,
	UPDATE_COMMANDS_STATE
} from './actions';

import {
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	SET_ACTIVE_INSPECTOR_TAB
} from '../../data/actions';

import {
	getCommandsTreeDefinition,
	getEditorCommandDefinition
} from './utils';

export default function commandsReducer( globalState, commandsState, action ) {
	// Performance optimization: don't create the commands state unless necessary.
	if ( globalState.ui.activeTab !== 'Commands' ) {
		return commandsState;
	}

	if ( !commandsState ) {
		return getBlankCommandsState( globalState, commandsState );
	}

	switch ( action.type ) {
		case SET_COMMANDS_CURRENT_COMMAND_NAME:
			return {
				...commandsState,

				currentCommandDefinition: getEditorCommandDefinition( globalState, action.currentCommandName ),
				currentCommandName: action.currentCommandName
			};

		// * SET_ACTIVE_INSPECTOR_TAB – Because of the performance optimization at the beginning, update the state
		// if we're back in the commands tab.
		// * UPDATE_MODEL_STATE – An action called by the editorEventObserver for the model document change.
		case SET_ACTIVE_INSPECTOR_TAB:
		case UPDATE_COMMANDS_STATE:
			return {
				...commandsState,

				currentCommandDefinition: getEditorCommandDefinition( globalState, commandsState.currentCommandName ),
				treeDefinition: getCommandsTreeDefinition( globalState, commandsState )
			};

		// Actions related to the external state.
		case SET_EDITORS:
		case SET_CURRENT_EDITOR_NAME:
			return getBlankCommandsState( globalState, commandsState );

		default:
			return commandsState;
	}
}

function getBlankCommandsState( globalState, commandsState = {} ) {
	return {
		...commandsState,

		currentCommandName: null,
		currentCommandDefinition: null,
		treeDefinition: getCommandsTreeDefinition( globalState, commandsState )
	};
}

