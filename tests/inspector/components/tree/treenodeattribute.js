/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { render } from '@testing-library/react';
import TreeNodeAttribute from '../../../../src/components/tree/treenodeattribute';

describe( '<TreeNodeAttribute />', () => {
	it( 'is rendered', () => {
		const { container } = render( <TreeNodeAttribute name="foo" value="bar" /> );
		const attribute = container.firstChild;

		expect( attribute ).toHaveClass( 'ck-inspector-tree-node__attribute' );
		expect( attribute.children ).toHaveLength( 2 );
	} );

	describe( 'name', () => {
		it( 'is rendered', () => {
			const { container } = render( <TreeNodeAttribute name="foo" value="bar" /> );
			const name = container.querySelector( '.ck-inspector-tree-node__attribute__name' );

			expect( name ).toHaveClass( 'ck-inspector-tree-node__attribute__name' );
			expect( name ).toHaveAttribute( 'title', 'bar' );
		} );
	} );

	describe( 'value', () => {
		it( 'is rendered', () => {
			const { container } = render( <TreeNodeAttribute name="foo" value="bar" /> );
			const value = container.querySelector( '.ck-inspector-tree-node__attribute__value' );

			expect( value ).toHaveClass( 'ck-inspector-tree-node__attribute__value' );
			expect( value ).toHaveTextContent( 'bar' );
		} );

		it( 'is not rendered when props#dontRenderValue is true', () => {
			const { container } = render( <TreeNodeAttribute name="foo" value="bar" dontRenderValue="true" /> );
			expect( container.firstChild.children ).toHaveLength( 1 );
		} );
	} );
} );
