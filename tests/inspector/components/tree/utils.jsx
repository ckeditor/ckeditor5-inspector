/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';

import { renderTreeNodeFromDefinition } from '../../../../src/components/tree/utils';

describe( 'renderTreeNodeFromDefinition()', () => {
	it( 'returns a TreeElement node definition', () => {
		const definition = { type: 'element' };
		const globalTreeProps = { showCompactText: true };
		const result = renderTreeNodeFromDefinition( definition, 4, globalTreeProps );

		expect( result.type.name ).toBe( 'TreeElement' );
		expect( result.key ).toBe( '4' );
		expect( result.props.definition ).toBe( definition );
		expect( result.props.globalTreeProps ).toBe( globalTreeProps );
	} );

	it( 'returns a TreeTextNode for text definition', () => {
		const definition = { type: 'text' };
		const globalTreeProps = { showCompactText: false };
		const result = renderTreeNodeFromDefinition( definition, 1, globalTreeProps );

		expect( result.type.name ).toBe( 'TreeTextNode' );
		expect( result.key ).toBe( '1' );
		expect( result.props.definition ).toBe( definition );
		expect( result.props.globalTreeProps ).toBe( globalTreeProps );
	} );

	it( 'returns a TreeComment for comment definition', () => {
		const definition = { type: 'comment' };
		const globalTreeProps = { showCompactText: false };
		const result = renderTreeNodeFromDefinition( definition, 3, globalTreeProps );

		expect( result.type.name ).toBe( 'TreeComment' );
		expect( result.key ).toBe( '3' );
		expect( result.props.definition ).toBe( definition );
		expect( result.props.globalTreeProps ).toBeUndefined();
	} );

	it( 'returns undefined for unknown definition types', () => {
		expect( renderTreeNodeFromDefinition( { type: 'unknown' }, 0, {} ) ).toBeUndefined();
	} );
} );
