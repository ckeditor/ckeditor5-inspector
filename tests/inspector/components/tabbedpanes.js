/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import Tabs from '../../../src/components/tabs';
import HorizontalNav from '../../../src/components/horizontalnav';

describe( '<Tabs />', () => {
	let wrapper, clickSpy;

	beforeEach( () => {
		clickSpy = sinon.spy();

		wrapper = mount(
			<Tabs activeTab="Bar" onTabChange={clickSpy}>
				<div label="Foo"></div>
				<div label="Bar"></div>
			</Tabs>
		);
	} );

	it( 'renders panes', () => {
		expect( wrapper ).to.have.className( 'ck-inspector-navbox' );
		expect( wrapper.children().childAt( 0 ) ).to.have.className( 'ck-inspector-navbox__navigation' );
		expect( wrapper.children().childAt( 1 ) ).to.have.className( 'ck-inspector-navbox__content' );
	} );

	it( 'renders props#contentBefore and props#contentAfter', () => {
		wrapper = mount(
			<Tabs contentBefore={<div></div>} contentAfter={<b></b>}>
				<div label="Foo"></div>
			</Tabs>
		);

		const nav = wrapper.children().childAt( 0 );

		expect( nav.childAt( 0 ).type() ).to.equal( 'div' );
		expect( nav.childAt( 1 ).type() ).to.equal( HorizontalNav );
		expect( nav.childAt( 2 ).type() ).to.equal( 'b' );
	} );

	describe( '<HorizontalNav />', () => {
		it( 'are rendered', () => {
			const tabs = wrapper.find( HorizontalNav );

			expect( tabs ).to.have.length( 1 );
			expect( tabs.props().definitions ).to.have.members( [ 'Foo', 'Bar' ]);
			expect( tabs.props().activeTab ).to.equal( 'Bar' );
		} );

		it( 'trigger props#onTabChange when clicked', () => {
			const tabs = wrapper.find( HorizontalNav );

			tabs.children().childAt( 0 ).simulate( 'click' );
			sinon.assert.calledOnce( clickSpy );
		} );
	} );
} );
