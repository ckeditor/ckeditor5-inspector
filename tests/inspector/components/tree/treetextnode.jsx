/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import TreeTextNode from '../../../../src/components/tree/treetextnode';

vi.mock( '../../../../src/components/tree/utils', () => ( {
	renderTreeNodeFromDefinition: () => null
} ) );

describe( '<TreeTextNode />', () => {
	let clickSpy;

	beforeEach( () => {
		clickSpy = vi.fn();
	} );

	it( 'is rendered', () => {
		const { container } = render( <TreeTextNode definition={{
			attributes: [],
			children: []
		}} /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree-text' );
	} );

	it( 'reacts to props#isActive', () => {
		const { container } = render( <TreeTextNode definition={{
			isActive: true,
			attributes: [],
			children: []
		}} /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector-tree-node_active' );
	} );

	it( 'executes props#onClick when clicked', () => {
		const { container } = render( <TreeTextNode definition={{
			attributes: [],
			children: []
		}} globalTreeProps={{
			onClick: clickSpy
		}} /> );

		fireEvent.click( container.firstChild );
		expect( clickSpy ).toHaveBeenCalledTimes( 1 );
	} );

	describe( 'content', () => {
		it( 'is rendered', () => {
			const { container } = render( <TreeTextNode definition={{
				name: 'foo',
				attributes: [],
				children: [
					'foo ',
					'bar'
				]
			}} /> );

			const content = container.querySelector( '.ck-inspector-tree-node__content' );
			expect( content ).toHaveClass( 'ck-inspector-tree-node__content' );
		} );

		describe( 'positions', () => {
			it( 'should be rendered before the content', () => {
				const { container } = render( <TreeTextNode definition={{
					name: 'foo',
					text: 'abc',
					positionsBefore: [
						{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null }
					]
				}} globalTreeProps={{
					showCompactText: true
				}} /> );

				const content = container.querySelector( '.ck-inspector-tree-node__content' );
				const position = content.querySelector( '.ck-inspector-tree__position_selection' );

				expect( position ).toBeTruthy();
				expect( content.firstElementChild ).toBe( position );
			} );

			it( 'should be rendered after the content', () => {
				const { container } = render( <TreeTextNode definition={{
					name: 'foo',
					text: 'abc',
					positionsAfter: [
						{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null }
					]
				}} globalTreeProps={{
					showCompactText: true
				}} /> );

				const content = container.querySelector( '.ck-inspector-tree-node__content' );
				const position = content.querySelector( '.ck-inspector-tree__position_selection' );

				expect( position ).toBeTruthy();
				expect( content.lastElementChild ).toBe( position );
			} );

			it( 'should be rendered in the middle of the content', () => {
				const { container } = render( <TreeTextNode definition={{
					name: 'foo',
					text: 'abc',
					startOffset: 0,
					positions: [
						{ offset: 2, isEnd: false, presentation: null, type: 'selection', name: null }
					]
				}} globalTreeProps={{
					showCompactText: true
				}} /> );

				const content = container.querySelector( '.ck-inspector-tree-node__content' );
				const position = content.querySelector( '.ck-inspector-tree__position_selection' );

				expect( position ).toBeTruthy();
				expect( position.previousSibling.textContent ).toBe( 'b' );
				expect( position.previousSibling.previousSibling.textContent ).toBe( 'a' );
				expect( position.nextSibling.textContent ).toBe( 'c' );
			} );
		} );

		describe( 'positions sorting', () => {
			it( 'should sort multiple positions by ascending offset', () => {
				const { container } = render( <TreeTextNode definition={{
					name: 'foo',
					text: 'abc',
					startOffset: 0,
					positions: [
						{ offset: 2, isEnd: true, presentation: null, type: 'selection', name: null },
						{ offset: 1, isEnd: false, presentation: null, type: 'selection', name: null }
					]
				}} globalTreeProps={{
					showCompactText: true
				}} /> );

				const positions = container.querySelectorAll( '.ck-inspector-tree__position' );

				expect( positions ).toHaveLength( 2 );
				expect( positions[ 0 ].previousSibling.textContent ).toBe( 'a' );
				expect( positions[ 1 ].previousSibling.textContent ).toBe( 'b' );
			} );

			it( 'should keep stable order for positions with the same offset', () => {
				const { container } = render( <TreeTextNode definition={{
					name: 'foo',
					text: 'abc',
					startOffset: 0,
					positions: [
						{ offset: 1, isEnd: false, presentation: null, type: 'selection', name: null },
						{ offset: 1, isEnd: true, presentation: null, type: 'selection', name: null }
					]
				}} globalTreeProps={{
					showCompactText: true
				}} /> );

				const positions = container.querySelectorAll( '.ck-inspector-tree__position' );

				expect( positions ).toHaveLength( 2 );
			} );
		} );

		describe( 'props#showCompactText true', () => {
			it( 'renders text only', () => {
				const { container } = render( <TreeTextNode definition={{
					name: 'foo',
					attributes: [
						[ 'a', 'b' ]
					],
					text: 'abc'
				}} globalTreeProps={{
					showCompactText: true
				}} /> );

				const content = container.querySelector( '.ck-inspector-tree-node__content' );
				expect( content ).toHaveTextContent( 'abc' );
			} );
		} );

		describe( 'props#showCompactText false', () => {
			it( 'renders text in quotes with attributes', () => {
				const { container } = render( <TreeTextNode showCompactText={false} definition={{
					name: 'foo',
					attributes: [
						[ 'a', 'b' ]
					],
					text: 'abc'
				}} globalTreeProps={{
					showCompactText: false
				}} /> );

				const content = container.querySelector( '.ck-inspector-tree-node__content' );
				const attrs = content.querySelector( '.ck-inspector-tree-text__attributes' );

				expect( attrs ).toHaveClass( 'ck-inspector-tree-text__attributes' );
				expect( attrs.querySelectorAll( '.ck-inspector-tree-node__attribute' ) ).toHaveLength( 1 );
				expect( content ).toHaveTextContent( 'ab"abc"' );
			} );

			it( 'can render attributes without values when presentation#dontRenderAttributeValue', () => {
				const { container } = render( <TreeTextNode showCompactText={false} definition={{
					name: 'foo',
					attributes: [
						[ 'a', 'b' ]
					],
					children: [ 'abc' ],
					presentation: {
						dontRenderAttributeValue: true
					}
				}} /> );

				const attrs = container.querySelector( '.ck-inspector-tree-text__attributes' );
				const attribute = attrs.querySelector( '.ck-inspector-tree-node__attribute' );

				expect( attrs ).toHaveClass( 'ck-inspector-tree-text__attributes' );
				expect( attribute.querySelector( '.ck-inspector-tree-node__attribute__value' ) ).toBeNull();
			} );
		} );
	} );
} );
