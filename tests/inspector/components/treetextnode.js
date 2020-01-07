/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import {
	TreeTextNode,
	TreeNodeAttribute
} from '../../../src/components/tree';

describe( '<TreeTextNode />', () => {
	let wrapper, clickSpy;

	beforeEach( () => {
		clickSpy = sinon.spy();
	} );

	afterEach( () => {
		wrapper.unmount();
	} );

	it( 'is rendered', () => {
		wrapper = mount( <TreeTextNode item={{
			attributes: [],
			children: []
		}} /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree-text' );
	} );

	it( 'reacts to props#isActive', () => {
		wrapper = mount( <TreeTextNode item={{
			isActive: true,
			attributes: [],
			children: []
		}} /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree-node_active' );
	} );

	it( 'executes props#onClick when clicked', () => {
		wrapper = mount( <TreeTextNode onClick={clickSpy} item={{
			attributes: [],
			children: []
		}} /> );

		wrapper.simulate( 'click' );
		sinon.assert.calledOnce( clickSpy );
	} );

	describe( 'content', () => {
		it( 'is rendered', () => {
			wrapper = mount( <TreeTextNode item={{
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

		describe( 'props#showCompactText true', () => {
			it( 'renders text only', () => {
				wrapper = mount( <TreeTextNode showCompactText={true} item={{
					name: 'foo',
					attributes: [
						[ 'a', 'b' ]
					],
					children: [ 'abc' ]
				}} /> );

				const content = wrapper.children().childAt( 0 );

				expect( content.text() ).to.equal( 'abc' );
			} );
		} );

		describe( 'props#showCompactText false', () => {
			it( 'renders text in quotes with attributes', () => {
				wrapper = mount( <TreeTextNode showCompactText={false} item={{
					name: 'foo',
					attributes: [
						[ 'a', 'b' ]
					],
					children: [ 'abc' ]
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
				wrapper = mount( <TreeTextNode showCompactText={false} item={{
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
