/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';

import {
	setModelCurrentRootName,
	setModelCurrentNode,
	setModelActiveTab,
	toggleModelShowMarkers,
	toggleModelShowCompactText,
	updateModelState,

	SET_MODEL_CURRENT_ROOT_NAME,
	SET_MODEL_CURRENT_NODE,
	SET_MODEL_ACTIVE_TAB,
	TOGGLE_MODEL_SHOW_MARKERS,
	TOGGLE_MODEL_SHOW_COMPACT_TEXT,
	UPDATE_MODEL_STATE
} from '../../../../src/model/data/actions';

describe( 'model data store actions', () => {
	it( 'should export setModelCurrentRootName()', () => {
		expect( setModelCurrentRootName( 'foo' ) ).toEqual( {
			type: SET_MODEL_CURRENT_ROOT_NAME,
			currentRootName: 'foo'
		} );
	} );

	it( 'should export setModelCurrentNode()', () => {
		expect( setModelCurrentNode( 'foo' ) ).toEqual( {
			type: SET_MODEL_CURRENT_NODE,
			currentNode: 'foo'
		} );
	} );

	it( 'should export setModelActiveTab()', () => {
		expect( setModelActiveTab( 'foo' ) ).toEqual( {
			type: SET_MODEL_ACTIVE_TAB,
			tabName: 'foo'
		} );
	} );

	it( 'should export toggleModelShowMarkers()', () => {
		expect( toggleModelShowMarkers() ).toEqual( {
			type: TOGGLE_MODEL_SHOW_MARKERS
		} );
	} );

	it( 'should export toggleModelShowCompactText()', () => {
		expect( toggleModelShowCompactText() ).toEqual( {
			type: TOGGLE_MODEL_SHOW_COMPACT_TEXT
		} );
	} );

	it( 'should export updateModelState()', () => {
		expect( updateModelState() ).toEqual( {
			type: UPDATE_MODEL_STATE
		} );
	} );
} );
