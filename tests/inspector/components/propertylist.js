/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
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

		expect( dt1.html() ).to.match( /<dt class="ck-inspector-property-list__title"><label for="[^-]+-foo-input">foo<\/label>:<\/dt>/ );
		expect( dt2.html() ).to.match( /<dt class="ck-inspector-property-list__title"><label for="[^-]+-qux-input">qux<\/label>:<\/dt>/ );

		expect( dd1.html() ).to.match( /<dd><input id="[^-]+-foo-input" type="text" readonly="" value="bar"><\/dd>/ );
		expect( dd2.html() ).to.match( /<dd><input id="[^-]+-qux-input" type="text" readonly="" value="baz"><\/dd>/ );

		expect( dt1.find( 'label' ) ).to.have.attr( 'for' ).equal( dd1.find( 'input' ).prop( 'id' ) );
		expect( dt2.find( 'label' ) ).to.have.attr( 'for' ).equal( dd2.find( 'input' ).prop( 'id' ) );
	} );

	it( 'renders sub-properties', () => {
		const items = [
			[ 'foo', 'bar', [ [ 'subA-name', 'subA-value' ], [ 'subB-name', 'subB-value' ] ] ],
		];

		wrapper = mount( <PropertyList items={items} /> );

		const dt1 = wrapper.children().childAt( 0 );
		const dd1 = wrapper.children().childAt( 1 );
		const dl = wrapper.children().childAt( 2 );

		expect( dt1.html() ).to.match( new RegExp(
			'<dt class="' +
				'ck-inspector-property-list__title ' +
				'ck-inspector-property-list__title_collapsible ' +
				'ck-inspector-property-list__title_collapsed' +
			'">' +
				'<button type="button">Toggle</button>' +
				'<label for="[^-]+-foo-input">foo</label>:' +
			'</dt>'
		) );

		expect( dd1.html() ).to.match( /<dd><input id="[^-]+-foo-input" type="text" readonly="" value="bar"><\/dd>/ );
		expect( dl.props().items ).to.have.deep.members( [ [ 'subA-name', 'subA-value' ], [ 'subB-name', 'subB-value' ] ] );
	} );

	it( 'toggles title class when clicked the toggler', () => {
		const items = [
			[ 'foo', 'bar', [ [ 'subA-name', 'subA-value' ], [ 'subB-name', 'subB-value' ] ] ],
		];

		wrapper = mount( <PropertyList items={items} /> );

		const dt = wrapper.children().childAt( 0 );
		const toggler = dt.children().childAt( 0 );

		toggler.simulate( 'click' );

		expect( dt ).to.have.className( 'ck-inspector-property-list__title_expanded' );
	} );

	it( 'truncates property values to 2000 characters', () => {
		const items = [
			[ 'foo', new Array( 1999 ).fill( 0 ).join( '' ) ],
			[ 'bar', new Array( 2000 ).fill( 0 ).join( '' ) ],
			[ 'baz', new Array( 2100 ).fill( 0 ).join( '' ) ]
		];

		wrapper = mount( <PropertyList items={items} /> );

		const dd1 = wrapper.children().childAt( 1 );
		const dd2 = wrapper.children().childAt( 3 );
		const dd3 = wrapper.children().childAt( 5 );

		expect( dd1.find( 'input' ).props().value ).to.have.length( 1999 );
		expect( dd2.find( 'input' ).props().value ).to.have.length( 2000 );
		expect( dd3.find( 'input' ).props().value ).to.have.lengthOf.below( 2100 );
		expect( dd3.find( 'input' ).props().value ).to.match( /characters left]$/ );
	} );
} );
