/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export const SET_SCHEMA_CURRENT_DEFINITION_NAME = 'SET_SCHEMA_CURRENT_DEFINITION_NAME';

export function setSchemaCurrentDefinitionName( currentSchemaDefinitionName ) {
	return { type: SET_SCHEMA_CURRENT_DEFINITION_NAME, currentSchemaDefinitionName };
}

