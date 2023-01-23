/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	SET_SCHEMA_CURRENT_DEFINITION_NAME
} from './actions';

import {
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	SET_ACTIVE_INSPECTOR_TAB
} from '../../data/actions';

import {
	getSchemaTreeDefinition,
	getSchemaDefinition
} from './utils';

export default function schemaReducer( globalState, schemaState, action ) {
	// Performance optimization: don't create the schema state unless necessary.
	if ( globalState.ui.activeTab !== 'Schema' ) {
		return schemaState;
	}

	if ( !schemaState ) {
		return getBlankSchemaState( globalState, schemaState );
	}

	switch ( action.type ) {
		case SET_SCHEMA_CURRENT_DEFINITION_NAME:
			return {
				...schemaState,

				currentSchemaDefinition: getSchemaDefinition( globalState, action.currentSchemaDefinitionName ),
				currentSchemaDefinitionName: action.currentSchemaDefinitionName
			};

		// * SET_ACTIVE_INSPECTOR_TAB – Because of the performance optimization at the beginning, update the state
		// if we're back in the commands tab.
		// * UPDATE_MODEL_STATE – An action called by the editorEventObserver for the model document change.
		case SET_ACTIVE_INSPECTOR_TAB:
			return {
				...schemaState,

				currentSchemaDefinition: getSchemaDefinition( globalState, schemaState.currentSchemaDefinitionName ),
				treeDefinition: getSchemaTreeDefinition( globalState, schemaState )
			};

		// Actions related to the external state.
		case SET_EDITORS:
		case SET_CURRENT_EDITOR_NAME:
			return getBlankSchemaState( globalState, schemaState );

		default:
			return schemaState;
	}
}

function getBlankSchemaState( globalState, schemaState = {} ) {
	return {
		...schemaState,

		currentSchemaDefinitionName: null,
		currentSchemaDefinition: null,
		treeDefinition: getSchemaTreeDefinition( globalState, schemaState )
	};
}

