/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

export const SET_SCHEMA_CURRENT_DEFINITION_NAME = 'SET_SCHEMA_CURRENT_DEFINITION_NAME';

export function setSchemaCurrentDefinitionName( currentSchemaDefinitionName ) {
	return { type: SET_SCHEMA_CURRENT_DEFINITION_NAME, currentSchemaDefinitionName };
}

