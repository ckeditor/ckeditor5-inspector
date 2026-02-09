/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import TreeElement from '../../../../src/components/tree/treeelement';

vi.mock( '../../../../src/components/tree/utils', () => ( {
	renderTreeNodeFromDefinition: definition => {
		if ( definition.type === 'text' ) {
			return `"${ definition.text }"`;
		}

		return null;
	}
} ) );

describe( '<TreeElement />', () => {
	let clickSpy;

	beforeEach( () => {
		clickSpy = vi.fn();
	} );

	it( 'is rendered', () => {
		const { container } = render( <TreeElement definition={{
			name: 'foo',
			attributes: [],
			children: []
		}} /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector-code' );
		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree-node' );
	} );

	it( 'reacts to props#isActive', () => {
		const { container } = render( <TreeElement definition={{
			name: 'foo',
			isActive: true,
			attributes: [],
			children: []
		}} /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree-node_active' );
	} );

	it( 'reacts to props.presentation#isEmpty', () => {
		const { container } = render( <TreeElement definition={{
			name: 'foo',
			attributes: [],
			presentation: {
				isEmpty: true
			},
			children: []
		}} /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree-node_empty' );
	} );

	it( 'reacts to props.presentation#cssClass', () => {
		const { container } = render( <TreeElement definition={{
			name: 'foo',
			attributes: [],
			presentation: {
				cssClass: 'bar'
			},
			children: []
		}} /> );

		expect( container.firstChild ).toHaveClass( 'bar' );
	} );

	it( 'executes props#onClick when clicked', () => {
		const { container } = render( <TreeElement definition={{
			name: 'foo',
			isActive: true,
			attributes: [],
			children: []
		}} globalTreeProps={{
			onClick: clickSpy
		}} /> );

		fireEvent.click( container.firstChild );
		expect( clickSpy ).toHaveBeenCalledTimes( 1 );
	} );

	describe( 'name', () => {
		it( 'is rendered', () => {
			const { container } = render( <TreeElement definition={{
				name: 'foo',
				attributes: [],
				children: []
			}} /> );

			const name = container.querySelector( '.ck-inspector-tree-node__name' );
			expect( name ).toHaveClass( 'ck-inspector-tree-node__name' );
		} );

		it( 'comes with attributes', () => {
			const { container } = render( <TreeElement definition={{
				name: 'foo',
				attributes: [
					[ 'a', 'b' ],
					[ 'c', 'd' ]
				],
				children: []
			}} /> );

			const attributes = container.querySelectorAll( '.ck-inspector-tree-node__attribute' );
			expect( attributes ).toHaveLength( 2 );
			expect( attributes[ 0 ] ).toHaveTextContent( 'ab' );
			expect( attributes[ 1 ] ).toHaveTextContent( 'cd' );
		} );

		it( 'should support #showElementTypes', () => {
			const { container } = render( <TreeElement definition={{
				name: 'foo',
				elementType: 'some',
				attributes: [],
				children: []
			}} globalTreeProps={{
				showElementTypes: true
			}} /> );

			const name = container.querySelector( '.ck-inspector-tree-node__name' );
			expect( name ).toHaveTextContent( 'some:foo' );
		} );
	} );

	describe( 'content', () => {
		it( 'is rendered', () => {
			const { container } = render( <TreeElement definition={{
				name: 'foo',
				attributes: [],
				children: []
			}} /> );

			const content = container.querySelector( '.ck-inspector-tree-node__content' );
			expect( content ).toHaveClass( 'ck-inspector-tree-node__content' );
		} );

		it( 'comes with children', () => {
			const { container } = render( <TreeElement definition={{
				name: 'foo',
				attributes: [],
				children: [
					{
						type: 'text',
						name: 'aa',
						text: 'abc',
						attributes: [],
						children: []
					}
				]
			}} /> );

			const content = container.querySelector( '.ck-inspector-tree-node__content' );
			expect( content ).toHaveTextContent( '"abc"' );
		} );
	} );

	describe( 'closing tag', () => {
		it( 'is rendered by default', () => {
			const { container } = render( <TreeElement definition={{
				name: 'foo',
				attributes: [],
				children: []
			}} /> );

			const names = container.querySelectorAll( '.ck-inspector-tree-node__name' );
			expect( names ).toHaveLength( 2 );

			const closing = names[ 1 ];
			expect( closing ).toHaveClass( 'ck-inspector-tree-node__name' );
			expect( closing ).toHaveTextContent( '/foo' );
		} );

		it( 'is not rendered when props.presentation#isEmpty', () => {
			const { container } = render( <TreeElement definition={{
				name: 'foo',
				attributes: [],
				children: [],
				presentation: {
					isEmpty: true
				}
			}} /> );

			expect( container.querySelectorAll( '.ck-inspector-tree-node__name' ) ).toHaveLength( 1 );
		} );

		it( 'should support #showElementTypes', () => {
			const { container } = render( <TreeElement definition={{
				name: 'foo',
				elementType: 'some',
				attributes: [],
				children: []
			}} globalTreeProps={{
				showElementTypes: true
			}} /> );

			const closing = container.querySelectorAll( '.ck-inspector-tree-node__name' )[ 1 ];
			expect( closing ).toHaveTextContent( '/some:foo' );
		} );
	} );
} );
