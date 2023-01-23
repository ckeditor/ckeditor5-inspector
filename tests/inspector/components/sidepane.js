/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global window */

import React from 'react';
import { Rnd } from 'react-rnd';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import SidePane from '../../../src/components/sidepane';
import { SET_SIDE_PANE_WIDTH } from '../../../src/data/actions';

describe( '<SidePane />', () => {
	let wrapper, store, dispatchSpy;

	beforeEach( () => {
		window.localStorage.clear();

		store = createStore( ( state, action ) => ( { ...state, ...action.state } ), {
			ui: {
				sidePaneWidth: '123px'
			}
		} );

		dispatchSpy = sinon.spy( store, 'dispatch' );

		wrapper = mount( <Provider store={store}><SidePane>foo</SidePane></Provider> );
	} );

	describe( 'state', () => {
		it( 'restores the width from the store', () => {
			expect( wrapper.find( SidePane ).find( Rnd ).props().size.width ).to.equal( '123px' );
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
				store.dispatch( {
					type: 'testAction',
					state: {
						ui: {
							sidePaneWidth: '42px'
						}
					}
				} );

				wrapper.update();

				expect( wrapper.find( SidePane ).find( Rnd ).props().size ).to.deep.equal( {
					width: '42px',
					height: '100%'
				} );
			} );

			it( 'has #onResizeStop', () => {
				wrapper.find( SidePane ).find( Rnd ).props().onResizeStop( {}, {}, { style: { width: '321px' } } );

				sinon.assert.calledWithExactly( dispatchSpy, {
					newWidth: '321px',
					type: SET_SIDE_PANE_WIDTH
				} );
			} );
		} );
	} );
} );
