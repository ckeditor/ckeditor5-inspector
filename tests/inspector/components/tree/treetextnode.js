/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import TreeTextNode from '../../../../src/components/tree/treetextnode';

describe( '<TreeTextNode />', () => {
	let clickSpy;

	beforeEach( () => {
		clickSpy = vi.fn();
	} );

	const getMeaningfulNodes = element => Array.from( element.childNodes ).filter( node => {
		if ( node.nodeType === 1 ) {
			return true;
		}

		return node.nodeType === 3 && node.textContent.trim() !== '';
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
				const nodes = getMeaningfulNodes( content );
				expect( nodes[ 0 ] ).toHaveClass( 'ck-inspector-tree__position_selection' );
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
				const nodes = getMeaningfulNodes( content );
				expect( nodes[ nodes.length - 1 ] ).toHaveClass( 'ck-inspector-tree__position_selection' );
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
				const nodes = getMeaningfulNodes( content );
				const positionIndex = nodes.findIndex( node => {
					return node.nodeType === 1 && node.classList.contains( 'ck-inspector-tree__position_selection' );
				} );
				const textBefore = nodes.slice( 0, positionIndex ).map( node => node.textContent ).join( '' );
				const textAfter = nodes.slice( positionIndex + 1 ).map( node => node.textContent ).join( '' );

				expect( positionIndex ).toBeGreaterThan( 0 );
				expect( positionIndex ).toBeLessThan( nodes.length - 1 );
				expect( textBefore ).toBe( 'ab' );
				expect( textAfter ).toBe( 'c' );
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
