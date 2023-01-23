/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

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

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

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

		expect( modelState ).to.be.null;
	} );

	it( 'should create a default state if no model state was passed to the reducer', () => {
		modelState = modelReducer( globalState, null, {} );

		expect( modelState ).to.have.property( 'treeDefinition' );
		expect( modelState ).to.have.property( 'ranges' );
		expect( modelState ).to.have.property( 'markers' );
		expect( modelState ).to.have.property( 'currentNode' );
		expect( modelState ).to.have.property( 'currentNodeDefinition' );
		expect( modelState ).to.have.property( 'currentRootName' );
		expect( modelState ).to.have.property( 'ui' );
	} );

	describe( 'application state', () => {
		describe( '#currentRootName', () => {
			it( 'should be updated on setModelCurrentRootName() action', () => {
				modelState = modelReducer( globalState, modelState, setModelCurrentRootName( '$graveyard' ) );

				expect( modelState.currentRootName ).to.equal( '$graveyard' );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				modelState.currentRootName = null;

				modelState = modelReducer( globalState, modelState, setCurrentEditorName( 'b' ) );

				expect( modelState.currentRootName ).to.equal( 'main' );
			} );

			it( 'should reset other properties on setModelCurrentRootName() action', () => {
				modelState.currentNode = { root: { rootName: 'main' } };
				modelState.currentNodeDefinition = 'bar';
				modelState.treeDefinition = 'baz';
				modelState.ranges = 'qux';
				modelState.markers = 'abc';

				modelState = modelReducer( globalState, modelState, setModelCurrentRootName( '$graveyard' ) );

				expect( modelState.currentRootName ).to.equal( '$graveyard' );
				expect( modelState.currentNode ).to.be.null;
				expect( modelState.currentNodeDefinition ).to.be.null;
				expect( modelState.treeDefinition ).to.be.an( 'array' );
				expect( modelState.ranges ).to.be.an( 'array' );
				expect( modelState.markers ).to.be.an( 'array' );
			} );
		} );

		describe( '#currentNode', () => {
			it( 'should be updated on setModelCurrentNode() action', () => {
				const node = editorA.model.document.getRoot();

				modelState = modelReducer( globalState, modelState, setModelCurrentNode( node ) );

				expect( modelState.currentNode ).to.equal( node );
			} );

			it( 'should be reset on updateModelState() action if the root has changed', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNode = node;
				modelState.currentRootName = '$graveyard';
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNode ).to.be.null;
			} );

			it( 'should be reset on updateModelState() action if the #currentNode has no parent (and isn\'t a root)', () => {
				const node = editorA.model.document.getRoot().getChild( 0 );

				node.parent = null;

				modelState.currentNode = node;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNode ).to.be.null;
			} );

			it( 'should be reset on setActiveTab() action if the root has changed', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNode = node;
				modelState.currentRootName = '$graveyard';
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.currentNode ).to.be.null;
			} );
		} );

		describe( '#currentNodeDefinition', () => {
			it( 'should be updated when #currentNode is being updated', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNodeDefinition = null;
				modelState = modelReducer( globalState, modelState, setModelCurrentNode( node ) );

				expect( modelState.currentNodeDefinition ).to.be.an( 'object' );
			} );

			it( 'should be updated on updateModelState() action if the root has changed', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNode = node;
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNodeDefinition ).to.be.an( 'object' );
			} );

			it( 'should be reset when #currentRootname has changed', () => {
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, setModelCurrentRootName( '$graveyard' ) );

				expect( modelState.currentNodeDefinition ).to.be.null;
			} );

			it( 'should be reset on updateModelState() action if the root has changed', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNode = node;
				modelState.currentRootName = '$graveyard';
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNodeDefinition ).to.be.null;
			} );

			it( 'should be reset on updateModelState() action if the #currentNode has no parent (and isn\'t a root)', () => {
				const node = editorA.model.document.getRoot().getChild( 0 );

				node.parent = null;

				modelState.currentNode = node;
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNodeDefinition ).to.be.null;
			} );

			it( 'should be reset on setActiveTab() action if the root has changed', () => {
				const node = editorA.model.document.getRoot();

				modelState.currentNode = node;
				modelState.currentRootName = '$graveyard';
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.currentNodeDefinition ).to.be.null;
			} );

			it( 'should be reset on updateModelState() action if there is no #currentNode', () => {
				modelState.currentNode = null;
				modelState.currentRootName = '$graveyard';
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.currentNodeDefinition ).to.be.null;
			} );

			it( 'should be reset on setActiveTab() action if there is no #currentNode', () => {
				modelState.currentNode = null;
				modelState.currentRootName = '$graveyard';
				modelState.currentNodeDefinition = 'foo';
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.currentNodeDefinition ).to.be.null;
			} );
		} );

		describe( '#treeDefinition', () => {
			it( 'should reflect the model tree of the current root of the current editor', () => {
				const modelRoot = editorA.model.document.getRoot();

				modelState.treeDefinition = null;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.treeDefinition[ 0 ].node ).to.equal( modelRoot );
			} );

			it( 'should be updated on updateModelState() action', () => {
				modelState.treeDefinition = null;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.treeDefinition ).to.be.an( 'array' );
			} );

			it( 'should be updated on setActiveTab() action', () => {
				modelState.treeDefinition = null;
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.treeDefinition ).to.be.an( 'array' );
			} );

			it( 'should be updated on setEditors() action', () => {
				modelState.treeDefinition = null;
				modelState = modelReducer( globalState, modelState, setEditors( new Map( [ [ 'a', editorA ] ] ) ) );

				expect( modelState.treeDefinition ).to.be.an( 'array' );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				modelState.treeDefinition = null;
				modelState = modelReducer( globalState, modelState, setCurrentEditorName( 'b' ) );

				expect( modelState.treeDefinition ).to.be.an( 'array' );
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

				expect( selectionRange.start.path ).to.deep.equal( [ 0, 0 ] );
				expect( selectionRange.end.path ).to.deep.equal( [ 0, 3 ] );
			} );

			it( 'should be updated on updateModelState() action', () => {
				modelState.ranges = null;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.ranges ).to.be.an( 'array' );
			} );

			it( 'should be updated on setActiveTab() action', () => {
				modelState.ranges = null;
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.ranges ).to.be.an( 'array' );
			} );

			it( 'should be updated on setEditors() action', () => {
				modelState.ranges = null;
				modelState = modelReducer( globalState, modelState, setEditors( new Map( [ [ 'a', editorA ] ] ) ) );

				expect( modelState.ranges ).to.be.an( 'array' );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				modelState.ranges = null;
				modelState = modelReducer( globalState, modelState, setCurrentEditorName( 'b' ) );

				expect( modelState.ranges ).to.be.an( 'array' );
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

				expect( marker.name ).to.equal( 'foo:marker' );
				expect( marker.start.path ).to.deep.equal( [ 0, 1 ] );
				expect( marker.end.path ).to.deep.equal( [ 0, 3 ] );
			} );

			it( 'should be updated on updateModelState() action', () => {
				modelState.markers = null;
				modelState = modelReducer( globalState, modelState, updateModelState() );

				expect( modelState.markers ).to.be.an( 'array' );
			} );

			it( 'should be updated on setActiveTab() action', () => {
				modelState.markers = null;
				modelState = modelReducer( globalState, modelState, setActiveTab( 'Model' ) );

				expect( modelState.markers ).to.be.an( 'array' );
			} );

			it( 'should be updated on setEditors() action', () => {
				modelState.markers = null;
				modelState = modelReducer( globalState, modelState, setEditors( new Map( [ [ 'a', editorA ] ] ) ) );

				expect( modelState.markers ).to.be.an( 'array' );
			} );

			it( 'should be updated on setCurrentEditorName() action', () => {
				modelState.markers = null;
				modelState = modelReducer( globalState, modelState, setCurrentEditorName( 'b' ) );

				expect( modelState.ranges ).to.be.an( 'array' );
			} );
		} );
	} );

	describe( 'UI state', () => {
		it( 'should be created with defaults if the LocalStorage is empty', () => {
			modelState = modelReducer( globalState, {}, {} );

			expect( modelState.ui ).to.deep.equal( {
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

			expect( modelState.ui ).to.deep.equal( {
				activeTab: 'Selection',
				showMarkers: true,
				showCompactText: true
			} );
		} );

		describe( '#activeTab', () => {
			it( 'should be updated on setModelActiveTab() action', () => {
				modelState = modelReducer( globalState, modelState, setModelActiveTab( 'Selection' ) );

				expect( modelState.ui.activeTab ).to.equal( 'Selection' );
			} );

			it( 'should be saved in local storage when nupdated', () => {
				modelState = modelReducer( globalState, modelState, setModelActiveTab( 'Selection' ) );

				expect( LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) ).to.equal( 'Selection' );
			} );
		} );

		describe( '#showMarkers', () => {
			it( 'should be updated on toggleModelShowMarkers() action', () => {
				expect( modelState.ui.showMarkers ).to.be.false;

				modelState = modelReducer( globalState, modelState, toggleModelShowMarkers() );

				expect( modelState.ui.showMarkers ).to.be.true;
			} );

			it( 'should be saved in local storage when updated', () => {
				expect( modelState.ui.showMarkers ).to.be.false;

				modelState = modelReducer( globalState, modelState, toggleModelShowMarkers() );

				expect( LocalStorageManager.get( LOCAL_STORAGE_SHOW_MARKERS ) ).to.equal( 'true' );
			} );
		} );

		describe( '#showCompactText', () => {
			it( 'should be updated on toggleModelShowCompactText() action', () => {
				expect( modelState.ui.showCompactText ).to.be.false;

				modelState = modelReducer( globalState, modelState, toggleModelShowCompactText() );

				expect( modelState.ui.showCompactText ).to.be.true;
			} );

			it( 'should be saved in local storage when updated', () => {
				expect( modelState.ui.showCompactText ).to.be.false;

				modelState = modelReducer( globalState, modelState, toggleModelShowCompactText() );

				expect( LocalStorageManager.get( LOCAL_STORAGE_COMPACT_TEXT ) ).to.equal( 'true' );
			} );
		} );
	} );
} );
