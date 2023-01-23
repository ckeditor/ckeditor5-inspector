/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export const SET_COMMANDS_CURRENT_COMMAND_NAME = 'SET_COMMANDS_CURRENT_COMMAND_NAME';
export const UPDATE_COMMANDS_STATE = 'UPDATE_COMMANDS_STATE';

export function setCommandsCurrentCommandName( currentCommandName ) {
	return { type: SET_COMMANDS_CURRENT_COMMAND_NAME, currentCommandName };
}

export function updateCommandsState() {
	return { type: UPDATE_COMMANDS_STATE };
}
