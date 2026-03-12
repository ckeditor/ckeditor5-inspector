/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Tree from '../../../../src/components/tree/tree';

describe( '<Tree />', () => {
	let clickSpy;

	beforeEach( () => {
		clickSpy = vi.fn();
	} );

	it( 'should render a tree', () => {
		const { container } = render( <Tree /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree' );
		expect( container.textContent ).toBe( 'Nothing to show.' );
	} );

	it( 'supports text direction', () => {
		const { container } = render( <Tree textDirection="rtl" /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree_text-direction_rtl' );
	} );

	describe( 'elements', () => {
		let renderResult, itemA, itemAA, itemB, activeNode;

		beforeEach( () => {
			activeNode = 'aa-node';

			itemAA = {
				type: 'element',
				name: 'aa',
				node: activeNode,
				attributes: [],
				children: []
			};

			itemA = {
				type: 'element',
				name: 'a',
				node: 'a-node',
				attributes: [
					[ 'foo', 'bar' ],
					[ 'qux', 'abc' ]
				],
				children: [
					itemAA
				]
			};

			itemB = {
				type: 'element',
				name: 'b',
				node: 'b-node',
				attributes: [],
				children: []
			};

			renderResult = render( <Tree
				definition={[ itemA, itemB ]}
				onClick={clickSpy}
				showCompactText={false}
				showElementTypes={false}
				activeNode={activeNode}
			/> );
		} );

		afterEach( () => {
			renderResult.unmount();
		} );

		it( 'should be rendered', () => {
			const nodes = document.querySelectorAll( '.ck-inspector-tree-node' );
			expect( nodes ).toHaveLength( 3 );

			const names = document.querySelectorAll( '.ck-inspector-tree-node__name:not(.ck-inspector-tree-node__name_close)' );
			expect( names[ 0 ] ).toHaveTextContent( 'a' );
			expect( names[ 1 ] ).toHaveTextContent( 'aa' );
			expect( names[ 2 ] ).toHaveTextContent( 'b' );
		} );

		it( 'should share tree\'s props#onClick', () => {
			const nodes = document.querySelectorAll( '.ck-inspector-tree-node' );

			fireEvent.click( nodes[ 0 ] );
			expect( clickSpy ).toHaveBeenCalled();
		} );

		it( 'should respond to tree\'s props#activeNode', () => {
			const nodes = document.querySelectorAll( '.ck-inspector-tree-node' );
			expect( nodes[ 0 ] ).not.toHaveClass( 'ck-inspector-tree-node_active' );
			expect( nodes[ 1 ] ).toHaveClass( 'ck-inspector-tree-node_active' );
		} );
	} );

	describe( 'text nodes', () => {
		let renderResult, itemA, itemAA, itemB, activeNode;

		beforeEach( () => {
			activeNode = 'aa-node';

			itemAA = {
				type: 'text',
				name: 'aa',
				node: activeNode,
				attributes: [],
				children: [],
				text: 'abc'
			};

			itemA = {
				type: 'element',
				name: 'a',
				node: 'a-node',
				attributes: [
					[ 'foo', 'bar' ],
					[ 'qux', 'abc' ]
				],
				children: [
					itemAA
				]
			};

			itemB = {
				type: 'text',
				name: 'b',
				node: 'b-node',
				attributes: [],
				children: [],
				text: 'xyz'
			};

			renderResult = render( <Tree
				definition={[ itemA, itemB ]}
				onClick={clickSpy}
				showCompactText={false}
				showElementTypes={false}
				activeNode={activeNode}
			/> );
		} );

		afterEach( () => {
			renderResult.unmount();
		} );

		it( 'should be rendered', () => {
			const elementNodes = document.querySelectorAll( '.ck-inspector-tree-node' );
			const textNodes = document.querySelectorAll( '.ck-inspector-tree-text' );

			expect( elementNodes ).toHaveLength( 1 );
			expect( textNodes ).toHaveLength( 2 );
			expect( elementNodes[ 0 ].querySelector( '.ck-inspector-tree-node__name' ) ).toHaveTextContent( 'a' );
			expect( textNodes[ 0 ] ).toHaveTextContent( '"abc"' );
			expect( textNodes[ 1 ] ).toHaveTextContent( '"xyz"' );
		} );

		it( 'should share tree\'s props#onClick', () => {
			const elementNode = document.querySelector( '.ck-inspector-tree-node' );
			const textNode = document.querySelector( '.ck-inspector-tree-text' );

			fireEvent.click( elementNode );
			expect( clickSpy ).toHaveBeenCalled();

			clickSpy.mockClear();
			fireEvent.click( textNode );
			expect( clickSpy ).toHaveBeenCalled();
		} );

		it( 'share tree\'s props#showCompactText', () => {
			const textNode = document.querySelector( '.ck-inspector-tree-text' );
			expect( textNode ).toHaveTextContent( /^"abc"$/ );

			renderResult.rerender( <Tree
				definition={[ itemA, itemB ]}
				onClick={clickSpy}
				showCompactText={true}
				showElementTypes={false}
				activeNode={activeNode}
			/> );

			expect( document.querySelector( '.ck-inspector-tree-text' ) ).toHaveTextContent( /^abc$/ );
		} );

		it( 'respond to tree\'s props#activeNode', () => {
			const elementNode = document.querySelector( '.ck-inspector-tree-node' );
			const textNodes = document.querySelectorAll( '.ck-inspector-tree-text' );
			expect( elementNode ).not.toHaveClass( 'ck-inspector-tree-node_active' );
			expect( textNodes[ 0 ] ).toHaveClass( 'ck-inspector-tree-node_active' );
		} );
	} );

	describe( 'plain text', () => {
		let renderResult, itemA;

		beforeEach( () => {
			itemA = {
				type: 'text',
				name: 'a',
				node: 'a-node',
				attributes: [
					[ 'foo', 'bar' ],
					[ 'qux', 'abc' ]
				],
				text: 'foo'
			};

			renderResult = render( <Tree
				definition={[ itemA ]}
				onClick={clickSpy}
			/> );
		} );

		afterEach( () => {
			renderResult.unmount();
		} );

		it( 'is rendered', () => {
			expect( document.querySelectorAll( '.ck-inspector-tree-text' ) ).toHaveLength( 1 );
		} );
	} );

	describe( 'comment', () => {
		let renderResult, itemA, itemAA, itemAB;

		beforeEach( () => {
			itemAA = {
				type: 'comment',
				text: 'foo'
			};
			itemAB = {
				type: 'comment',
				text: '<b>bar</b>'
			};
			itemA = {
				type: 'element',
				name: 'span',
				node: 'a-node',
				attributes: [],
				children: [
					itemAA,
					itemAB
				]
			};

			renderResult = render( <Tree definition={[ itemA ]} /> );
		} );

		afterEach( () => {
			renderResult.unmount();
		} );

		it( 'is rendered', () => {
			const comments = document.querySelectorAll( '.ck-inspector-tree-comment' );
			expect( comments ).toHaveLength( 2 );
			expect( comments[ 0 ] ).toHaveTextContent( 'foo' );
			expect( comments[ 1 ] ).toHaveTextContent( 'bar' );
		} );

		it( 'is rendered with unsafe html', () => {
			const comments = document.querySelectorAll( '.ck-inspector-tree-comment' );
			expect( comments[ 1 ].innerHTML ).toBe( '<b>bar</b>' );
		} );
	} );

	describe( 'unknown node type', () => {
		it( 'should not render anything for unknown node type', () => {
			const { container } = render( <Tree
				definition={[
					{
						type: 'element',
						name: 'a',
						node: 'a-node',
						attributes: [],
						children: [
							{ type: 'unknown', node: 'x' }
						]
					}
				]}
			/> );

			expect( container.querySelector( '.ck-inspector-tree' ) ).toBeTruthy();
			expect( container.querySelector( '.ck-inspector-tree-node' ) ).toBeTruthy();
		} );
	} );

	describe( 'attribute', () => {
		it( 'truncates values above 500 characters', () => {
			const { container } = render( <Tree
				definition={[
					{
						type: 'text',
						node: 'node',
						attributes: [
							[ 'foo', new Array( 499 ).fill( 0 ).join( '' ) ],
							[ 'bar', new Array( 500 ).fill( 0 ).join( '' ) ],
							[ 'baz', new Array( 550 ).fill( 0 ).join( '' ) ]
						],
						children: []
					}
				]}
			/> );

			const values = container.querySelectorAll( '.ck-inspector-tree-node__attribute__value' );
			expect( values[ 0 ].textContent ).toHaveLength( 499 );
			expect( values[ 1 ].textContent ).toHaveLength( 500 );
			expect( values[ 2 ].textContent.length ).toBeLessThan( 550 );
			expect( values[ 2 ].textContent ).toMatch( /characters left]$/ );
		} );
	} );
} );
