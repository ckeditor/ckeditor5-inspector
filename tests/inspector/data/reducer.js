/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import TestEditor from '../../utils/testeditor';
import LocalStorageManager from '../../../src/localstoragemanager';

import {
	reducer,
	LOCAL_STORAGE_ACTIVE_TAB,
	LOCAL_STORAGE_IS_COLLAPSED,
	LOCAL_STORAGE_INSPECTOR_HEIGHT,
	LOCAL_STORAGE_SIDE_PANE_WIDTH
} from '../../../src/data/reducer';

import {
	setEditors,
	setCurrentEditorName,
	setHeight,
	toggleIsCollapsed,
	setSidePaneWidth,
	setActiveTab
} from '../../../src/data/actions';

describe( 'global data store reducer', () => {
	let editorA, editorB, editors, currentEditor, currentEditorName;
	let elementA, elementB;
	let state;

	beforeEach( () => {
		window.localStorage.clear();

		elementA = document.createElement( 'div' );
		elementB = document.createElement( 'div' );
		document.body.appendChild( elementA );
		document.body.appendChild( elementB );

		return TestEditor.create( elementA ).then( newEditor => {
			editorA = newEditor;

			return TestEditor.create( elementB ).then( newEditor => {
				editorB = newEditor;

				editors = new Map( [
					[ 'a', editorA ],
					[ 'b', editorB ]
				] );

				currentEditor = editorA;
				currentEditorName = 'a';

				state = reducer( {
					editors,
					currentEditor,
					currentEditorName,
					ui: {}
				}, {} );
			} );
		} );
	} );

	afterEach( () => {
		return editorA.destroy().then( () => editorB.destroy() );
	} );

	it( 'should create a data state', () => {
		expect( state ).to.have.property( 'model' );
		expect( state ).to.have.property( 'view' );
		expect( state ).to.have.property( 'commands' );
	} );

	describe( 'application state', () => {
		describe( '#editors', () => {
			it( 'should be updated on SET_EDITORS action', () => {
				state = reducer( state, setEditors( new Map( [ [ 'b', editorB ] ] ) ) );

				expect( [ ...state.editors ] ).to.deep.equal( [
					[ 'b', editorB ]
				] );
			} );

			it( 'should reset #currentEditor and #currentEditorName when there are no editors', () => {
				state.currentEditor = editorB;
				state.currentEditorName = 'b';

				state = reducer( state, setEditors( new Map() ) );

				expect( [ ...state.editors ] ).to.deep.equal( [] );
				expect( state.currentEditor ).to.be.null;
				expect( state.currentEditorName ).to.be.null;
			} );

			it( 'should set #currentEditor and #currentEditorName to the first editor if current one is not in editors', () => {
				state.currentEditor = editorB;
				state.currentEditorName = 'b';

				state = reducer( state, setEditors( new Map( [ [ 'a', editorA ] ] ) ) );

				expect( state.currentEditor ).to.equal( editorA );
				expect( state.currentEditorName ).to.equal( 'a' );
			} );
		} );

		describe( '#currentEditorName', () => {
			it( 'should be updated on SET_CURRENT_EDITOR_NAME action', () => {
				state = reducer( state, setCurrentEditorName( 'b' ) );

				expect( state.currentEditorName ).to.equal( 'b' );
			} );

			it( 'should change the #currentEditor', () => {
				state = reducer( state, setCurrentEditorName( 'b' ) );

				expect( state.currentEditor ).to.equal( editorB );
			} );
		} );
	} );

	describe( 'UI state', () => {
		it( 'should be created with defaults if the LocalStorage is empty', () => {
			expect( state.ui ).to.deep.equal( {
				activeTab: 'Model',
				isCollapsed: false,
				height: '400px',
				sidePaneWidth: '500px'
			} );
		} );

		it( 'should be loaded from the LocalStorage', () => {
			LocalStorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, 'View' );
			LocalStorageManager.set( LOCAL_STORAGE_IS_COLLAPSED, 'true' );
			LocalStorageManager.set( LOCAL_STORAGE_INSPECTOR_HEIGHT, '123px' );
			LocalStorageManager.set( LOCAL_STORAGE_SIDE_PANE_WIDTH, '321px' );

			const state = reducer( {
				editors,
				currentEditor,
				currentEditorName,
				ui: {}
			}, {} );

			expect( state.ui ).to.deep.equal( {
				activeTab: 'View',
				isCollapsed: true,
				height: '123px',
				sidePaneWidth: '321px'
			} );
		} );

		describe( '#height', () => {
			it( 'should be updated on SET_HEIGHT action', () => {
				state = reducer( state, setHeight( '60px' ) );

				expect( state.ui.height ).to.equal( '60px' );
			} );

			it( 'should be saved in local storage when nupdated', () => {
				state = reducer( state, setHeight( '60px' ) );

				expect( LocalStorageManager.get( LOCAL_STORAGE_INSPECTOR_HEIGHT ) ).to.equal( '60px' );
			} );
		} );

		describe( '#isCollapsed', () => {
			it( 'should be updated on TOGGLE_IS_COLLAPSED action', () => {
				expect( state.ui.isCollapsed ).to.be.false;

				state = reducer( state, toggleIsCollapsed() );

				expect( state.ui.isCollapsed ).to.be.true;
			} );

			it( 'should be saved in local storage when nupdated', () => {
				state = reducer( state, toggleIsCollapsed() );

				expect( LocalStorageManager.get( LOCAL_STORAGE_IS_COLLAPSED ) ).to.equal( 'true' );
			} );
		} );

		describe( '#sidePaneWidth', () => {
			it( 'should be updated on SET_SIDE_PANE_WIDTH action', () => {
				state = reducer( state, setSidePaneWidth( '160px' ) );

				expect( state.ui.sidePaneWidth ).to.equal( '160px' );
			} );

			it( 'should be saved in local storage when nupdated', () => {
				state = reducer( state, setSidePaneWidth( '160px' ) );

				expect( LocalStorageManager.get( LOCAL_STORAGE_SIDE_PANE_WIDTH ) ).to.equal( '160px' );
			} );
		} );

		describe( '#activeTab', () => {
			it( 'should be updated on SET_SIDE_PANE_WIDTH action', () => {
				state = reducer( state, setActiveTab( 'Model' ) );

				expect( state.ui.activeTab ).to.equal( 'Model' );
			} );

			it( 'should be saved in local storage when nupdated', () => {
				state = reducer( state, setActiveTab( 'View' ) );

				expect( LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) ).to.equal( 'View' );
			} );
		} );
	} );
} );
