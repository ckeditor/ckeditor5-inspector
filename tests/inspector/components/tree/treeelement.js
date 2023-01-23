/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import TreeElement from '../../../../src/components/tree/treeelement';
import TreeNodeAttribute from '../../../../src/components/tree/treenodeattribute';

describe( '<TreeElement />', () => {
	let wrapper, clickSpy;

	beforeEach( () => {
		clickSpy = sinon.spy();
	} );

	afterEach( () => {
		wrapper.unmount();
	} );

	it( 'is rendered', () => {
		wrapper = mount( <TreeElement definition={{
			name: 'foo',
			attributes: [],
			children: []
		}} /> );

		expect( wrapper ).to.have.className( 'ck-inspector-code' );
		expect( wrapper ).to.have.className( 'ck-inspector-tree-node' );
	} );

	it( 'reacts to props#isActive', () => {
		wrapper = mount( <TreeElement definition={{
			name: 'foo',
			isActive: true,
			attributes: [],
			children: []
		}} /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree-node_active' );
	} );

	it( 'reacts to props.presentation#isEmpty', () => {
		wrapper = mount( <TreeElement definition={{
			name: 'foo',
			attributes: [],
			presentation: {
				isEmpty: true
			},
			children: []
		}} /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree-node_empty' );
	} );

	it( 'reacts to props.presentation#cssClass', () => {
		wrapper = mount( <TreeElement definition={{
			name: 'foo',
			attributes: [],
			presentation: {
				cssClass: 'bar'
			},
			children: []
		}} /> );

		expect( wrapper ).to.have.className( 'bar' );
	} );

	it( 'executes props#onClick when clicked', () => {
		wrapper = mount( <TreeElement definition={{
			name: 'foo',
			isActive: true,
			attributes: [],
			children: []
		}} globalTreeProps={{
			onClick: clickSpy
		}} /> );

		wrapper.simulate( 'click' );
		sinon.assert.calledOnce( clickSpy );
	} );

	describe( 'name', () => {
		it( 'is rendered', () => {
			wrapper = mount( <TreeElement definition={{
				name: 'foo',
				attributes: [],
				children: []
			}} /> );

			const name = wrapper.children().childAt( 0 );

			expect( name ).to.have.className( 'ck-inspector-tree-node__name' );
		} );

		it( 'comes with attributes', () => {
			wrapper = mount( <TreeElement definition={{
				name: 'foo',
				attributes: [
					[ 'a', 'b' ],
					[ 'c', 'd' ]
				],
				children: []
			}} /> );

			const name = wrapper.children().childAt( 0 );
			const firstAt = wrapper.find( TreeNodeAttribute ).first();
			const secondAt = wrapper.find( TreeNodeAttribute ).last();

			expect( name.find( TreeNodeAttribute ) ).to.have.length( 2 );
			expect( firstAt.props().name ).to.equal( 'a' );
			expect( firstAt.props().value ).to.equal( 'b' );
			expect( secondAt.props().name ).to.equal( 'c' );
			expect( secondAt.props().value ).to.equal( 'd' );
		} );

		it( 'should support #showElementTypes', () => {
			wrapper = mount( <TreeElement definition={{
				name: 'foo',
				elementType: 'some',
				attributes: [],
				children: []
			}} globalTreeProps={{
				showElementTypes: true
			}} /> );

			const name = wrapper.children().childAt( 0 );

			expect( name.text() ).to.equal( 'some:foo' );
		} );
	} );

	describe( 'content', () => {
		it( 'is rendered', () => {
			wrapper = mount( <TreeElement definition={{
				name: 'foo',
				attributes: [],
				children: []
			}} /> );

			const content = wrapper.children().childAt( 1 );

			expect( content ).to.have.className( 'ck-inspector-tree-node__content' );
		} );

		it( 'comes with children', () => {
			wrapper = mount( <TreeElement definition={{
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

			const content = wrapper.children().childAt( 1 );

			expect( content.childAt( 0 ).text() ).to.equal( '"abc"' );
		} );
	} );

	describe( 'closing tag', () => {
		it( 'is rendered by default', () => {
			wrapper = mount( <TreeElement definition={{
				name: 'foo',
				attributes: [],
				children: []
			}} /> );

			expect( wrapper.find( '.ck-inspector-tree-node__name' ) ).to.have.length( 2 );

			const closing = wrapper.children().childAt( 2 );

			expect( closing ).to.have.className( 'ck-inspector-tree-node__name' );
			expect( closing.text() ).to.equal( '/foo' );
		} );

		it( 'is not rendered when props.presentation#isEmpty', () => {
			wrapper = mount( <TreeElement definition={{
				name: 'foo',
				attributes: [],
				children: [],
				presentation: {
					isEmpty: true
				}
			}} /> );

			expect( wrapper.find( '.ck-inspector-tree-node__name' ) ).to.have.length( 1 );
		} );

		it( 'should support #showElementTypes', () => {
			wrapper = mount( <TreeElement definition={{
				name: 'foo',
				elementType: 'some',
				attributes: [],
				children: []
			}} globalTreeProps={{
				showElementTypes: true
			}} /> );

			const closing = wrapper.children().childAt( 2 );

			expect( closing.text() ).to.equal( '/some:foo' );
		} );
	} );
} );
