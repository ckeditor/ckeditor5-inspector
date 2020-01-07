/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global window, document */

import React from 'react';
import { Rnd } from 'react-rnd';
import SidePane from '../../../src/components/sidepane';

describe( '<SidePane />', () => {
	let wrapper;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		window.localStorage.clear();

		wrapper = mount( <SidePane>foo</SidePane> );
	} );

	describe( 'state', () => {
		it( 'has initial state', () => {
			const state = wrapper.state();

			expect( state.width ).to.equal( '500px' );
		} );

		it( 'restores state#width from the local storage', () => {
			window.localStorage.setItem( 'ck5-inspector-side-pane-width', '123px' );

			const wrapper = mount(
				<SidePane>foo</SidePane>,
				{ attachTo: container }
			);

			expect( wrapper.state().width ).to.equal( '123px' );

			wrapper.unmount();
		} );
	} );

	describe( 'resizable container', () => {
		it( 'is rendered', () => {
			expect( wrapper.find( Rnd ) ).to.have.lengthOf( 1 );
		} );

		it( 'renders children', () => {
			expect( wrapper.text() ).to.equal( 'foo' );
		} );

		describe( 'props', () => {
			it( 'has #enableResizing', () => {
				const rnd = wrapper.find( Rnd );

				expect( rnd.props().enableResizing ).to.deep.equal( { left: true } );
			} );

			it( 'has #disableDragging', () => {
				const rnd = wrapper.find( Rnd );

				expect( rnd.props().disableDragging ).to.be.true;
			} );

			it( 'has #minWidth', () => {
				const rnd = wrapper.find( Rnd );

				expect( rnd.props().minWidth ).to.equal( 200 );
			} );

			it( 'has #style', () => {
				const rnd = wrapper.find( Rnd );

				expect( rnd.props().style ).to.deep.equal( {
					position: 'relative'
				} );
			} );

			it( 'has #position', () => {
				const rnd = wrapper.find( Rnd );

				expect( rnd.props().position ).to.deep.equal( { x: '100%', y: '100%' } );
			} );

			it( 'has #size', () => {
				wrapper.setState( {
					width: '42px'
				} );

				expect( wrapper.find( Rnd ).props().size ).to.deep.equal( {
					width: '42px',
					height: '100%'
				} );
			} );

			it( 'has #onResizeStop', () => {
				const rnd = wrapper.find( Rnd );

				expect( rnd.props().onResizeStop ).to.equal( wrapper.instance().handleSidePaneResize );

				wrapper.instance().handleSidePaneResize( {}, {}, { style: { width: '321px' } } );

				expect( window.localStorage.getItem( 'ck5-inspector-side-pane-width' ) ).to.equal( '321px' );
			} );
		} );
	} );
} );
