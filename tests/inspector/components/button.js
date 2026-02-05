/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Button from '../../../src/components/button';
import ConsoleIcon from '../../../src/assets/img/console.svg';

describe( '<Button />', () => {
	it( 'renders a button', () => {
		const { container } = render( <Button /> );
		const button = container.querySelector( 'button' );

		expect( button ).toHaveClass( 'ck-inspector-button' );
		expect( button ).toHaveAttribute( 'type', 'button' );
	} );

	it( 'reacts to props#text', () => {
		const { container, rerender } = render( <Button /> );

		rerender( <Button text="foo" /> );

		const button = container.querySelector( 'button' );
		expect( button ).toHaveAttribute( 'title', 'foo' );
		expect( button ).toHaveTextContent( 'foo' );
	} );

	it( 'reacts to props#className', () => {
		const { container, rerender } = render( <Button /> );

		rerender( <Button className="foo-bar-baz" /> );
		const button = container.querySelector( 'button' );
		expect( button ).toHaveClass( 'foo-bar-baz' );
	} );

	it( 'reacts to props#isOn', () => {
		const { container, rerender } = render( <Button /> );
		const button = container.querySelector( 'button' );

		expect( button ).not.toHaveClass( 'ck-inspector-button_on' );

		rerender( <Button isOn={true} /> );
		expect( container.querySelector( 'button' ) ).toHaveClass( 'ck-inspector-button_on' );

		rerender( <Button isOn={false} /> );
		expect( container.querySelector( 'button' ) ).not.toHaveClass( 'ck-inspector-button_on' );
	} );

	it( 'reacts to props#isEnabled', () => {
		const { container, rerender } = render( <Button /> );
		const button = container.querySelector( 'button' );

		expect( button ).not.toHaveClass( 'ck-inspector-button_disabled' );

		rerender( <Button isEnabled={false} /> );
		expect( container.querySelector( 'button' ) ).toHaveClass( 'ck-inspector-button_disabled' );

		rerender( <Button isEnabled={true} /> );
		expect( container.querySelector( 'button' ) ).not.toHaveClass( 'ck-inspector-button_disabled' );
	} );

	it( 'reacts to props#icon', () => {
		const { container, rerender } = render( <Button /> );

		rerender( <Button icon={<ConsoleIcon />} /> );
		expect( container.querySelector( 'svg' ) ).toBeTruthy();
	} );

	describe( 'onClick handling', () => {
		it( 'executes props#onClick when clicked', () => {
			const spy = vi.fn();
			const { container } = render( <Button onClick={spy} /> );

			fireEvent.click( container.querySelector( 'button' ) );
			expect( spy ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'does not execute props#onClick when #isEnabled is false', () => {
			const spy = vi.fn();
			const { container } = render( <Button onClick={spy} isEnabled={false} /> );

			fireEvent.click( container.querySelector( 'button' ) );
			expect( spy ).not.toHaveBeenCalled();
		} );
	} );
} );
