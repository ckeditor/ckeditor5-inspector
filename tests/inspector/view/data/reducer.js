/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { Paragraph } from 'ckeditor5';

import TestEditor from '../../../utils/testeditor';
import LocalStorageManager from '../../../../src/localstoragemanager';

import {
	viewReducer,

	LOCAL_STORAGE_ACTIVE_TAB,
	LOCAL_STORAGE_ELEMENT_TYPES
} from '../../../../src/view/data/reducer';

import {
	setViewCurrentRootName,
	setViewCurrentNode,
	updateViewState,

	setViewActiveTab,
	toggleViewShowElementTypes
} from '../../../../src/view/data/actions';

import {
	setActiveTab,
	setEditors,
	setCurrentEditorName
} from '../../../../src/data/actions';

describe( 'view data store reducer', () => {
	let editorA, editorB;
	let elementA, elementB;
	let globalState, viewState;

	beforeEach( () => {
		window.localStorage.clear();

		elementA = document.createElement( 'div' );
		elementB = document.createElement( 'div' );
		document.body.appendChild( elementA );
		document.body.appendChild( elementB );

		return TestEditor.create( elementA, {
			plugins: [ Paragraph ],
			initialData: '<p>foo</p>'
		} ).then( newEditor => {
			editorA = newEditor;

			return TestEditor.create( elementB ).then( newEditor => {
				editorB = newEditor;

				globalState = {
					currentEditorName: 'a',
					editors: new Map( [
						[ 'a', editorA ],
						[ 'b', editorB ]
					] ),
					ui: {
						activeTab: 'View'
					}
				};

				viewState = viewReducer( globalState, null, {} );
			} );
		} );
	} );

	afterEach( () => {
		return editorA.destroy().then( () => editorB.destroy() );
	} );

	it( 'should not create a state if ui#activeTab is different than "View"', () => {
		globalState.ui.activeTab = 'Model';

		viewState = viewReducer( globalState, null, {} );

		expect( viewState ).toBeNull();
	} );

	it( 'should create a default state if no model state was passed to the reducer', () => {
		viewState = viewReducer( globalState, null, {} );

		expect( viewState ).toHaveProperty( 'treeDefinition' );
		expect( viewState ).toHaveProperty( 'ranges' );
		expect( viewState ).toHaveProperty( 'currentNode' );
		expect( viewState ).toHaveProperty( 'currentNodeDefinition' );
		expect( viewState ).toHaveProperty( 'currentRootName' );
		expect( viewState ).toHaveProperty( 'ui' );
	} );

	describe( 'application state', () => {
		describe( '#currentRootName', () => {
			it( 'should be updated on setViewCurrentRootName() action', () => {
				viewState.currentRootName = null;

				viewState = viewReducer( globalState, viewState, setViewCurrentRootName( 'main' ) );

				expect( viewState.currentRootName ).toBe( 'main' );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				viewState.currentRootName = null;

				viewState = viewReducer( globalState, viewState, setCurrentEditorName( 'b' ) );

				expect( viewState.currentRootName ).toBe( 'main' );
			} );

			it( 'should reset other properties on setViewCurrentRootName() action', () => {
				viewState.currentNode = { root: { rootName: 'main' }, is: () => true };
				viewState.currentRootName = null;
				viewState.currentNodeDefinition = 'bar';
				viewState.treeDefinition = 'baz';
				viewState.ranges = 'qux';
				viewState.markers = 'abc';

				viewState = viewReducer( globalState, viewState, setViewCurrentRootName( 'main' ) );

				expect( viewState.currentRootName ).toBe( 'main' );
				expect( viewState.currentNode ).toBeNull();
				expect( viewState.currentNodeDefinition ).toBeNull();
				expect( viewState.treeDefinition ).toEqual( expect.any( Array ) );
				expect( viewState.ranges ).toEqual( expect.any( Array ) );
			} );
		} );

		describe( '#currentNode', () => {
			it( 'should be updated on setViewCurrentNode() action', () => {
				const node = editorA.editing.view.document.getRoot();

				viewState = viewReducer( globalState, viewState, setViewCurrentNode( node ) );

				expect( viewState.currentNode ).toBe( node );
			} );

			it( 'should be reset on updateViewState() action if the root has changed', () => {
				const node = editorA.editing.view.document.getRoot();

				node.root.rootName = 'other-root';

				viewState.currentNode = node;
				viewState.currentRootName = 'main';
				viewState = viewReducer( globalState, viewState, updateViewState() );

				expect( viewState.currentNode ).toBeNull();
			} );

			it( 'should be reset on updateViewState() action if the currentNode has no parent (but isn\'t a root)', () => {
				const node = editorA.editing.view.document.getRoot().getChild( 0 );

				node.parent = null;

				viewState.currentNode = node;
				viewState.currentRootName = 'main';
				viewState = viewReducer( globalState, viewState, updateViewState() );

				expect( viewState.currentNode ).toBeNull();
			} );

			it( 'should be reset on setActiveTab() action if the root has changed', () => {
				const node = editorA.editing.view.document.getRoot();

				node.root.rootName = 'other-root';

				viewState.currentNode = node;
				viewState.currentRootName = 'main';
				viewState = viewReducer( globalState, viewState, setActiveTab( 'View' ) );

				expect( viewState.currentNode ).toBeNull();
			} );
		} );

		describe( '#currentNodeDefinition', () => {
			it( 'should be updated when #currentNode is being updated', () => {
				const node = editorA.editing.view.document.getRoot();

				viewState.currentNodeDefinition = null;
				viewState = viewReducer( globalState, viewState, setViewCurrentNode( node ) );

				expect( viewState.currentNodeDefinition ).toEqual( expect.any( Object ) );
			} );

			it( 'should be reset when #currentRootname has changed', () => {
				viewState.currentNodeDefinition = 'foo';
				viewState = viewReducer( globalState, viewState, setViewCurrentRootName( 'main' ) );

				expect( viewState.currentNodeDefinition ).toBeNull();
			} );

			it( 'should be updated on updateViewState() action if the root has changed', () => {
				const node = editorA.editing.view.document.getRoot();

				viewState.currentNode = node;
				viewState.currentRootName = null;
				viewState.currentNodeDefinition = 'foo';
				viewState = viewReducer( globalState, viewState, updateViewState() );

				expect( viewState.currentNodeDefinition ).toBeNull();
			} );

			it( 'should be reset on updateViewState() action if the currentNode has no parent (but isn\'t a root)', () => {
				const node = editorA.editing.view.document.getRoot().getChild( 0 );

				node.parent = null;

				viewState.currentNode = node;
				viewState.currentRootName = 'main';
				viewState.currentNodeDefinition = 'foo';
				viewState = viewReducer( globalState, viewState, updateViewState() );

				expect( viewState.currentNodeDefinition ).toBeNull();
			} );

			it( 'should be updated on setActiveTab() action if the root has changed', () => {
				const node = editorA.editing.view.document.getRoot();

				viewState.currentNode = node;
				viewState.currentRootName = null;
				viewState.currentNodeDefinition = 'foo';
				viewState = viewReducer( globalState, viewState, setActiveTab( 'View' ) );

				expect( viewState.currentNodeDefinition ).toBeNull();
			} );

			it( 'should be reset on updateViewState() action if there is no #currentNode', () => {
				viewState.currentNode = null;
				viewState.currentRootName = 'main';
				viewState.currentNodeDefinition = 'foo';
				viewState = viewReducer( globalState, viewState, updateViewState() );

				expect( viewState.currentNodeDefinition ).toBeNull();
			} );

			it( 'should be reset on setActiveTab() action if there is no #currentNode', () => {
				viewState.currentNode = null;
				viewState.currentRootName = 'main';
				viewState.currentNodeDefinition = 'foo';
				viewState = viewReducer( globalState, viewState, setActiveTab( 'Model' ) );

				expect( viewState.currentNodeDefinition ).toBeNull();
			} );
		} );

		describe( '#treeDefinition', () => {
			it( 'should reflect the view tree of the current root of the current editor', () => {
				const viewRoot = editorA.editing.view.document.getRoot();

				viewState.treeDefinition = null;
				viewState = viewReducer( globalState, viewState, updateViewState() );

				expect( viewState.treeDefinition[ 0 ].node ).toBe( viewRoot );
			} );

			it( 'should be updated on updateViewState() action', () => {
				viewState.treeDefinition = null;
				viewState = viewReducer( globalState, viewState, updateViewState() );

				expect( viewState.treeDefinition ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setActiveTab() action', () => {
				viewState.treeDefinition = null;
				viewState = viewReducer( globalState, viewState, setActiveTab( 'Model' ) );

				expect( viewState.treeDefinition ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setEditors() action', () => {
				viewState.treeDefinition = null;
				viewState = viewReducer( globalState, viewState, setEditors( new Map( [ [ 'a', editorA ] ] ) ) );

				expect( viewState.treeDefinition ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				viewState.treeDefinition = null;
				viewState = viewReducer( globalState, viewState, setCurrentEditorName( 'b' ) );

				expect( viewState.treeDefinition ).toEqual( expect.any( Array ) );
			} );
		} );

		describe( '#ranges', () => {
			it( 'should reflect the ranges in the current root of the current editor', () => {
				editorA.model.change( writer => {
					writer.setSelection( editorA.model.document.getRoot(), 'in' );
				} );

				viewState.ranges = null;
				viewState = viewReducer( globalState, viewState, updateViewState() );

				const selectionRange = viewState.ranges[ 0 ];

				expect( selectionRange.start.path ).toEqual( [ 0, 0, 0 ] );
				expect( selectionRange.end.path ).toEqual( [ 0, 0, 3 ] );
			} );

			it( 'should be updated on updateViewState() action', () => {
				viewState.ranges = null;
				viewState = viewReducer( globalState, viewState, updateViewState() );

				expect( viewState.ranges ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setActiveTab() action', () => {
				viewState.ranges = null;
				viewState = viewReducer( globalState, viewState, setActiveTab( 'Model' ) );

				expect( viewState.ranges ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setEditors() action', () => {
				viewState.ranges = null;
				viewState = viewReducer( globalState, viewState, setEditors( new Map( [ [ 'a', editorA ] ] ) ) );

				expect( viewState.ranges ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				viewState.ranges = null;
				viewState = viewReducer( globalState, viewState, setCurrentEditorName( 'b' ) );

				expect( viewState.ranges ).toEqual( expect.any( Array ) );
			} );
		} );
	} );

	describe( 'UI state', () => {
		it( 'should be created with defaults if the LocalStorage is empty', () => {
			viewState = viewReducer( globalState, {}, {} );

			expect( viewState.ui ).toEqual( {
				activeTab: 'Inspect',
				showElementTypes: false
			} );
		} );

		it( 'should be loaded from the LocalStorage', () => {
			LocalStorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, 'Selection' );
			LocalStorageManager.set( LOCAL_STORAGE_ELEMENT_TYPES, 'true' );

			viewState = viewReducer( globalState, {}, {} );

			expect( viewState.ui ).toEqual( {
				activeTab: 'Selection',
				showElementTypes: true
			} );
		} );

		describe( '#activeTab', () => {
			it( 'should be updated on setViewActiveTab() action', () => {
				viewState = viewReducer( globalState, viewState, setViewActiveTab( 'Selection' ) );

				expect( viewState.ui.activeTab ).toBe( 'Selection' );
			} );

			it( 'should be saved in local storage when nupdated', () => {
				viewState = viewReducer( globalState, viewState, setViewActiveTab( 'Selection' ) );

				expect( LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) ).toBe( 'Selection' );
			} );
		} );

		describe( '#showElementTypes', () => {
			it( 'should be updated on toggleViewShowElementTypes() action', () => {
				expect( viewState.ui.showElementTypes ).toBe( false );

				viewState = viewReducer( globalState, viewState, toggleViewShowElementTypes() );

				expect( viewState.ui.showElementTypes ).toBe( true );
			} );

			it( 'should be saved in local storage when updated', () => {
				expect( viewState.ui.showElementTypes ).toBe( false );

				viewState = viewReducer( globalState, viewState, toggleViewShowElementTypes() );

				expect( LocalStorageManager.get( LOCAL_STORAGE_ELEMENT_TYPES ) ).toBe( 'true' );
			} );
		} );
	} );
} );
