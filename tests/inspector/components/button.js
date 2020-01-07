/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import Button from '../../../src/components/button';

describe( '<Button />', () => {
	it( 'renders a button', () => {
		const wrapper = shallow( <Button /> );

		expect( wrapper.first() ).to.have.className( 'ck-inspector-button' );
		expect( wrapper.first() ).to.have.attr( 'type', 'button' );
	} );

	it( 'reacts to props#text', () => {
		const wrapper = shallow( <Button /> );

		wrapper.setProps( { text: 'foo' } );

		expect( wrapper.first() ).to.have.attr( 'title', 'foo' );
		expect( wrapper.first().contains( 'foo' ) ).to.be.true;
	} );

	it( 'reacts to props#type', () => {
		const wrapper = shallow( <Button /> );

		wrapper.setProps( { type: 'bar' } );

		expect( wrapper.first() ).to.have.className( 'ck-inspector-button_bar' );
	} );

	it( 'executes props#onClick when clicked', () => {
		const spy = sinon.spy();
		const wrapper = shallow( <Button onClick={spy} /> );

		wrapper.first().simulate( 'click' );
		sinon.assert.callCount( spy, 1 );
	} );
} );
