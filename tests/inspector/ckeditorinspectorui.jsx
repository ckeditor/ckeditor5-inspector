/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import CKEditorInspectorUI, { DocsButton } from '../../src/ckeditorinspectorui';
import TestEditor from '../utils/testeditor';

import {
	SET_HEIGHT,
	SET_CURRENT_EDITOR_NAME,
	TOGGLE_IS_COLLAPSED,
	SET_ACTIVE_INSPECTOR_TAB
} from '../../src/data/actions';

let lastRndProps;
let lastTabsProps;

vi.mock( 'react-rnd', () => ( {
	Rnd: props => {
		lastRndProps = props;
		return <div data-testid="rnd">{props.children}</div>;
	}
} ) );

vi.mock( '../../src/components/tabs', () => ( {
	default: props => {
		lastTabsProps = props;
		const children = Array.isArray( props.children ) ? props.children : [ props.children ];
		const activeChildren = children.filter( child => child && child.props && child.props.label === props.activeTab );

		return <div data-testid="tabs">
			<div data-testid="tabs-before">{props.contentBefore}</div>
			<div data-testid="tabs-after">{props.contentAfter}</div>
			{activeChildren}
		</div>;
	}
} ) );

vi.mock( '../../src/model/pane', () => ( {
	default: props => <div data-testid="model-pane" data-label={props.label} />
} ) );

vi.mock( '../../src/view/pane', () => ( {
	default: props => <div data-testid="view-pane" data-label={props.label} />
} ) );

vi.mock( '../../src/commands/pane', () => ( {
	default: props => <div data-testid="commands-pane" data-label={props.label} />
} ) );

vi.mock( '../../src/schema/pane', () => ( {
	default: props => <div data-testid="schema-pane" data-label={props.label} />
} ) );

vi.mock( '../../src/editorquickactions', () => ( {
	default: () => <div data-testid="editor-quick-actions" />
} ) );

describe( '<CKEditorInspectorUI />', () => {
	let editors, store, editor1Element, editor2Element, dispatchSpy, renderResult;

	beforeEach( async () => {
		window.localStorage.clear();
		lastRndProps = null;
		lastTabsProps = null;

		editor1Element = document.createElement( 'div' );
		editor2Element = document.createElement( 'div' );

		document.body.appendChild( editor1Element );
		document.body.appendChild( editor2Element );

		const [ editor1, editor2 ] = await Promise.all( [
			TestEditor.create( editor1Element ),
			TestEditor.create( editor2Element )
		] );

		editors = new Map( [ [ 'first', editor1 ], [ 'second', editor2 ] ] );

		store = createStore( ( state, action ) => ( { ...state, ...action.state } ), {
			editors,
			currentEditorName: 'first',
			currentEditorGlobals: {},
			ui: {
				activeTab: 'Model',
				height: '123px',
				isCollapsed: false
			},
			model: {
				roots: [],
				ranges: [],
				markers: [],
				treeDefinition: null,
				currentRootName: 'main',
				ui: {
					activeTab: 'Selection',
					showMarkers: false,
					showCompactText: false
				}
			}
		} );

		dispatchSpy = vi.spyOn( store, 'dispatch' );

		renderResult = render( <Provider store={store}><CKEditorInspectorUI /></Provider> );
	} );

	afterEach( async () => {
		renderResult.unmount();

		editor1Element.remove();
		editor2Element.remove();

		await Promise.all( Array.from( editors )
			.map( ( [ , editor ] ) => editor.destroy() ) );
	} );

	it( 'should restore the inspector height from the store', () => {
		expect( document.body.style.getPropertyValue( '--ck-inspector-height' ) ).toBe( '123px' );
	} );

	it( 'should configure the active tab', () => {
		expect( lastTabsProps.activeTab ).toBe( 'Model' );

		dispatchSpy.mockClear();
		lastTabsProps.onTabChange( 'View' );
		expect( dispatchSpy ).toHaveBeenCalledWith( { type: SET_ACTIVE_INSPECTOR_TAB, tabName: 'View' } );
	} );

	describe( 'render()', () => {
		it( 'should set the class of document#body when collapsed or expanded', () => {
			expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).toBe( true );
			expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).toBe( false );

			store.dispatch( {
				type: 'testAction',
				state: {
					ui: {
						isCollapsed: true
					}
				}
			} );

			expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).toBe( false );
			expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).toBe( true );
		} );

		it( 'should define the margin-bottom on the `body` element with the height of the inspector container (non-collapsed)', () => {
			expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).toBe( true );
			expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).toBe( false );

			expect( window.getComputedStyle( document.body ).marginBottom ).toBe( '123px' );
		} );

		it( 'should define the margin-bottom on the `body` element with the height of the inspector container (collapsed)', () => {
			store.dispatch( {
				type: 'testAction',
				state: {
					ui: {
						isCollapsed: true
					}
				}
			} );

			expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).toBe( false );
			expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).toBe( true );

			expect( window.getComputedStyle( document.body ).marginBottom ).toBe( '30px' );
		} );

		describe( 'resizable container', () => {
			it( 'should be rendered', () => {
				expect( lastRndProps ).toBeTruthy();
			} );

			describe( 'props', () => {
				it( 'should have #bounds', () => {
					expect( lastRndProps.bounds ).toBe( 'window' );
				} );

				it( 'should have #enableResizing', async () => {
					expect( lastRndProps.enableResizing ).toEqual( {
						top: true
					} );

					store.dispatch( {
						type: 'testAction',
						state: {
							ui: {
								isCollapsed: true
							}
						}
					} );

					await waitFor( () => {
						expect( lastRndProps.enableResizing ).toEqual( {
							top: false
						} );
					} );
				} );

				it( 'should have #disableDragging', () => {
					expect( lastRndProps.disableDragging ).toBe( true );
				} );

				it( 'should have #minHeight', () => {
					expect( lastRndProps.minHeight ).toBe( '100' );
				} );

				it( 'should have #maxHeight', () => {
					expect( lastRndProps.maxHeight ).toBe( '100%' );
				} );

				it( 'should have #style', () => {
					expect( lastRndProps.style ).toEqual( {
						position: 'fixed',
						bottom: '0',
						left: '0',
						right: '0',
						top: 'auto'
					} );
				} );

				it( 'should have #className', async () => {
					expect( lastRndProps.className ).toBe( 'ck-inspector ' );

					store.dispatch( {
						type: 'testAction',
						state: {
							ui: {
								isCollapsed: true
							}
						}
					} );

					await waitFor( () => {
						expect( lastRndProps.className ).toBe( 'ck-inspector ck-inspector_collapsed' );
					} );
				} );

				it( 'should have #position', () => {
					expect( lastRndProps.position ).toEqual( { x: 0, y: '100%' } );
				} );

				it( 'should have #size', async () => {
					expect( lastRndProps.size ).toEqual( {
						width: '100%',
						height: '123px'
					} );

					store.dispatch( {
						type: 'testAction',
						state: {
							ui: {
								isCollapsed: true
							}
						}
					} );

					await waitFor( () => {
						expect( lastRndProps.size ).toEqual( {
							width: '100%',
							height: 30
						} );
					} );
				} );

				it( 'should have #onResizeStop', () => {
					dispatchSpy.mockClear();
					lastRndProps.onResizeStop( {}, {}, { style: { height: '321px' } } );

					expect( dispatchSpy ).toHaveBeenCalledWith( {
						newHeight: '321px',
						type: SET_HEIGHT
					} );
				} );
			} );
		} );

		describe( 'panes', () => {
			describe( 'props', () => {
				it( 'should have a #onTabChange', () => {
					expect( lastTabsProps.onTabChange ).toBeTypeOf( 'function' );
				} );

				it( 'should have a #contentBefore', () => {
					expect( lastTabsProps.contentBefore.type ).toBe( DocsButton );
				} );

				it( 'should have a #activeTab', async () => {
					expect( lastTabsProps.activeTab ).toBe( 'Model' );

					store.dispatch( {
						type: 'testAction',
						state: {
							ui: {
								activeTab: 'Commands'
							},
							commands: {
								treeDefinition: []
							}
						}
					} );

					await waitFor( () => {
						expect( lastTabsProps.activeTab ).toBe( 'Commands' );
					} );
				} );

				describe( '#contentAfter', () => {
					it( 'should have an instance selector', async () => {
						const selector = screen.getByLabelText( /Instance/ );
						expect( selector ).toHaveValue( 'first' );

						store.dispatch( {
							type: 'testAction',
							state: {
								editors,
								currentEditorName: 'second'
							}
						} );

						await waitFor( () => {
							expect( screen.getByLabelText( /Instance/ ) ).toHaveValue( 'second' );
						} );

						dispatchSpy.mockClear();
						fireEvent.change( screen.getByLabelText( /Instance/ ), { target: { value: 'first' } } );
						expect( dispatchSpy ).toHaveBeenCalledWith( {
							editorName: 'first',
							type: SET_CURRENT_EDITOR_NAME
						} );

						store.dispatch( {
							type: 'testAction',
							state: {
								editors: new Map(),
								currentEditorName: null
							}
						} );

						await waitFor( () => {
							expect( screen.queryByLabelText( /Instance/ ) ).toBeNull();
						} );
					} );

					it( 'should have a toggle to collapse the UI', async () => {
						const button = screen.getByRole( 'button', { name: 'Toggle inspector' } );
						expect( button ).not.toHaveClass( 'ck-inspector-navbox__navigation__toggle_up' );

						store.dispatch( {
							type: 'testAction',
							state: {
								ui: {
									isCollapsed: true
								}
							}
						} );

						await waitFor( () => {
							expect( screen.getByRole( 'button', { name: 'Toggle inspector' } ) )
								.toHaveClass( 'ck-inspector-navbox__navigation__toggle_up' );
						} );
					} );

					it( 'should toggle the UI on a global ALT+F12 keyboard shortcut', () => {
						dispatchSpy.mockClear();
						fireEvent.keyDown( window, { key: 'F12', altKey: true } );

						expect( dispatchSpy ).toHaveBeenCalledWith( {
							type: TOGGLE_IS_COLLAPSED
						} );
					} );

					it( 'should not toggle the UI on a global SHIFT+ALT+F12 keyboard shortcut', () => {
						dispatchSpy.mockClear();
						fireEvent.keyDown( window, { key: 'F12', altKey: true, shiftKey: true } );

						expect( dispatchSpy ).not.toHaveBeenCalled();
					} );

					it( 'should not toggle the UI on a global CTRL+ALT+F12 keyboard shortcut', () => {
						dispatchSpy.mockClear();
						fireEvent.keyDown( window, { key: 'F12', altKey: true, ctrlKey: true } );

						expect( dispatchSpy ).not.toHaveBeenCalled();
					} );
				} );
			} );

			describe( 'children', () => {
				it( 'should have a model pane', () => {
					expect( screen.getByTestId( 'model-pane' ) ).toBeInTheDocument();
				} );

				it( 'should have a view pane', async () => {
					store.dispatch( {
						type: 'testAction',
						state: {
							ui: {
								activeTab: 'View'
							},
							view: {
								roots: [],
								ui: {}
							}
						}
					} );

					await waitFor( () => {
						expect( screen.getByTestId( 'view-pane' ) ).toBeInTheDocument();
					} );
				} );

				it( 'should have a commands pane', async () => {
					store.dispatch( {
						type: 'testAction',
						state: {
							ui: {
								activeTab: 'Commands'
							},
							commands: {
							}
						}
					} );

					await waitFor( () => {
						expect( screen.getByTestId( 'commands-pane' ) ).toBeInTheDocument();
					} );
				} );

				it( 'should have a schema pane', async () => {
					store.dispatch( {
						type: 'testAction',
						state: {
							ui: {
								activeTab: 'Schema'
							},
							schema: {}
						}
					} );

					await waitFor( () => {
						expect( screen.getByTestId( 'schema-pane' ) ).toBeInTheDocument();
					} );
				} );
			} );
		} );
	} );
} );
