/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import TreeTextNode from '../../../../src/components/tree/treetextnode';
import TreeNodeAttribute from '../../../../src/components/tree/treenodeattribute';

describe( '<TreeTextNode />', () => {
	let wrapper, clickSpy;

	beforeEach( () => {
		clickSpy = sinon.spy();
	} );

	afterEach( () => {
		wrapper.unmount();
	} );

	it( 'is rendered', () => {
		wrapper = mount( <TreeTextNode definition={{
			attributes: [],
			children: []
		}} /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree-text' );
	} );

	it( 'reacts to props#isActive', () => {
		wrapper = mount( <TreeTextNode definition={{
			isActive: true,
			attributes: [],
			children: []
		}} /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree-node_active' );
	} );

	it( 'executes props#onClick when clicked', () => {
		wrapper = mount( <TreeTextNode definition={{
			attributes: [],
			children: []
		}} globalTreeProps={{
			onClick: clickSpy
		}} /> );

		wrapper.simulate( 'click' );
		sinon.assert.calledOnce( clickSpy );
	} );

	describe( 'content', () => {
		it( 'is rendered', () => {
			wrapper = mount( <TreeTextNode definition={{
				name: 'foo',
				attributes: [],
				children: [
					'foo ',
					'bar'
				]
			}} /> );

			const content = wrapper.children().childAt( 0 );

			expect( content ).to.have.className( 'ck-inspector-tree-node__content' );
		} );

		describe( 'positions', () => {
			it( 'should be rendered before the content', () => {
				wrapper = mount( <TreeTextNode definition={{
					name: 'foo',
					text: 'abc',
					positionsBefore: [
						{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null }
					]
				}} globalTreeProps={{
					showCompactText: true
				}} /> );

				const content = wrapper.children().childAt( 0 );
				const position = content.childAt( 0 );

				expect( position.props().definition.type ).to.equal( 'selection' );
			} );

			it( 'should be rendered after the content', () => {
				wrapper = mount( <TreeTextNode definition={{
					name: 'foo',
					text: 'abc',
					positionsAfter: [
						{ offset: 0, isEnd: false, presentation: null, type: 'selection', name: null }
					]
				}} globalTreeProps={{
					showCompactText: true
				}} /> );

				const content = wrapper.children().childAt( 0 );
				const position = content.childAt( 1 );

				expect( position.props().definition.type ).to.equal( 'selection' );
			} );

			it( 'should be rendered in the middle of the content', () => {
				wrapper = mount( <TreeTextNode definition={{
					name: 'foo',
					text: 'abc',
					startOffset: 0,
					positions: [
						{ offset: 2, isEnd: false, presentation: null, type: 'selection', name: null }
					]
				}} globalTreeProps={{
					showCompactText: true
				}} /> );

				const content = wrapper.children().childAt( 0 );
				const position = content.childAt( 2 );

				expect( position.props().definition.type ).to.equal( 'selection' );
			} );
		} );

		describe( 'props#showCompactText true', () => {
			it( 'renders text only', () => {
				wrapper = mount( <TreeTextNode definition={{
					name: 'foo',
					attributes: [
						[ 'a', 'b' ]
					],
					text: 'abc'
				}} globalTreeProps={{
					showCompactText: true
				}} /> );

				const content = wrapper.children().childAt( 0 );

				expect( content.text() ).to.equal( 'abc' );
			} );
		} );

		describe( 'props#showCompactText false', () => {
			it( 'renders text in quotes with attributes', () => {
				wrapper = mount( <TreeTextNode showCompactText={false} definition={{
					name: 'foo',
					attributes: [
						[ 'a', 'b' ]
					],
					text: 'abc'
				}} globalTreeProps={{
					showCompactText: false
				}} /> );

				const content = wrapper.children().childAt( 0 );
				const attrs = content.childAt( 0 );

				expect( attrs ).to.have.className( 'ck-inspector-tree-text__attributes' );
				expect( attrs.find( TreeNodeAttribute ) ).to.have.length( 1 );
				expect( attrs.childAt( 0 ).props().name ).to.equal( 'a' );
				expect( attrs.childAt( 0 ).props().value ).to.equal( 'b' );
				expect( content.text() ).to.equal( 'ab"abc"' );
			} );

			it( 'can render attributes without values when presentation#dontRenderAttributeValue', () => {
				wrapper = mount( <TreeTextNode showCompactText={false} definition={{
					name: 'foo',
					attributes: [
						[ 'a', 'b' ]
					],
					children: [ 'abc' ],
					presentation: {
						dontRenderAttributeValue: true
					}
				}} /> );

				const content = wrapper.children().childAt( 0 );
				const attrs = content.childAt( 0 );

				expect( attrs ).to.have.className( 'ck-inspector-tree-text__attributes' );
				expect( attrs.find( TreeNodeAttribute ) ).to.have.length( 1 );
				expect( attrs.find( TreeNodeAttribute ).props().dontRenderValue ).to.be.true;
			} );
		} );
	} );
} );
