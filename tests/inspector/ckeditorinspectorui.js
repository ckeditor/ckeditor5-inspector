/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { Rnd } from 'react-rnd';
import CKEditorInspectorUI, { DocsButton } from '../../src/ckeditorinspectorui';
import Tabs from '../../src/components/tabs';
import TestEditor from '../utils/testeditor';

import {
	SET_HEIGHT,
	SET_CURRENT_EDITOR_NAME,
	TOGGLE_IS_COLLAPSED
} from '../../src/data/actions';

describe( '<CKEditorInspectorUI />', () => {
	let editors, wrapper, store, editor1Element, editor2Element, dispatchSpy;

	const origAddEventListener = window.addEventListener;
	const windowEventMap = {};
	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		window.localStorage.clear();

		editor1Element = document.createElement( 'div' );
		editor2Element = document.createElement( 'div' );

		document.body.appendChild( editor1Element );
		document.body.appendChild( editor2Element );

		window.addEventListener = ( event, cb ) => {
			windowEventMap[ event ] = cb;

			origAddEventListener( event, cb );
		};

		return Promise.all( [
			TestEditor.create( editor1Element ),
			TestEditor.create( editor2Element )
		] ).then( ( [ editor1, editor2 ] ) => {
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

			dispatchSpy = sinon.spy( store, 'dispatch' );

			wrapper = mount( <Provider store={store}><CKEditorInspectorUI /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();

		editor1Element.remove();
		editor2Element.remove();

		window.addEventListener = origAddEventListener;

		return Promise.all( Array.from( editors )
			.map( ( [ , editor ] ) => editor.destroy() ) );
	} );

	it( 'should restore the inspector height from the store', () => {
		expect( document.body.style.getPropertyValue( '--ck-inspector-height' ) ).to.equal( '123px' );
	} );

	it( 'should configure the active tab', () => {
		const tabs = wrapper.find( 'Tabs' ).first();

		expect( tabs.props().activeTab ).to.equal( 'Model' );
		expect( tabs.props().onTabChange ).to.equal( wrapper.find( 'CKEditorInspectorUI' ).props().setActiveTab );
	} );

	describe( 'render()', () => {
		it( 'should set the class of document#body when collapsed or expanded', () => {
			expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).to.be.true;
			expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).to.be.false;

			store.dispatch( {
				type: 'testAction',
				state: {
					ui: {
						isCollapsed: true
					}
				}
			} );

			expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).to.be.false;
			expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).to.be.true;
		} );

		it( 'should define the margin-bottom on the `body` element with the height of the inspector container (non-collapsed)', () => {
			expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).to.be.true;
			expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).to.be.false;

			expect( window.getComputedStyle( document.body ).marginBottom ).to.equal( '123px' );
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

			expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).to.be.false;
			expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).to.be.true;

			expect( window.getComputedStyle( document.body ).marginBottom ).to.equal( '30px' );
		} );

		describe( 'resizable container', () => {
			it( 'should be rendered', () => {
				expect( wrapper.find( Rnd ).first() ).to.have.lengthOf( 1 );
			} );

			describe( 'props', () => {
				it( 'should have #bounds', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().bounds ).to.equal( 'window' );
				} );

				it( 'should have #enableResizing', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().enableResizing ).to.deep.equal( {
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

					wrapper.update();
					expect( wrapper.find( Rnd ).first().props().enableResizing ).to.deep.equal( {
						top: false
					} );
				} );

				it( 'should have #disableDragging', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().disableDragging ).to.be.true;
				} );

				it( 'should have #minHeight', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().minHeight ).to.equal( '100' );
				} );

				it( 'should have #maxHeight', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().maxHeight ).to.equal( '100%' );
				} );

				it( 'should have #style', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().style ).to.deep.equal( {
						position: 'fixed',
						bottom: '0',
						left: '0',
						right: '0',
						top: 'auto'
					} );
				} );

				it( 'should have #className', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().className ).to.equal( 'ck-inspector ' );

					store.dispatch( {
						type: 'testAction',
						state: {
							ui: {
								isCollapsed: true
							}
						}
					} );

					wrapper.update();
					expect( wrapper.find( Rnd ).first().props().className ).to.equal( 'ck-inspector ck-inspector_collapsed' );
				} );

				it( 'should have #position', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().position ).to.deep.equal( { x: 0, y: '100%' } );
				} );

				it( 'should have #size', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().size ).to.deep.equal( {
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

					wrapper.update();
					expect( wrapper.find( Rnd ).first().props().size ).to.deep.equal( {
						width: '100%',
						height: 30
					} );
				} );

				it( 'should have #onResizeStop', () => {
					const rnd = wrapper.find( Rnd ).first();
					const instance = wrapper.find( 'CKEditorInspectorUI' ).instance();

					expect( rnd.props().onResizeStop ).to.equal( instance.handleInspectorResize );

					instance.handleInspectorResize( {}, {}, { style: { height: '321px' } } );

					sinon.assert.calledWithExactly( dispatchSpy, {
						newHeight: '321px',
						type: SET_HEIGHT
					} );
				} );
			} );
		} );

		describe( 'panes', () => {
			function getPanes() {
				wrapper.update();
				return wrapper.find( Tabs ).first();
			}

			describe( 'props', () => {
				it( 'should have a #onTabChange', () => {
					const panes = getPanes();

					expect( panes.props().onTabChange ).to.equal( wrapper.find( 'CKEditorInspectorUI' ).props().setActiveTab );
				} );

				it( 'should have a #contentBefore', () => {
					const panes = getPanes();

					expect( mount( panes.props().contentBefore ).type() ).to.equal( DocsButton );
				} );

				it( 'should have a #activeTab', () => {
					const panes = getPanes();

					expect( panes.props().activeTab ).to.equal( 'Model' );

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

					expect( getPanes().props().activeTab ).to.equal( 'Commands' );
				} );

				describe( '#contentAfter', () => {
					function getSelector() {
						wrapper.update();

						return getPanes().find( 'EditorInstanceSelectorVisual' );
					}

					function getToggle() {
						wrapper.update();

						return getPanes().find( 'ToggleButtonVisual' );
					}

					it( 'should have an instance selector', () => {
						const selector = getSelector();

						expect( selector.props().currentEditorName ).to.equal( 'first' );

						store.dispatch( {
							type: 'testAction',
							state: {
								editors,
								currentEditorName: 'second'
							}
						} );

						expect( getSelector().props().currentEditorName ).to.equal( 'second' );

						expect( selector.props().editors ).to.equal( editors );

						store.dispatch( {
							type: 'testAction',
							state: {
								editors: new Map(),
								currentEditorName: null
							}
						} );

						expect( getSelector().props().editors ).to.deep.equal( new Map() );

						selector.props().setCurrentEditorName( 'first' );

						sinon.assert.calledWithExactly( dispatchSpy.lastCall, {
							editorName: 'first',
							type: SET_CURRENT_EDITOR_NAME
						} );
					} );

					it( 'should have a toggle to collapse the UI', () => {
						const toggle = getToggle();
						const button = toggle.find( 'button' );

						expect( toggle.props().toggleIsCollapsed ).to.be.a( 'function' );
						expect( button.props().onClick ).to.equal( toggle.props().toggleIsCollapsed );
						expect( button ).to.not.have.className( 'ck-inspector-navbox__navigation__toggle_up' );

						store.dispatch( {
							type: 'testAction',
							state: {
								ui: {
									isCollapsed: true
								}
							}
						} );

						expect( getToggle().find( 'button' ) ).to.have.className( 'ck-inspector-navbox__navigation__toggle_up' );
					} );

					it( 'should toggle the UI on a global ALT+F12 keyboard shortcut', () => {
						windowEventMap.keydown( { key: 'F12', altKey: true } );

						sinon.assert.calledWithExactly( dispatchSpy.lastCall, {
							type: TOGGLE_IS_COLLAPSED
						} );
					} );

					it( 'should not toggle the UI on a global SHIFT+ALT+F12 keyboard shortcut', () => {
						windowEventMap.keydown( { key: 'F12', altKey: true, shiftKey: true } );

						sinon.assert.notCalled( dispatchSpy );
					} );

					it( 'should not toggle the UI on a global CTRL+ALT+F12 keyboard shortcut', () => {
						windowEventMap.keydown( { key: 'F12', altKey: true, ctrlKey: true } );

						sinon.assert.notCalled( dispatchSpy );
					} );
				} );
			} );

			describe( 'children', () => {
				it( 'should have a model pane', () => {
					expect( getPanes().find( 'ModelPane' ) ).to.have.length( 1 );
				} );

				it( 'should have a view pane', () => {
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

					expect( getPanes().find( 'ViewPane' ) ).to.have.length( 1 );
				} );

				it( 'should have a commands pane', () => {
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

					expect( getPanes().find( 'CommandsPane' ) ).to.have.length( 1 );
				} );

				it( 'should have a schema pane', () => {
					store.dispatch( {
						type: 'testAction',
						state: {
							ui: {
								activeTab: 'Schema'
							},
							schema: {}
						}
					} );

					expect( getPanes().find( 'SchemaPane' ) ).to.have.length( 1 );
				} );
			} );
		} );
	} );
} );
