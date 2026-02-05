/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import PropertyList from '../../../src/components/propertylist';

describe( '<PropertyList />', () => {
	it( 'renders', () => {
		const { container } = render( <PropertyList itemDefinitions={[]} /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector-property-list' );
		expect( container.firstChild ).toHaveClass( 'ck-inspector-code' );
		expect( container.textContent ).toBe( '' );
	} );

	it( 'renders names and values', () => {
		const definitions = {
			foo: { value: 'bar' },
			qux: { value: 'baz' }
		};

		const { getByLabelText, container } = render( <PropertyList itemDefinitions={definitions} name="listName" /> );

		const fooInput = getByLabelText( 'foo' );
		const quxInput = getByLabelText( 'qux' );

		expect( fooInput ).toHaveAttribute( 'id', expect.stringMatching( /listName-foo-value-input/ ) );
		expect( quxInput ).toHaveAttribute( 'id', expect.stringMatching( /listName-qux-value-input/ ) );
		expect( fooInput ).toHaveValue( 'bar' );
		expect( quxInput ).toHaveValue( 'baz' );

		const fooLabel = container.querySelector( `label[for="${ fooInput.id }"]` );
		const quxLabel = container.querySelector( `label[for="${ quxInput.id }"]` );
		expect( fooLabel ).toBeTruthy();
		expect( quxLabel ).toBeTruthy();
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

		const { container, getByLabelText } = render( <PropertyList itemDefinitions={definitions} name="listName" /> );

		const title = container.querySelector( '.ck-inspector-property-list__title_collapsible' );
		expect( title ).toHaveClass( 'ck-inspector-property-list__title_collapsed' );
		expect( title.querySelector( 'button' ) ).toHaveTextContent( 'Toggle' );

		expect( getByLabelText( 'foo' ) ).toHaveValue( 'bar' );
		expect( getByLabelText( 'subA-name' ) ).toHaveValue( 'subA-value' );
		expect( getByLabelText( 'subB-name' ) ).toHaveValue( 'subB-value' );
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

		const { container, getByRole } = render( <PropertyList itemDefinitions={definitions} /> );

		const title = container.querySelector( '.ck-inspector-property-list__title_collapsible' );
		fireEvent.click( getByRole( 'button', { name: 'Toggle' } ) );
		expect( title ).toHaveClass( 'ck-inspector-property-list__title_expanded' );
	} );

	it( 'truncates property values to 2000 characters', () => {
		const definitions = {
			foo: { value: new Array( 1999 ).fill( 0 ).join( '' ) },
			bar: { value: new Array( 2000 ).fill( 0 ).join( '' ) },
			baz: { value: new Array( 2100 ).fill( 0 ).join( '' ) }
		};

		const { getByLabelText } = render( <PropertyList itemDefinitions={definitions} /> );

		const fooValue = getByLabelText( 'foo' ).value;
		const barValue = getByLabelText( 'bar' ).value;
		const bazValue = getByLabelText( 'baz' ).value;

		expect( fooValue ).toHaveLength( 1999 );
		expect( barValue ).toHaveLength( 2000 );
		expect( bazValue.length ).toBeLessThan( 2100 );
		expect( bazValue ).toMatch( /characters left]$/ );
	} );

	it( 'renders the title HTML attribute when specified', () => {
		const definitions = {
			foo: { value: 'foo', title: 'Foo title' },
			bar: { value: 'bar' }
		};

		const { getByText } = render( <PropertyList itemDefinitions={definitions} /> );

		expect( getByText( 'foo', { selector: 'label' } ) ).toHaveAttribute( 'title', 'Foo title' );
		expect( getByText( 'bar', { selector: 'label' } ) ).not.toHaveAttribute( 'title' );
	} );

	describe( 'property title click handling', () => {
		it( 'does nothing if props.onPropertyTitleClick was not specified', () => {
			const definitions = {
				foo: {
					value: 'bar'
				}
			};

			const { container, getByText } = render( <PropertyList itemDefinitions={definitions} /> );

			const title = container.querySelector( '.ck-inspector-property-list__title' );
			const label = getByText( 'foo', { selector: 'label' } );

			expect( title ).not.toHaveClass( 'ck-inspector-property-list__title_clickable' );
			expect( () => {
				fireEvent.click( label );
			} ).not.toThrow();
		} );

		it( 'uses props.onPropertyTitleClick when a property title was clicked and passes property name to the callback', () => {
			const onClickSpy = vi.fn();

			const definitions = {
				foo: {
					value: 'bar'
				}
			};

			const { container, getByText } = render( <PropertyList itemDefinitions={definitions} onPropertyTitleClick={onClickSpy} /> );

			const label = getByText( 'foo', { selector: 'label' } );
			const title = container.querySelector( '.ck-inspector-property-list__title' );

			fireEvent.click( label );
			expect( onClickSpy ).toHaveBeenCalledWith( 'foo' );
			expect( title ).toHaveClass( 'ck-inspector-property-list__title_clickable' );
		} );
	} );
} );
