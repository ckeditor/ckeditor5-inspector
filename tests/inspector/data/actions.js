/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	toggleIsCollapsed,
	setHeight,
	setSidePaneWidth,
	setEditors,
	setCurrentEditorName,
	setActiveTab,

	TOGGLE_IS_COLLAPSED,
	SET_HEIGHT,
	SET_SIDE_PANE_WIDTH,
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	SET_ACTIVE_TAB
} from '../../../src/data/actions';

describe( 'global data store actions', () => {
	it( 'should export toggleIsCollapsed()', () => {
		expect( toggleIsCollapsed() ).to.deep.equal( {
			type: TOGGLE_IS_COLLAPSED
		} );
	} );

	it( 'should export setHeight()', () => {
		expect( setHeight( '100px' ) ).to.deep.equal( {
			type: SET_HEIGHT,
			newHeight: '100px'
		} );
	} );

	it( 'should export setSidePaneWidth()', () => {
		expect( setSidePaneWidth( '123px' ) ).to.deep.equal( {
			type: SET_SIDE_PANE_WIDTH,
			newWidth: '123px'
		} );
	} );

	it( 'should export setEditors()', () => {
		expect( setEditors( { foo: 'bar' } ) ).to.deep.equal( {
			type: SET_EDITORS,
			editors: { foo: 'bar' }
		} );
	} );

	it( 'should export setCurrentEditorName()', () => {
		expect( setCurrentEditorName( 'foo' ) ).to.deep.equal( {
			type: SET_CURRENT_EDITOR_NAME,
			editorName: 'foo'
		} );
	} );

	it( 'should export setActiveTab()', () => {
		expect( setActiveTab( 'foo' ) ).to.deep.equal( {
			type: SET_ACTIVE_TAB,
			tabName: 'foo'
		} );
	} );
} );
