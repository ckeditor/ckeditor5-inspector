/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import Panes from '../../../src/components/panes';
import Tabs from '../../../src/components/tabs';

describe( '<Panes />', () => {
	let wrapper, clickSpy;

	beforeEach( () => {
		clickSpy = sinon.spy();

		wrapper = mount(
			<Panes activePane="Bar" onPaneChange={clickSpy}>
				<div label="Foo"></div>
				<div label="Bar"></div>
			</Panes>
		);
	} );

	it( 'renders panes', () => {
		expect( wrapper ).to.have.className( 'ck-inspector-panes' );
		expect( wrapper.children().childAt( 0 ) ).to.have.className( 'ck-inspector-panes__navigation' );
		expect( wrapper.children().childAt( 1 ) ).to.have.className( 'ck-inspector-panes__content' );
	} );

	it( 'renders props#contentBefore and props#contentAfter', () => {
		wrapper = mount(
			<Panes contentBefore={<div></div>} contentAfter={<b></b>}>
				<div label="Foo"></div>
			</Panes>
		);

		const nav = wrapper.children().childAt( 0 );

		expect( nav.childAt( 0 ).type() ).to.equal( 'div' );
		expect( nav.childAt( 1 ).type() ).to.equal( Tabs );
		expect( nav.childAt( 2 ).type() ).to.equal( 'b' );
	} );

	describe( '<Tabs />', () => {
		it( 'are rendered', () => {
			const tabs = wrapper.find( Tabs );

			expect( tabs ).to.have.length( 1 );
			expect( tabs.props().definitions ).to.have.members( [ 'Foo', 'Bar' ]);
			expect( tabs.props().activeTab ).to.equal( 'Bar' );
		} );

		it( 'trigger props#onPaneChange when clicked', () => {
			const tabs = wrapper.find( Tabs );

			tabs.children().childAt( 0 ).simulate( 'click' );
			sinon.assert.calledOnce( clickSpy );
		} );
	} );
} );
