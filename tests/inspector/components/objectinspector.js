/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
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
					itemDefinitions: {}
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
					itemDefinitions: {
						foo: { value: 'bar' },
						qux: { value: 'baz' }
					}
				}
			]} /> );

			expect( wrapper.find( 'hr' ) ).to.have.length( 1 );
			expect( wrapper.find( 'h3' ).text() ).to.equal( 'foo' );
			expect( wrapper.find( PropertyList ).props().itemDefinitions ).to.deep.equal( {
				foo: { value: 'bar' },
				qux: { value: 'baz' }
			} );
		} );

		it( 'passes a "onPropertyTitleClick" handler to <PropertyList />', () => {
			const onClickMock = sinon.spy();

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
					itemDefinitions: {
						foo: { value: 'bar' },
						qux: { value: 'baz' }
					},
					onPropertyTitleClick: onClickMock
				}
			]} /> );

			expect( wrapper.find( PropertyList ).props().onPropertyTitleClick ).to.equal( onClickMock );
		} );

		it( 'passes a "presentation" data to <PropertyList />', () => {
			const presentationMock = {};

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
					itemDefinitions: {
						foo: { value: 'bar' },
						qux: { value: 'baz' }
					},
					presentation: presentationMock
				}
			]} /> );

			expect( wrapper.find( PropertyList ).props().presentation ).to.equal( presentationMock );
		} );
	} );
} );
