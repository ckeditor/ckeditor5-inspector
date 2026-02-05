/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ObjectInspector from '../../../src/components/objectinspector';

describe( '<ObjectInspector />', () => {
	it( 'renders', () => {
		const { container } = render( <ObjectInspector lists={[]} /> );

		expect( container.firstChild ).toHaveClass( 'ck-inspector__object-inspector' );
	} );

	it( 'renders props#header', () => {
		const { container } = render( <ObjectInspector lists={[]} header="foo" /> );

		expect( container.querySelector( 'h2' ) ).toHaveClass( 'ck-inspector-code' );
	} );

	describe( 'props#lists', () => {
		it( 'does not render when there are no items', () => {
			const { container } = render( <ObjectInspector lists={[
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

			expect( container.querySelectorAll( '.ck-inspector-property-list' ) ).toHaveLength( 0 );
		} );

		it( 'renders a <PropertyList /> when there are items', () => {
			const { container } = render( <ObjectInspector lists={[
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

			expect( container.querySelectorAll( 'hr' ) ).toHaveLength( 1 );
			expect( container.querySelector( 'h3' ) ).toHaveTextContent( 'foo' );
			expect( container.querySelectorAll( '.ck-inspector-property-list' ) ).toHaveLength( 1 );
		} );

		it( 'passes a "onPropertyTitleClick" handler to <PropertyList />', () => {
			const onClickMock = vi.fn();
			const { container } = render( <ObjectInspector lists={[
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

			const label = container.querySelector( 'label' );
			fireEvent.click( label );
			expect( onClickMock ).toHaveBeenCalledWith( 'foo' );
		} );

		it( 'passes a "presentation" data to <PropertyList />', () => {
			const { container } = render( <ObjectInspector lists={[
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
						foo: {
							value: 'bar',
							subProperties: {
								qux: { value: 'baz' }
							}
						}
					},
					presentation: {
						expandCollapsibles: true
					}
				}
			]} /> );

			const title = container.querySelector( '.ck-inspector-property-list__title_collapsible' );
			expect( title ).toHaveClass( 'ck-inspector-property-list__title_expanded' );
		} );
	} );
} );
