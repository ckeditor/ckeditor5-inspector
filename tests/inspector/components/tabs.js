/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import Tabs from '../../../src/components/tabs';
import NavBox from '../../../src/components/navbox';
import HorizontalNav from '../../../src/components/horizontalnav';

describe( '<Tabs />', () => {
	let wrapper, clickSpy;

	beforeEach( () => {
		clickSpy = sinon.spy();

		wrapper = mount(
			<Tabs activeTab="Bar" onTabChange={clickSpy}>
				<div label="Foo" key="Foo"></div>
				<div label="Bar" key="Bar"></div>
			</Tabs>
		);
	} );

	it( 'renders <NavBox>', () => {
		expect( wrapper.childAt( 0 ).type() ).to.equal( NavBox );
	} );

	it( 'renders props#contentBefore and props#contentAfter in <NavBox> navigation', () => {
		wrapper = mount(
			<Tabs contentBefore={<div key="before"></div>} contentAfter={<b key="after"></b>}>
				<div label="Foo" key="foo"></div>
			</Tabs>
		);

		const nav = wrapper.childAt( 0 ).props().children[ 0 ];

		expect( mount( nav[ 0 ] ).type() ).to.equal( 'div' );
		expect( mount( nav[ 1 ] ).type() ).to.equal( HorizontalNav );
		expect( mount( nav[ 2 ] ).type() ).to.equal( 'b' );
	} );

	describe( '<HorizontalNav />', () => {
		it( 'are rendered', () => {
			const tabs = wrapper.find( HorizontalNav );

			expect( tabs ).to.have.length( 1 );
			expect( tabs.props().definitions ).to.have.members( [ 'Foo', 'Bar' ] );
			expect( tabs.props().activeTab ).to.equal( 'Bar' );
		} );

		it( 'trigger props#onTabChange when clicked', () => {
			const tabs = wrapper.find( HorizontalNav );

			tabs.children().childAt( 0 ).simulate( 'click' );
			sinon.assert.calledOnce( clickSpy );
		} );
	} );
} );
