/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	setSchemaCurrentDefinitionName,
	SET_SCHEMA_CURRENT_DEFINITION_NAME
} from '../../../../src/schema/data/actions';

describe( 'schema data store actions', () => {
	it( 'should export setSchemaCurrentDefinitionName()', () => {
		expect( setSchemaCurrentDefinitionName( 'foo' ) ).to.deep.equal( {
			type: SET_SCHEMA_CURRENT_DEFINITION_NAME,
			currentSchemaDefinitionName: 'foo'
		} );
	} );
} );
