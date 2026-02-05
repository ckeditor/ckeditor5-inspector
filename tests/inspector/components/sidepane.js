/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import SidePane from '../../../src/components/sidepane';
import { SET_SIDE_PANE_WIDTH } from '../../../src/data/actions';

let lastRndProps;

vi.mock( 'react-rnd', () => ( {
	Rnd: props => {
		lastRndProps = props;
		return <div data-testid="rnd">{props.children}</div>;
	}
} ) );

describe( '<SidePane />', () => {
	let store, dispatchSpy;

	beforeEach( () => {
		window.localStorage.clear();

		store = createStore( ( state, action ) => ( { ...state, ...action.state } ), {
			ui: {
				sidePaneWidth: '123px'
			}
		} );

		dispatchSpy = vi.spyOn( store, 'dispatch' );
		render( <Provider store={store}><SidePane>foo</SidePane></Provider> );
	} );

	describe( 'state', () => {
		it( 'restores the width from the store', () => {
			expect( lastRndProps.size.width ).toBe( '123px' );
		} );
	} );

	describe( 'resizable container', () => {
		it( 'is rendered', () => {
			expect( lastRndProps ).toBeTruthy();
		} );

		it( 'renders children', () => {
			expect( lastRndProps.children ).toBe( 'foo' );
		} );

		describe( 'props', () => {
			it( 'has #enableResizing', () => {
				expect( lastRndProps.enableResizing ).toEqual( { left: true } );
			} );

			it( 'has #disableDragging', () => {
				expect( lastRndProps.disableDragging ).toBe( true );
			} );

			it( 'has #minWidth', () => {
				expect( lastRndProps.minWidth ).toBe( 200 );
			} );

			it( 'has #style', () => {
				expect( lastRndProps.style ).toEqual( {
					position: 'relative'
				} );
			} );

			it( 'has #position', () => {
				expect( lastRndProps.position ).toEqual( { x: '100%', y: '100%' } );
			} );

			it( 'has #size', async () => {
				store.dispatch( {
					type: 'testAction',
					state: {
						ui: {
							sidePaneWidth: '42px'
						}
					}
				} );

				await waitFor( () => {
					expect( lastRndProps.size ).toEqual( {
						width: '42px',
						height: '100%'
					} );
				} );
			} );

			it( 'has #onResizeStop', () => {
				lastRndProps.onResizeStop( {}, {}, { style: { width: '321px' } } );

				expect( dispatchSpy ).toHaveBeenCalledWith( {
					newWidth: '321px',
					type: SET_SIDE_PANE_WIDTH
				} );
			} );
		} );
	} );
} );
