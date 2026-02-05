/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { Paragraph } from 'ckeditor5';

import TestEditor from '../../../utils/testeditor';
import LocalStorageManager from '../../../../src/localstoragemanager';

import {
	modelReducer,

	LOCAL_STORAGE_ACTIVE_TAB,
	LOCAL_STORAGE_COMPACT_TEXT,
	LOCAL_STORAGE_SHOW_MARKERS
} from '../../../../src/model/data/reducer';

import {
	setModelCurrentRootName,
	setModelCurrentNode,
	updateModelState,

	setModelActiveTab,
	toggleModelShowMarkers,
	toggleModelShowCompactText
} from '../../../../src/model/data/actions';

import {
	setActiveTab,
	setEditors,
	setCurrentEditorName
} from '../../../../src/data/actions';

describe( 'model data store reducer', () => {
	let editorA, editorB;
	let elementA, elementB;
	let globalState, modelState;

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
						activeTab: 'Model'
					}
				};

				modelState = modelReducer( globalState, null, {} );
			} );
		} );
	} );

	afterEach( () => {
		return editorA.destroy().then( () => editorB.destroy() );
	} );

	it( 'should not create a state if ui#activeTab is different than "Model"', () => {
		globalState.ui.activeTab = 'View';

		modelState = modelReducer( globalState, null, {} );

		expect( modelState ).toBeNull();
	} );

	it( 'should create a default state if no model state was passed to the reducer', () => {
		modelState = modelReducer( globalState, null, {} );

		expect( modelState ).toHaveProperty( 'treeDefinition' );
		expect( modelState ).toHaveProperty( 'ranges' );
		expect( modelState ).toHaveProperty( 'markers' );
		expect( modelState ).toHaveProperty( 'currentNode' );
		expect( modelState ).toHaveProperty( 'currentNodeDefinition' );
		expect( modelState ).toHaveProperty( 'currentRootName' );
		expect( modelState ).toHaveProperty( 'ui' );
	} );

	describe( 'application state', () => {
		describe( '#currentRootName', () => {
			it( 'should be updated on setModelCurrentRootName() action', () => {
				modelState = modelReducer( globalState, modelState, setModelCurrentRootName( '$graveyard' ) );

				expect( modelState.currentRootName ).toBe( '$graveyard' );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				modelState.currentRootName = null;

				modelState = modelReducer( globalState, modelState, setCurrentEditorName( 'b' ) );

				expect( modelState.currentRootName ).toBe( 'main' );
			} );

			it( 'should reset other properties on setModelCurrentRootName() action', () => {
				modelState.currentNode = { root: { rootName: 'main' } };
				modelState.currentNodeDefinition = 'bar';
				modelState.treeDefinition = 'baz';
				modelState.ranges = 'qux';
				modelState.markers = 'abc';

				modelState = modelReducer( globalState, modelState, setModelCurrentRootName( '$graveyard' ) );

				expect( modelState.currentRootName ).toBe( '$graveyard' );
				expect( modelState.currentNode ).toBeNull();
				expect( modelState.currentNodeDefinition ).toBeNull();
				expect( modelState.treeDefinition ).toEqual( expect.any( Array ) );
				expect( modelState.ranges ).toEqual( expect.any( Array ) );
				expect( modelState.markers ).toEqual( expect.any( Array ) );
			} );
		} );

		describe( '#currentNode', () => {
			it( 'should be updated on setModelCurrentNode() action', () => {
				const node = editorA.model.document.getRoot();

				modelState = modelReducer( globalState, modelState, setModelCurrentNode( node ) );

				expect( modelState.currentNode ).toBe( node );
			} );

			it( 'should be reset on updateModelState() action if the root has changed', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNode = node;
				modelState.currentRootName = '$graveyard';
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNode ).toBeNull();
			} );

			it( 'should be reset on updateModelState() action if the #currentNode has no parent (and isn\'t a root)', () => {
				const node = editorA.model.document.getRoot().getChild( 0 );

				node.parent = null;

				modelState.currentNode = node;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNode ).toBeNull();
			} );

			it( 'should be reset on setActiveTab() action if the root has changed', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNode = node;
				modelState.currentRootName = '$graveyard';
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.currentNode ).toBeNull();
			} );
		} );

		describe( '#currentNodeDefinition', () => {
			it( 'should be updated when #currentNode is being updated', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNodeDefinition = null;
				modelState = modelReducer( globalState, modelState, setModelCurrentNode( node ) );

				expect( modelState.currentNodeDefinition ).toEqual( expect.any( Object ) );
			} );

			it( 'should be updated on updateModelState() action if the root has changed', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNode = node;
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNodeDefinition ).toEqual( expect.any( Object ) );
			} );

			it( 'should be reset when #currentRootname has changed', () => {
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, setModelCurrentRootName( '$graveyard' ) );

				expect( modelState.currentNodeDefinition ).toBeNull();
			} );

			it( 'should be reset on updateModelState() action if the root has changed', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNode = node;
				modelState.currentRootName = '$graveyard';
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNodeDefinition ).toBeNull();
			} );

			it( 'should be reset on updateModelState() action if the #currentNode has no parent (and isn\'t a root)', () => {
				const node = editorA.model.document.getRoot().getChild( 0 );

				node.parent = null;

				modelState.currentNode = node;
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNodeDefinition ).toBeNull();
			} );

			it( 'should be reset on setActiveTab() action if the root has changed', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNode = node;
				modelState.currentRootName = '$graveyard';
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.currentNodeDefinition ).toBeNull();
			} );

			it( 'should be reset on updateModelState() action if there is no #currentNode', () => {
				modelState.currentNode = null;
				modelState.currentRootName = '$graveyard';
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNodeDefinition ).toBeNull();
			} );

			it( 'should be reset on setActiveTab() action if there is no #currentNode', () => {
				modelState.currentNode = null;
				modelState.currentRootName = '$graveyard';
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.currentNodeDefinition ).toBeNull();
			} );
		} );

		describe( '#treeDefinition', () => {
			it( 'should reflect the model tree of the current root of the current editor', () => {
				const modelRoot = editorA.model.document.getRoot();

				modelState.treeDefinition = null;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.treeDefinition[ 0 ].node ).toBe( modelRoot );
			} );

			it( 'should be updated on updateModelState() action', () => {
				modelState.treeDefinition = null;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.treeDefinition ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setActiveTab() action', () => {
				modelState.treeDefinition = null;
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.treeDefinition ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setEditors() action', () => {
				modelState.treeDefinition = null;
				modelState = modelReducer( globalState, modelState, setEditors( new Map( [ [ 'a', editorA ] ] ) ) );

				expect( modelState.treeDefinition ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				modelState.treeDefinition = null;
				modelState = modelReducer( globalState, modelState, setCurrentEditorName( 'b' ) );

				expect( modelState.treeDefinition ).toEqual( expect.any( Array ) );
			} );
		} );

		describe( '#ranges', () => {
			it( 'should reflect the ranges in the current root of the current editor', () => {
				editorA.model.change( writer => {
					writer.setSelection( editorA.model.document.getRoot(), 'in' );
				} );

				modelState.ranges = null;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				const selectionRange = modelState.ranges[ 0 ];

				expect( selectionRange.start.path ).toEqual( [ 0, 0 ] );
				expect( selectionRange.end.path ).toEqual( [ 0, 3 ] );
			} );

			it( 'should be updated on updateModelState() action', () => {
				modelState.ranges = null;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.ranges ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setActiveTab() action', () => {
				modelState.ranges = null;
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.ranges ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setEditors() action', () => {
				modelState.ranges = null;
				modelState = modelReducer( globalState, modelState, setEditors( new Map( [ [ 'a', editorA ] ] ) ) );

				expect( modelState.ranges ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				modelState.ranges = null;
				modelState = modelReducer( globalState, modelState, setCurrentEditorName( 'b' ) );

				expect( modelState.ranges ).toEqual( expect.any( Array ) );
			} );
		} );

		describe( '#markers', () => {
			beforeEach( () => {
				const model = editorA.model;

				model.change( writer => {
					const root = model.document.getRoot();
					const range = model.createRange(
						model.createPositionFromPath( root, [ 0, 1 ] ),
						model.createPositionFromPath( root, [ 0, 3 ] )
					);

					writer.addMarker( 'foo:marker', { range, usingOperation: false, affectsData: true } );
				} );
			} );

			it( 'should reflect the markers in the current root of the current editor', () => {
				editorA.model.change( writer => {
					writer.setSelection( editorA.model.document.getRoot(), 'in' );
				} );

				modelState.markers = null;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				const marker = modelState.markers[ 0 ];

				expect( marker.name ).toBe( 'foo:marker' );
				expect( marker.start.path ).toEqual( [ 0, 1 ] );
				expect( marker.end.path ).toEqual( [ 0, 3 ] );
			} );

			it( 'should be updated on updateModelState() action', () => {
				modelState.markers = null;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.markers ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setActiveTab() action', () => {
				modelState.markers = null;
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.markers ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setEditors() action', () => {
				modelState.markers = null;
				modelState = modelReducer( globalState, modelState, setEditors( new Map( [ [ 'a', editorA ] ] ) ) );

				expect( modelState.markers ).toEqual( expect.any( Array ) );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				modelState.markers = null;
				modelState = modelReducer( globalState, modelState, setCurrentEditorName( 'b' ) );

				expect( modelState.ranges ).toEqual( expect.any( Array ) );
			} );
		} );
	} );

	describe( 'UI state', () => {
		it( 'should be created with defaults if the LocalStorage is empty', () => {
			modelState = modelReducer( globalState, {}, {} );

			expect( modelState.ui ).toEqual( {
				activeTab: 'Inspect',
				showMarkers: false,
				showCompactText: false
			} );
		} );

		it( 'should be loaded from the LocalStorage', () => {
			LocalStorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, 'Selection' );
			LocalStorageManager.set( LOCAL_STORAGE_SHOW_MARKERS, 'true' );
			LocalStorageManager.set( LOCAL_STORAGE_COMPACT_TEXT, 'true' );

			modelState = modelReducer( globalState, {}, {} );

			expect( modelState.ui ).toEqual( {
				activeTab: 'Selection',
				showMarkers: true,
				showCompactText: true
			} );
		} );

		describe( '#activeTab', () => {
			it( 'should be updated on setModelActiveTab() action', () => {
				modelState = modelReducer( globalState, modelState, setModelActiveTab( 'Selection' ) );

				expect( modelState.ui.activeTab ).toBe( 'Selection' );
			} );

			it( 'should be saved in local storage when nupdated', () => {
				modelState = modelReducer( globalState, modelState, setModelActiveTab( 'Selection' ) );

				expect( LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) ).toBe( 'Selection' );
			} );
		} );

		describe( '#showMarkers', () => {
			it( 'should be updated on toggleModelShowMarkers() action', () => {
				expect( modelState.ui.showMarkers ).toBe( false );

				modelState = modelReducer( globalState, modelState, toggleModelShowMarkers() );

				expect( modelState.ui.showMarkers ).toBe( true );
			} );

			it( 'should be saved in local storage when updated', () => {
				expect( modelState.ui.showMarkers ).toBe( false );

				modelState = modelReducer( globalState, modelState, toggleModelShowMarkers() );

				expect( LocalStorageManager.get( LOCAL_STORAGE_SHOW_MARKERS ) ).toBe( 'true' );
			} );
		} );

		describe( '#showCompactText', () => {
			it( 'should be updated on toggleModelShowCompactText() action', () => {
				expect( modelState.ui.showCompactText ).toBe( false );

				modelState = modelReducer( globalState, modelState, toggleModelShowCompactText() );

				expect( modelState.ui.showCompactText ).toBe( true );
			} );

			it( 'should be saved in local storage when updated', () => {
				expect( modelState.ui.showCompactText ).toBe( false );

				modelState = modelReducer( globalState, modelState, toggleModelShowCompactText() );

				expect( LocalStorageManager.get( LOCAL_STORAGE_COMPACT_TEXT ) ).toBe( 'true' );
			} );
		} );
	} );
} );
