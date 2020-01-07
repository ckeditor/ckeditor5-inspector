/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import { Rnd } from 'react-rnd';
import InspectorUI, {
	DocsButton,
	ToggleButton,
	EditorInstanceSelector
} from '../../../src/components/ui';
import Tabs from '../../../src/components/tabs';
import ModelPane from '../../../src/components/model/pane';
import ViewPane from '../../../src/components/view/pane';
import CommandsPane from '../../../src/components/commands/pane';
import TestEditor from '../../utils/testeditor';

describe( '<InspectorUI />', () => {
	let editors, wrapper, editor1Element, editor2Element;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		window.localStorage.clear();

		editor1Element = document.createElement( 'div' );
		editor2Element = document.createElement( 'div' );

		document.body.appendChild( editor1Element );
		document.body.appendChild( editor2Element );

		return Promise.all( [
			TestEditor.create( editor1Element ),
			TestEditor.create( editor2Element )
		] ).then( ( [ editor1, editor2 ] ) => {
			editors = new Map( [ [ 'first', editor1 ], [ 'second', editor2 ] ] );
			wrapper = shallow(
				<InspectorUI editors={editors} />,
				{ attachTo: container }
			);
		} );
	} );

	afterEach( () => {
		wrapper.unmount();

		editor1Element.remove();
		editor2Element.remove();

		return Promise.all( Array.from( editors )
			.map( ( [ , editor ] ) => editor.destroy() ) );
	} );

	describe( 'state', () => {
		it( 'has initial state', () => {
			const state = wrapper.state();

			expect( state.editors ).to.equal( editors );
			expect( state.height ).to.equal( '400px' );
			expect( document.body.style.getPropertyValue( '--ck-inspector-height' ) ).to.equal( '400px' );
			expect( state.isCollapsed ).to.be.false;
			expect( state.currentEditorName ).to.equal( 'first' );
			expect( state.activeTab ).to.equal( 'Model' );
		} );

		it( 'restores state#height from the storage and sets it to body', () => {
			window.localStorage.setItem( 'ck5-inspector-height', '123px' );

			const wrapper = shallow(
				<InspectorUI editors={editors} />,
				{ attachTo: container }
			);

			expect( wrapper.state().height ).to.equal( '123px' );
			expect( document.body.style.getPropertyValue( '--ck-inspector-height' ) ).to.equal( '123px' );

			wrapper.unmount();
		} );

		describe( 'state#isCollapsed', () => {
			it( 'can be passed as a props and override the state saved in the storage', () => {
				window.localStorage.setItem( 'ck5-inspector-is-collapsed', 'false' );

				const wrapper = mount(
					<InspectorUI editors={editors} isCollapsed={true} />,
					{ attachTo: container }
				);

				expect( wrapper.state().isCollapsed ).to.be.true;

				wrapper.unmount();
			} );

			it( 'is restored from the storage', () => {
				window.localStorage.setItem( 'ck5-inspector-is-collapsed', 'true' );

				const wrapper = mount(
					<InspectorUI editors={editors} />,
					{ attachTo: container }
				);

				expect( wrapper.state().isCollapsed ).to.be.true;

				wrapper.unmount();
			} );
		} );

		it( 'restores state#activeTab from the storage', () => {
			window.localStorage.setItem( 'ck5-inspector-active-tab-name', 'Commands' );

			const wrapper = shallow(
				<InspectorUI editors={editors} />,
				{ attachTo: container }
			);

			expect( wrapper.state().activeTab ).to.equal( 'Commands' );

			wrapper.unmount();
		} );
	} );

	describe( 'handlePaneChange()', () => {
		it( 'changes state#activeTab and saves to the storage', () => {
			const instance = wrapper.instance();

			instance.handlePaneChange( 'Commands' );

			expect( wrapper.state().activeTab ).to.equal( 'Commands' );
			expect( window.localStorage.getItem( 'ck5-inspector-active-tab-name' ) ).to.equal( 'Commands' );
		} );
	} );

	describe( 'handleEditorChange()', () => {
		it( 'changes state#currentEditorName', () => {
			const instance = wrapper.instance();

			instance.handleEditorChange( 'second' );

			expect( wrapper.state().currentEditorName ).to.equal( 'second' );
		} );
	} );

	describe( 'handleToggleCollapseClick()', () => {
		it( 'changes state#isCollapsed and saves to the storage', () => {
			const instance = wrapper.instance();

			expect( wrapper.state().isCollapsed ).to.be.false;
			expect( window.localStorage.getItem( 'ck5-inspector-is-collapsed' ) ).to.be.null;

			instance.handleToggleCollapseClick();

			expect( wrapper.state().isCollapsed ).to.be.true;
			expect( window.localStorage.getItem( 'ck5-inspector-is-collapsed' ) ).to.equal( 'true' );
		} );
	} );

	describe( 'render()', () => {
		it( 'changes the class of document#body to sync with state#isCollapsed', () => {
			const instance = wrapper.instance();

			expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).to.be.true;
			expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).to.be.false;

			instance.setState( { isCollapsed: true } );

			expect( document.body.classList.contains( 'ck-inspector-body-expanded' ) ).to.be.false;
			expect( document.body.classList.contains( 'ck-inspector-body-collapsed' ) ).to.be.true;
		} );

		describe( 'resizable container', () => {
			it( 'is rendered', () => {
				expect( wrapper.find( Rnd ).first() ).to.have.lengthOf( 1 );
			} );

			describe( 'props', () => {
				it( 'has #bounds', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().bounds ).to.equal( 'window' );
				} );

				it( 'has #enableResizing', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().enableResizing ).to.deep.equal( { top: true } );

					wrapper.setState( { isCollapsed: true } );

					expect( wrapper.find( Rnd ).first().props().enableResizing ).to.deep.equal( { top: false } );
				} );

				it( 'has #disableDragging', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().disableDragging ).to.be.true;
				} );

				it( 'has #minHeight', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().minHeight ).to.equal( '100' );
				} );

				it( 'has #maxHeight', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().maxHeight ).to.equal( '100%' );
				} );

				it( 'has #style', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().style ).to.deep.equal( {
						position: 'fixed',
						bottom: '0',
						left: '0',
						right: '0',
						top: 'auto'
					} );
				} );

				it( 'has #className', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().className ).to.equal( 'ck-inspector ' );

					wrapper.setState( { isCollapsed: true } );

					expect( wrapper.find( Rnd ).first().props().className ).to.equal( 'ck-inspector ck-inspector_collapsed' );
				} );

				it( 'has #position', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().position ).to.deep.equal( { x: 0, y: '100%' } );
				} );

				it( 'has #size', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().size ).to.deep.equal( {
						width: '100%',
						height: '400px'
					} );

					wrapper.setState( { isCollapsed: true } );

					expect( wrapper.find( Rnd ).first().props().size ).to.deep.equal( {
						width: '100%',
						height: 30
					} );
				} );

				it( 'has #onResizeStop', () => {
					const rnd = wrapper.find( Rnd ).first();

					expect( rnd.props().onResizeStop ).to.equal( wrapper.instance().handleInspectorResize );

					wrapper.instance().handleInspectorResize( {}, {}, { style: { height: '321px' } } );

					expect( document.body.style.getPropertyValue( '--ck-inspector-height' ) ).to.equal( '321px' );
					expect( window.localStorage.getItem( 'ck5-inspector-height' ) ).to.equal( '321px' );
				} );
			} );
		} );

		describe( 'panes', () => {
			function getPanes() {
				return wrapper.find( Tabs ).first();
			}

			describe( 'props', () => {
				it( 'has #onTabChange', () => {
					const panes = getPanes();

					expect( panes.props().onTabChange ).to.equal( wrapper.instance().handlePaneChange );
				} );

				it( 'has #contentBefore', () => {
					const panes = getPanes();

					expect( mount( panes.props().contentBefore ).type() ).to.equal( DocsButton );
				} );

				it( 'has #activeTab', () => {
					const panes = getPanes();

					expect( panes.props().activeTab ).to.equal( 'Model' );

					wrapper.setState( { activeTab: 'Commands' } );

					expect( getPanes().props().activeTab ).to.equal( 'Commands' );
				} );

				describe( '#contentAfter', () => {
					function getSelector() {
						return mount( getPanes().props().contentAfter[ 0 ] );
					}

					function getToggle() {
						return mount( getPanes().props().contentAfter[ 1 ] );
					}

					it( 'has instance selector', () => {
						const selector = getSelector();

						expect( selector.type() ).to.equal( EditorInstanceSelector );

						expect( selector.props().currentEditorName ).to.equal( 'first' );
						wrapper.setState( { currentEditorName: 'second' } );
						expect( getSelector().props().currentEditorName ).to.equal( 'second' );

						expect( selector.props().editors ).to.equal( editors );
						wrapper.setState( { editors: new Map() } );
						expect( getSelector().props().editors ).to.deep.equal( new Map() );

						const spy = sinon.spy( wrapper.instance(), 'handleEditorChange' );

						selector.props().onChange( { target: { value: 'first' } } );
						sinon.assert.calledWithExactly( spy, 'first' );
					} );

					it( 'has toggle', () => {
						const toggle = getToggle();

						expect( toggle.type() ).to.equal( ToggleButton );

						expect( toggle.props().onClick ).to.equal( wrapper.instance().handleToggleCollapseClick );
						expect( toggle.props().isUp ).to.be.false;

						wrapper.setState( { isCollapsed: true } );

						expect( getToggle().props().isUp ).to.be.true;
					} );
				} );
			} );

			describe( 'children', () => {
				it( 'has a model pane', () => {
					expect( mount( getPanes().props().children[ 0 ] ).type() ).to.equal( ModelPane );
				} );

				it( 'has a view pane', () => {
					expect( mount( getPanes().props().children[ 1 ] ).type() ).to.equal( ViewPane );
				} );

				it( 'has a commands pane', () => {
					expect( mount( getPanes().props().children[ 2 ] ).type() ).to.equal( CommandsPane );
				} );
			} );
		} );
	} );

	describe( 'getDerivedStateFromProps()', () => {
		it( 'falls back to the first editor in props#editors when editor is removed', () => {
			wrapper.setState( { currentEditorName: 'second' } );
			editors.delete( 'second' );
			wrapper.setState( { editors } );

			expect( wrapper.state().currentEditorName ).to.equal( 'first' );
		} );
	} );
} );
