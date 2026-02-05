/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Tabs from '../../../src/components/tabs';

describe( '<Tabs />', () => {
	let clickSpy;

	beforeEach( () => {
		clickSpy = vi.fn();

		render(
			<Tabs activeTab="Bar" onTabChange={clickSpy}>
				<div label="Foo" key="Foo"></div>
				<div label="Bar" key="Bar"></div>
			</Tabs>
		);
	} );

	it( 'renders <NavBox>', () => {
		expect( document.querySelector( '.ck-inspector-navbox' ) ).toBeTruthy();
	} );

	it( 'renders props#contentBefore and props#contentAfter in <NavBox> navigation', () => {
		const { container } = render(
			<Tabs contentBefore={<div key="before"></div>} contentAfter={<b key="after"></b>}>
				<div label="Foo" key="foo"></div>
			</Tabs>
		);

		const nav = container.querySelector( '.ck-inspector-navbox__navigation' );
		const children = Array.from( nav.children );

		expect( children[ 0 ].tagName.toLowerCase() ).toBe( 'div' );
		expect( children[ 1 ] ).toHaveClass( 'ck-inspector-horizontal-nav' );
		expect( children[ 2 ].tagName.toLowerCase() ).toBe( 'b' );
	} );

	describe( '<HorizontalNav />', () => {
		it( 'are rendered', () => {
			const items = document.querySelectorAll( '.ck-inspector-horizontal-nav__item' );
			expect( items ).toHaveLength( 2 );
			expect( items[ 0 ] ).toHaveTextContent( 'Foo' );
			expect( items[ 1 ] ).toHaveTextContent( 'Bar' );
			expect( items[ 1 ] ).toHaveClass( 'ck-inspector-horizontal-nav__item_active' );
		} );

		it( 'trigger props#onTabChange when clicked', () => {
			const firstTab = document.querySelectorAll( '.ck-inspector-horizontal-nav__item' )[ 0 ];
			fireEvent.click( firstTab );
			expect( clickSpy ).toHaveBeenCalledTimes( 1 );
			expect( clickSpy ).toHaveBeenCalledWith( 'Foo' );
		} );
	} );
} );
