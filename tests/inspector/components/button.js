/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import Button from '../../../src/components/button';
import ConsoleIcon from '../../../src/assets/img/console.svg';

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

	it( 'reacts to props#className', () => {
		const wrapper = mount( <Button /> );

		wrapper.setProps( { className: 'foo-bar-baz' } );

		expect( wrapper.getDOMNode().classList.contains( 'foo-bar-baz' ) ).to.be.true;
	} );

	it( 'reacts to props#isOn', () => {
		const wrapper = shallow( <Button /> );

		expect( wrapper.first() ).to.not.have.className( 'ck-inspector-button_on' );

		wrapper.setProps( { isOn: true } );
		expect( wrapper.first() ).to.have.className( 'ck-inspector-button_on' );

		wrapper.setProps( { isOn: false } );
		expect( wrapper.first() ).to.not.have.className( 'ck-inspector-button_on' );
	} );

	it( 'reacts to props#isEnabled', () => {
		const wrapper = shallow( <Button /> );

		expect( wrapper.first() ).to.not.have.className( 'ck-inspector-button_disabled' );

		wrapper.setProps( { isEnabled: false } );
		expect( wrapper.first() ).to.have.className( 'ck-inspector-button_disabled' );

		wrapper.setProps( { isEnabled: true } );
		expect( wrapper.first() ).to.not.have.className( 'ck-inspector-button_disabled' );
	} );

	it( 'reacts to props#icon', () => {
		const wrapper = shallow( <Button /> );

		wrapper.setProps( { icon: <ConsoleIcon/> } );
	} );

	describe( 'onClick handling', () => {
		it( 'executes props#onClick when clicked', () => {
			const spy = sinon.spy();
			const wrapper = shallow( <Button onClick={spy} /> );

			wrapper.first().simulate( 'click' );
			sinon.assert.callCount( spy, 1 );
		} );

		it( 'does not execute props#onClick when #isEnabled is false', () => {
			const spy = sinon.spy();
			const wrapper = shallow( <Button onClick={spy} isEnabled={false} /> );

			wrapper.first().simulate( 'click' );
			sinon.assert.notCalled( spy );
		} );
	} );
} );
