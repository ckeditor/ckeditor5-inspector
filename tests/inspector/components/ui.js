/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import InspectorUI from '../../../src/components/ui';
import TestEditor from '../../utils/testeditor';

/* global window */

describe( '<InspectorUI />', () => {
	let editors, wrapper, clickSpy;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		window.localStorage.clear();

		return Promise.all( [
			TestEditor.create(),
			TestEditor.create()
		] ).then( ( [ editor1, editor2 ] ) => {
			editors = new Map( [ [ 'first', editor1 ], [ 'second', editor2 ] ] );

			clickSpy = sinon.spy();
			wrapper = mount(
				<InspectorUI editors={editors} />,
				{ attachTo: container }
			);
		} );
	} );

	afterEach( () => {
		wrapper.unmount();

		return Promise.all( [
			editors.get( 'first' ).destroy(),
			editors.get( 'second' ).destroy()
		] );
	} );

	it( 'has initial state', () => {
		const state = wrapper.state();

		expect( state.editors ).to.equal( editors );
		expect( state.isCollapsed ).to.be.false;
		expect( state.currentEditorName ).to.equal( 'first' );
		expect( state.activePane ).to.equal( 'Model' );
	} );

	describe( 'handlePaneChange()', () => {
		it( 'changes state#activePane and saves to the storage', () => {
			const instance = wrapper.instance();

			instance.handlePaneChange( 'Commands' );

			expect( wrapper.state().activePane ).to.equal( 'Commands' );
			expect( window.localStorage.getItem( 'ck5-inspector-active-pane-name' ) ).to.equal( 'Commands' );
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
		it( 'changes the style of document#body', () => {
			const instance = wrapper.instance();
		} );
	} );
} );
