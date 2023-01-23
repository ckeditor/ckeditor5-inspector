/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	setCommandsCurrentCommandName,
	updateCommandsState,

	SET_COMMANDS_CURRENT_COMMAND_NAME,
	UPDATE_COMMANDS_STATE
} from '../../../../src/commands/data/actions';

describe( 'commands data store actions', () => {
	it( 'should export setCommandsCurrentCommandName()', () => {
		expect( setCommandsCurrentCommandName( 'foo' ) ).to.deep.equal( {
			type: SET_COMMANDS_CURRENT_COMMAND_NAME,
			currentCommandName: 'foo'
		} );
	} );

	it( 'should export updateCommandsState()', () => {
		expect( updateCommandsState() ).to.deep.equal( {
			type: UPDATE_COMMANDS_STATE
		} );
	} );
} );
