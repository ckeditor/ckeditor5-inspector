/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import Tree from '../../../../src/components/tree/tree';
import TreeTextNode from '../../../../src/components/tree/treetextnode';
import TreeElement from '../../../../src/components/tree/treeelement';
import TreeComment from '../../../../src/components/tree/treecomment';
import TreeNodeAttribute from '../../../../src/components/tree/treenodeattribute';

describe( '<Tree />', () => {
	let wrapper, clickSpy;

	beforeEach( () => {
		clickSpy = sinon.spy();
	} );

	it( 'should render a tree', () => {
		wrapper = mount( <Tree /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree' );
		expect( wrapper.text() ).to.equal( 'Nothing to show.' );

		wrapper.unmount();
	} );

	it( 'supports text direction', () => {
		wrapper = mount( <Tree textDirection="rtl" /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree_text-direction_rtl' );

		wrapper.unmount();
	} );

	describe( 'elements', () => {
		let wrapper, itemA, itemAA, itemB, activeNode;

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

			wrapper = mount( <Tree
				definition={[ itemA, itemB ]}
				onClick={clickSpy}
				showCompactText={false}
				showElementTypes={false}
				activeNode={activeNode}
			/> );
		} );

		afterEach( () => {
			wrapper.unmount();
		} );

		it( 'should be rendered', () => {
			expect( wrapper.find( TreeElement ).length ).to.equal( 3 );

			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeElement );
			const childB = wrapper.children().childAt( 1 );

			expect( childA.type() ).to.equal( TreeElement );
			expect( childAA.type() ).to.equal( TreeElement );
			expect( childB.type() ).to.equal( TreeElement );

			expect( childA.props().definition ).to.equal( itemA );
			expect( childAA.props().definition ).to.equal( itemAA );
			expect( childB.props().definition ).to.equal( itemB );
		} );

		it( 'should share tree\'s props#onClick', () => {
			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeElement );

			expect( childA.find( 'div' ).first().props().onClick ).to.equal( childA.instance().handleClick );
			expect( childAA.find( 'div' ).first().props().onClick ).to.equal( childAA.instance().handleClick );

			childA.instance().handleClick();

			sinon.assert.calledOnce( clickSpy );
		} );

		it( 'should respond to tree\'s props#activeNode', () => {
			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeElement );

			expect( childA ).to.not.have.className( 'ck-inspector-tree-node_active' );
			expect( childAA ).to.have.className( 'ck-inspector-tree-node_active' );
		} );
	} );

	describe( 'text nodes', () => {
		let wrapper, itemA, itemAA, itemB, activeNode;

		beforeEach( () => {
			activeNode = 'aa-node';

			itemAA = {
				type: 'text',
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
				type: 'text',
				name: 'b',
				node: 'b-node',
				attributes: [],
				children: []
			};

			wrapper = mount( <Tree
				definition={[ itemA, itemB ]}
				onClick={clickSpy}
				showCompactText={false}
				showElementTypes={false}
				activeNode={activeNode}
			/> );
		} );

		afterEach( () => {
			wrapper.unmount();
		} );

		it( 'should be rendered', () => {
			expect( wrapper.find( TreeElement ).length ).to.equal( 1 );
			expect( wrapper.find( TreeTextNode ).length ).to.equal( 2 );

			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeTextNode );
			const childB = wrapper.children().childAt( 1 );

			expect( childA.type() ).to.equal( TreeElement );
			expect( childAA.type() ).to.equal( TreeTextNode );
			expect( childB.type() ).to.equal( TreeTextNode );

			expect( childA.props().definition ).to.equal( itemA );
			expect( childAA.props().definition ).to.equal( itemAA );
			expect( childB.props().definition ).to.equal( itemB );
		} );

		it( 'should share tree\'s props#onClick', () => {
			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeTextNode );

			childA.instance().handleClick();
			childAA.instance().handleClick();

			sinon.assert.calledTwice( clickSpy );
		} );

		it( 'share tree\'s props#showCompactText', () => {
			let childA = wrapper.children().childAt( 0 );
			let childAA = wrapper.children().childAt( 0 ).children().find( TreeTextNode );

			expect( childA.props().globalTreeProps.showCompactText ).to.be.false;
			expect( childAA.props().globalTreeProps.showCompactText ).to.be.false;

			wrapper.setProps( { showCompactText: true } );

			childA = wrapper.children().childAt( 0 );
			childAA = wrapper.children().childAt( 0 ).children().find( TreeTextNode );

			expect( childA.props().globalTreeProps.showCompactText ).to.be.true;
			expect( childAA.props().globalTreeProps.showCompactText ).to.be.true;
		} );

		it( 'respond to tree\'s props#activeNode', () => {
			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeTextNode );

			expect( childA ).to.not.have.className( 'ck-inspector-tree-node_active' );
			expect( childAA ).to.have.className( 'ck-inspector-tree-node_active' );
		} );
	} );

	describe( 'plain text', () => {
		let wrapper, itemA;

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

			wrapper = mount( <Tree
				definition={[ itemA ]}
				onClick={clickSpy}
			/> );
		} );

		afterEach( () => {
			wrapper.unmount();
		} );

		it( 'is rendered', () => {
			expect( wrapper.find( TreeTextNode ).length ).to.equal( 1 );
		} );
	} );

	describe( 'comment', () => {
		let wrapper, itemA, itemAA, itemAB;

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

			wrapper = mount( <Tree definition={[ itemA ]} /> );
		} );

		afterEach( () => {
			wrapper.unmount();
		} );

		it( 'is rendered', () => {
			expect( wrapper.find( TreeComment ).length ).to.equal( 2 );

			const childAA = wrapper.children().childAt( 0 ).children().find( TreeComment ).first();
			const childAB = wrapper.children().childAt( 0 ).children().find( TreeComment ).last();

			expect( childAA.type() ).to.equal( TreeComment );
			expect( childAB.type() ).to.equal( TreeComment );

			expect( childAA.props().definition ).to.equal( itemAA );
			expect( childAB.props().definition ).to.equal( itemAB );
		} );

		it( 'is rendered with unsafe html', () => {
			const childAB = wrapper.children().childAt( 0 ).children().find( TreeComment ).last();

			expect( childAB.html() ).to.equal( '<span class="ck-inspector-tree-comment"><b>bar</b></span>' );
		} );
	} );

	describe( 'attribute', () => {
		it( 'truncates values above 500 characters', () => {
			const wrapper = mount( <Tree
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

			const firstAttribute = wrapper.children().find( TreeNodeAttribute ).first();
			const secondAttribute = wrapper.children().find( TreeNodeAttribute ).at( 1 );
			const thirdAttribute = wrapper.children().find( TreeNodeAttribute ).last();

			expect( firstAttribute.childAt( 0 ).childAt( 1 ).text() ).to.have.length( 499 );
			expect( secondAttribute.childAt( 0 ).childAt( 1 ).text() ).to.have.length( 500 );
			expect( thirdAttribute.childAt( 0 ).childAt( 1 ).text() ).to.have.lengthOf.below( 550 );
			expect( thirdAttribute.childAt( 0 ).childAt( 1 ).text() ).to.match( /characters left]$/ );

			wrapper.unmount();
		} );
	} );
} );
