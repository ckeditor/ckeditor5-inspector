/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import ObjectInspector from '../../../src/components/objectinspector';
import PropertyList from '../../../src/components/propertylist';

describe( '<ObjectInspector />', () => {
	let wrapper;

	afterEach( () => {
		wrapper.unmount();
	} );

	it( 'renders', () => {
		wrapper = mount( <ObjectInspector lists={[]} /> );

		expect( wrapper ).to.have.className( 'ck-inspector__object-inspector' );
	} );

	it( 'renders props#header', () => {
		wrapper = mount( <ObjectInspector lists={[]} header="foo" /> );

		expect( wrapper.find( 'h2' ) ).to.have.className( 'ck-inspector-code' );
	} );

	describe( 'props#lists', () => {
		it( 'does not render when there are no items', () => {
			wrapper = mount( <ObjectInspector lists={[
				{
					name: 'foo',
					url: 'http://bar',
					buttons: [
						{
							type: 'log',
							label: 'ABC'
						}
					],
					items: []
				}
			]} /> );

			expect( wrapper.find( PropertyList ) ).to.have.length( 0 );
		} );

		it( 'renders a <PropertyList /> when there are items', () => {
			wrapper = mount( <ObjectInspector lists={[
				{
					name: 'foo',
					url: 'http://bar',
					buttons: [
						{
							type: 'log',
							label: 'ABC'
						}
					],
					items: [
						[ 'foo', 'bar' ],
						[ 'qux', 'baz' ]
					]
				}
			]} /> );

			expect( wrapper.find( 'hr' ) ).to.have.length( 1 );
			expect( wrapper.find( 'h3' ).text() ).to.equal( 'foo' );
			expect( wrapper.find( PropertyList ).props().items ).to.deep.equal( [
				[ 'foo', 'bar' ],
				[ 'qux', 'baz' ]
			] );
		} );
	} );
} );
