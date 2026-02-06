/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';

import {
	setViewCurrentRootName,
	setViewCurrentNode,
	setViewActiveTab,
	toggleViewShowElementTypes,
	updateViewState,

	SET_VIEW_CURRENT_ROOT_NAME,
	SET_VIEW_CURRENT_NODE,
	SET_VIEW_ACTIVE_TAB,
	TOGGLE_VIEW_SHOW_ELEMENT_TYPES,
	UPDATE_VIEW_STATE
} from '../../../../src/view/data/actions';

describe( 'view data store actions', () => {
	it( 'should export setViewCurrentRootName()', () => {
		expect( setViewCurrentRootName( 'foo' ) ).toEqual( {
			type: SET_VIEW_CURRENT_ROOT_NAME,
			currentRootName: 'foo'
		} );
	} );

	it( 'should export setViewCurrentNode()', () => {
		expect( setViewCurrentNode( 'foo' ) ).toEqual( {
			type: SET_VIEW_CURRENT_NODE,
			currentNode: 'foo'
		} );
	} );

	it( 'should export setViewActiveTab()', () => {
		expect( setViewActiveTab( 'foo' ) ).toEqual( {
			type: SET_VIEW_ACTIVE_TAB,
			tabName: 'foo'
		} );
	} );

	it( 'should export toggleViewShowElementTypes()', () => {
		expect( toggleViewShowElementTypes() ).toEqual( {
			type: TOGGLE_VIEW_SHOW_ELEMENT_TYPES
		} );
	} );

	it( 'should export updateViewState()', () => {
		expect( updateViewState() ).toEqual( {
			type: UPDATE_VIEW_STATE
		} );
	} );
} );
