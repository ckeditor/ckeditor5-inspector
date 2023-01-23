/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
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
		wrapper = mount( <PropertyList itemDefinitions={[]} /> );

		expect( wrapper ).to.have.className( 'ck-inspector-property-list' );
		expect( wrapper ).to.have.className( 'ck-inspector-code' );
		expect( wrapper.text() ).to.equal( '' );
	} );

	it( 'renders names and values', () => {
		const definitions = {
			foo: { value: 'bar' },
			qux: { value: 'baz' }
		};

		wrapper = mount( <PropertyList itemDefinitions={definitions} name="listName" /> );

		const dt1 = wrapper.children().childAt( 0 );
		const dd1 = wrapper.children().childAt( 1 );
		const dt2 = wrapper.children().childAt( 2 );
		const dd2 = wrapper.children().childAt( 3 );

		expect( dt1.html() ).to.match(
			/<dt class="ck-inspector-property-list__title"><label for="[^-]+-foo-value-input">foo<\/label>:<\/dt>/
		);
		expect( dt2.html() ).to.match(
			/<dt class="ck-inspector-property-list__title"><label for="[^-]+-qux-value-input">qux<\/label>:<\/dt>/
		);

		expect( dd1.html() ).to.match( /<dd><input id="[^-]+-foo-value-input" type="text" readonly="" value="bar"><\/dd>/ );
		expect( dd2.html() ).to.match( /<dd><input id="[^-]+-qux-value-input" type="text" readonly="" value="baz"><\/dd>/ );

		expect( dt1.find( 'label' ) ).to.have.attr( 'for' ).equal( dd1.find( 'input' ).prop( 'id' ) );
		expect( dt2.find( 'label' ) ).to.have.attr( 'for' ).equal( dd2.find( 'input' ).prop( 'id' ) );
	} );

	it( 'renders sub-properties', () => {
		const definitions = {
			foo: {
				value: 'bar',
				subProperties: {
					'subA-name': { value: 'subA-value' },
					'subB-name': { value: 'subB-value' }
				}
			}
		};

		wrapper = mount( <PropertyList itemDefinitions={definitions} name="listName" /> );

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
				'<label for="[^-]+-foo-value-input">foo</label>:' +
			'</dt>'
		) );

		expect( dd1.html() ).to.match( /<dd><input id="[^-]+-foo-value-input" type="text" readonly="" value="bar"><\/dd>/ );
		expect( dl.props().itemDefinitions ).to.deep.equal( {
			'subA-name': { value: 'subA-value' },
			'subB-name': { value: 'subB-value' }
		} );
	} );

	it( 'toggles title class when clicked the toggler', () => {
		const definitions = {
			foo: {
				value: 'bar',
				subProperties: {
					'subA-name': { value: 'subA-value' },
					'subB-name': { value: 'subB-value' }
				}
			}
		};

		wrapper = mount( <PropertyList itemDefinitions={definitions} /> );

		const dt = wrapper.children().childAt( 0 );
		const toggler = dt.children().childAt( 0 );

		toggler.simulate( 'click' );

		expect( dt ).to.have.className( 'ck-inspector-property-list__title_expanded' );
	} );

	it( 'truncates property values to 2000 characters', () => {
		const definitions = {
			foo: { value: new Array( 1999 ).fill( 0 ).join( '' ) },
			bar: { value: new Array( 2000 ).fill( 0 ).join( '' ) },
			baz: { value: new Array( 2100 ).fill( 0 ).join( '' ) }
		};

		wrapper = mount( <PropertyList itemDefinitions={definitions} /> );

		const dd1 = wrapper.children().childAt( 1 );
		const dd2 = wrapper.children().childAt( 3 );
		const dd3 = wrapper.children().childAt( 5 );

		expect( dd1.find( 'input' ).props().value ).to.have.length( 1999 );
		expect( dd2.find( 'input' ).props().value ).to.have.length( 2000 );
		expect( dd3.find( 'input' ).props().value ).to.have.lengthOf.below( 2100 );
		expect( dd3.find( 'input' ).props().value ).to.match( /characters left]$/ );
	} );

	it( 'renders the title HTML attribute when specified', () => {
		const definitions = {
			foo: { value: 'foo', title: 'Foo title' },
			bar: { value: 'bar' }
		};

		wrapper = mount( <PropertyList itemDefinitions={definitions} /> );

		const dt1 = wrapper.children().childAt( 0 );
		const dt2 = wrapper.children().childAt( 2 );

		expect( dt1.find( 'label' ).props().title ).to.equal( 'Foo title' );
		expect( dt2.find( 'label' ).props().title ).to.be.undefined;
	} );

	describe( 'property title click handling', () => {
		it( 'does nothing if props.onPropertyTitleClick was not specified', () => {
			const definitions = {
				foo: {
					value: 'bar'
				}
			};

			wrapper = mount( <PropertyList itemDefinitions={definitions} /> );

			const dt = wrapper.children().childAt( 0 );
			const label = dt.find( 'label' );

			expect( dt ).to.not.have.className( 'ck-inspector-property-list__title_clickable' );

			expect( () => {
				label.simulate( 'click' );
			} ).to.not.throw();
		} );

		it( 'uses props.onPropertyTitleClick when a property title was clicked and passes property name to the callback', () => {
			const onClickSpy = sinon.spy();

			const definitions = {
				foo: {
					value: 'bar'
				}
			};

			wrapper = mount( <PropertyList itemDefinitions={definitions} onPropertyTitleClick={onClickSpy} /> );

			const dt = wrapper.children().childAt( 0 );
			const label = dt.find( 'label' );

			label.simulate( 'click' );
			sinon.assert.calledOnceWithExactly( onClickSpy, 'foo' );

			expect( dt ).to.have.className( 'ck-inspector-property-list__title_clickable' );
		} );
	} );
} );
