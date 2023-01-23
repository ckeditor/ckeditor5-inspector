/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import TreeNodeAttribute from '../../../../src/components/tree/treenodeattribute';

describe( '<TreeNodeAttribute />', () => {
	let wrapper;

	afterEach( () => {
		wrapper.unmount();
	} );

	it( 'is rendered', () => {
		wrapper = mount( <TreeNodeAttribute name="foo" value="bar" /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree-node__attribute' );
		expect( wrapper.children().children() ).to.have.length( 2 );
	} );

	describe( 'name', () => {
		it( 'is rendered', () => {
			wrapper = mount( <TreeNodeAttribute name="foo" value="bar" /> );

			const name = wrapper.children().childAt( 0 );

			expect( name ).to.have.className( 'ck-inspector-tree-node__attribute__name' );
			expect( name ).to.have.attr( 'title', 'bar' );
		} );
	} );

	describe( 'value', () => {
		it( 'is rendered', () => {
			wrapper = mount( <TreeNodeAttribute name="foo" value="bar" /> );

			const value = wrapper.children().childAt( 1 );

			expect( value ).to.have.className( 'ck-inspector-tree-node__attribute__value' );
			expect( value.text() ).to.equal( 'bar' );
		} );

		it( 'is not rendered when props#dontRenderValue is true', () => {
			wrapper = mount( <TreeNodeAttribute name="foo" value="bar" dontRenderValue="true" /> );

			expect( wrapper.children() ).to.have.length( 1 );
		} );
	} );
} );
