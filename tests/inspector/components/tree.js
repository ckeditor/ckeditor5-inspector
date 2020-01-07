/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import Tree, {
	TreeTextNode,
	TreePlainText,
	TreeSelection,
	TreeElement,
	TreeComment,
	TreeNodeAttribute
} from '../../../src/components/tree';

describe( '<Tree />', () => {
	let wrapper, clickSpy;

	beforeEach( () => {
		clickSpy = sinon.spy();
	} );

	it( 'renders tree', () => {
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

			const items = [
				itemA,
				itemB
			];

			wrapper = mount( <Tree
				items={items}
				onClick={clickSpy}
				showCompactText={false}
				activeNode={activeNode}
			/> );
		} );

		afterEach( () => {
			wrapper.unmount();
		} );

		it( 'are rendered', () => {
			expect( wrapper.find( TreeElement ).length ).to.equal( 3 );

			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeElement );
			const childB = wrapper.children().childAt( 1 );

			expect( childA.type() ).to.equal( TreeElement );
			expect( childAA.type() ).to.equal( TreeElement );
			expect( childB.type() ).to.equal( TreeElement );

			expect( childA.props().item ).to.equal( itemA );
			expect( childAA.props().item ).to.equal( itemAA );
			expect( childB.props().item ).to.equal( itemB );
		} );

		it( 'share props#onClick', () => {
			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeElement );

			expect( childA.props().onClick ).to.equal( clickSpy );
			expect( childAA.props().onClick ).to.equal( clickSpy );
		} );

		it( 'share tree\'s props#showCompactText', () => {
			let childA = wrapper.children().childAt( 0 );
			let childAA = wrapper.children().childAt( 0 ).children().find( TreeElement );

			expect( childA.props().showCompactText ).to.be.false;
			expect( childAA.props().showCompactText ).to.be.false;

			wrapper.setProps( { showCompactText: true } );

			childA = wrapper.children().childAt( 0 );
			childAA = wrapper.children().childAt( 0 ).children().find( TreeElement );

			expect( childA.props().showCompactText ).to.be.true;
			expect( childAA.props().showCompactText ).to.be.true;
		} );

		it( 'respond to tree\'s props#activeNode', () => {
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
				items={[
					itemA,
					itemB
				]}
				onClick={clickSpy}
				showCompactText={false}
				activeNode={activeNode}
			/> );
		} );

		afterEach( () => {
			wrapper.unmount();
		} );

		it( 'are rendered', () => {
			expect( wrapper.find( TreeElement ).length ).to.equal( 1 );
			expect( wrapper.find( TreeTextNode ).length ).to.equal( 2 );

			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeTextNode );
			const childB = wrapper.children().childAt( 1 );

			expect( childA.type() ).to.equal( TreeElement );
			expect( childAA.type() ).to.equal( TreeTextNode );
			expect( childB.type() ).to.equal( TreeTextNode );

			expect( childA.props().item ).to.equal( itemA );
			expect( childAA.props().item ).to.equal( itemAA );
			expect( childB.props().item ).to.equal( itemB );
		} );

		it( 'share props#onClick', () => {
			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeTextNode );

			expect( childA.props().onClick ).to.equal( clickSpy );
			expect( childAA.props().onClick ).to.equal( clickSpy );
		} );

		it( 'share tree\'s props#showCompactText', () => {
			let childA = wrapper.children().childAt( 0 );
			let childAA = wrapper.children().childAt( 0 ).children().find( TreeTextNode );

			expect( childA.props().showCompactText ).to.be.false;
			expect( childAA.props().showCompactText ).to.be.false;

			wrapper.setProps( { showCompactText: true } );

			childA = wrapper.children().childAt( 0 );
			childAA = wrapper.children().childAt( 0 ).children().find( TreeTextNode );

			expect( childA.props().showCompactText ).to.be.true;
			expect( childAA.props().showCompactText ).to.be.true;
		} );

		it( 'respond to tree\'s props#activeNode', () => {
			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreeTextNode );

			expect( childA ).to.not.have.className( 'ck-inspector-tree-node_active' );
			expect( childAA ).to.have.className( 'ck-inspector-tree-node_active' );
		} );
	} );

	describe( 'plain text', () => {
		let wrapper, itemA, itemAA, itemAB;

		beforeEach( () => {
			itemAA = 'some text';
			itemAB = 'other text';
			itemA = {
				type: 'text',
				name: 'a',
				node: 'a-node',
				attributes: [
					[ 'foo', 'bar' ],
					[ 'qux', 'abc' ]
				],
				children: [
					itemAA,
					itemAB
				]
			};

			wrapper = mount( <Tree
				items={[ itemA ]}
				onClick={clickSpy}
			/> );
		} );

		afterEach( () => {
			wrapper.unmount();
		} );

		it( 'is rendered', () => {
			expect( wrapper.find( TreeTextNode ).length ).to.equal( 1 );
			expect( wrapper.find( TreePlainText ).length ).to.equal( 2 );

			const childA = wrapper.children().childAt( 0 );
			const childAA = wrapper.children().childAt( 0 ).children().find( TreePlainText ).first();
			const childAB = wrapper.children().childAt( 0 ).children().find( TreePlainText ).last();

			expect( childA.type() ).to.equal( TreeTextNode );
			expect( childAA.type() ).to.equal( TreePlainText );
			expect( childAB.type() ).to.equal( TreePlainText );

			expect( childA.props().item ).to.equal( itemA );
			expect( childAA.props().text ).to.equal( itemAA );
			expect( childAB.props().text ).to.equal( itemAB );
		} );
	} );

	describe( 'selection', () => {
		let wrapper, itemA, itemAA, itemAB, itemAC, itemAD;

		beforeEach( () => {
			itemAA = 'some';
			itemAB = {
				type: 'selection'
			};
			itemAC = 'text';
			itemAD = {
				type: 'selection',
				isEnd: true
			};
			itemA = {
				type: 'text',
				name: 'a',
				node: 'a-node',
				attributes: [],
				children: [
					itemAA,
					itemAB,
					itemAC,
					itemAD,
				]
			};

			wrapper = mount( <Tree
				items={[ itemA ]}
				onClick={clickSpy}
			/> );
		} );

		afterEach( () => {
			wrapper.unmount();
		} );

		it( 'is rendered', () => {
			expect( wrapper.find( TreeSelection ).length ).to.equal( 2 );

			const selStart = wrapper.children().childAt( 0 ).children().find( TreeSelection ).first();
			const selEnd = wrapper.children().childAt( 0 ).children().find( TreeSelection ).last();

			expect( selStart.type() ).to.equal( TreeSelection );
			expect( selEnd.type() ).to.equal( TreeSelection );

			expect( selStart.props().isEnd ).to.be.undefined;
			expect( selEnd.props().isEnd ).to.be.true;

			expect( wrapper.children().childAt( 0 ).text() ).to.equal( '"some[text]"' );
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

			wrapper = mount( <Tree items={[ itemA ]} /> );
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

			expect( childAA.props().item ).to.equal( itemAA );
			expect( childAB.props().item ).to.equal( itemAB );
		} );

		it( 'is rendered with unsafe html', () => {
			const childAB = wrapper.children().childAt( 0 ).children().find( TreeComment ).last();

			expect( childAB.html() ).to.equal( '<span class="ck-inspector-tree-comment"><b>bar</b></span>' );
		} );
	} );

	describe( 'attribute', () => {
		it( 'truncates values above 500 characters', () => {
			const wrapper = mount( <Tree
				items={[
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
