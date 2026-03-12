/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import TreePosition from '../../../../src/components/tree/treeposition';

describe( '<TreePosition />', () => {
	it( 'renders a selection position', () => {
		const { container } = render( <TreePosition definition={{
			type: 'selection',
			isEnd: false,
			name: null,
			presentation: null
		}} /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree__position' );
		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree__position_selection' );
		expect( container.firstChild ).not.toHaveClass( 'ck-inspector-tree__position_marker' );
		expect( container.firstChild ).not.toHaveClass( 'ck-inspector-tree__position_end' );
	} );

	it( 'renders an end position', () => {
		const { container } = render( <TreePosition definition={{
			type: 'selection',
			isEnd: true,
			name: null,
			presentation: null
		}} /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree__position_end' );
	} );

	it( 'renders a marker position with the marker name attribute', () => {
		const { container } = render( <TreePosition definition={{
			type: 'marker',
			isEnd: false,
			name: 'foo:bar',
			presentation: null
		}} /> );

		expect( container.firstChild ).not.toHaveClass( 'ck-inspector-tree__position_selection' );
		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree__position_marker' );
		expect( container.firstChild ).toHaveAttribute( 'data-marker-name', 'foo:bar' );
	} );

	it( 'applies a custom color when presentation#color is set', () => {
		const { container } = render( <TreePosition definition={{
			type: 'selection',
			isEnd: false,
			name: null,
			presentation: { color: 'rgb(1, 2, 3)' }
		}} /> );

		expect( container.firstChild.style.getPropertyValue( '--ck-inspector-color-tree-position' ) ).toBe( 'rgb(1, 2, 3)' );
	} );

	it( 'does not apply a color when presentation has no color', () => {
		const { container } = render( <TreePosition definition={{
			type: 'selection',
			isEnd: false,
			name: null,
			presentation: {}
		}} /> );

		expect( container.firstChild.style.getPropertyValue( '--ck-inspector-color-tree-position' ) ).toBe( '' );
	} );
} );
