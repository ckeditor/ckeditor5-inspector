/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import PropertyList from '../../../src/components/propertylist';

describe( '<PropertyList />', () => {
	let wrapper;

	afterEach( () => {
		wrapper.unmount();
	} );

	it( 'renders', () => {
		wrapper = mount( <PropertyList items={[]} /> );

		expect( wrapper ).to.have.className( 'ck-inspector-property-list' );
		expect( wrapper ).to.have.className( 'ck-inspector-code' );
		expect( wrapper.text() ).to.equal( '' );
	} );

	it( 'renders names and values', () => {
		const items = [
			[ 'foo', 'bar' ],
			[ 'qux', 'baz' ]
		];

		wrapper = mount( <PropertyList items={items} /> );

		const dt1 = wrapper.children().childAt( 0 );
		const dd1 = wrapper.children().childAt( 1 );
		const dt2 = wrapper.children().childAt( 2 );
		const dd2 = wrapper.children().childAt( 3 );

		expect( dt1.html() ).to.match( /<dt><label for="[^-]+-foo-input">foo<\/label>:<\/dt>/ );
		expect( dt2.html() ).to.match( /<dt><label for="[^-]+-qux-input">qux<\/label>:<\/dt>/ );

		expect( dd1.html() ).to.match( /<dd><input id="[^-]+-foo-input" type="text" readonly="" value="bar"><\/dd>/ );
		expect( dd2.html() ).to.match( /<dd><input id="[^-]+-qux-input" type="text" readonly="" value="baz"><\/dd>/ );

		expect( dt1.find( 'label' ) ).to.have.attr( 'for' ).equal( dd1.find( 'input' ).prop( 'id' ) );
		expect( dt2.find( 'label' ) ).to.have.attr( 'for' ).equal( dd2.find( 'input' ).prop( 'id' ) );
	} );
} );
