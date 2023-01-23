/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	toggleIsCollapsed,
	setHeight,
	setSidePaneWidth,
	setEditors,
	setCurrentEditorName,
	updateCurrentEditorIsReadOnly,
	setActiveTab,

	TOGGLE_IS_COLLAPSED,
	SET_HEIGHT,
	SET_SIDE_PANE_WIDTH,
	SET_EDITORS,
	SET_CURRENT_EDITOR_NAME,
	SET_ACTIVE_INSPECTOR_TAB,
	UPDATE_CURRENT_EDITOR_IS_READ_ONLY
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
			type: SET_ACTIVE_INSPECTOR_TAB,
			tabName: 'foo'
		} );
	} );

	it( 'should export updateCurrentEditorIsReadOnly()', () => {
		expect( updateCurrentEditorIsReadOnly() ).to.deep.equal( {
			type: UPDATE_CURRENT_EDITOR_IS_READ_ONLY
		} );
	} );
} );
