/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import TestEditor from '../../../utils/testeditor';
import schemaReducer from '../../../../src/schema/data/reducer';

import {
	setSchemaCurrentDefinitionName
} from '../../../../src/schema/data/actions';

import {
	setActiveTab,
	setEditors,
	setCurrentEditorName
} from '../../../../src/data/actions';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

describe( 'schema data store reducer', () => {
	let editorA, editorB;
	let elementA, elementB;
	let globalState, schemaState;

	beforeEach( async () => {
		window.localStorage.clear();

		elementA = document.createElement( 'div' );
		elementB = document.createElement( 'div' );
		document.body.appendChild( elementA );
		document.body.appendChild( elementB );

		editorA = await TestEditor.create( elementA, {
			plugins: [ Paragraph ],
			initialData: '<p>foo</p>'
		} );

		editorB = await TestEditor.create( elementB );

		globalState = {
			currentEditorName: 'a',
			editors: new Map( [
				[ 'a', editorA ],
				[ 'b', editorB ]
			] ),
			ui: {
				activeTab: 'Schema'
			}
		};

		schemaState = schemaReducer( globalState, null, {} );
	} );

	afterEach( async () => {
		await editorA.destroy();
		await editorB.destroy();
	} );

	it( 'should not create a state if ui#activeTab is different than "Schema"', () => {
		globalState.ui.activeTab = 'Model';

		schemaState = schemaReducer( globalState, null, {} );

		expect( schemaState ).to.be.null;
	} );

	it( 'should create a default state if no schema state was passed to the reducer', () => {
		schemaState = schemaReducer( globalState, null, {} );

		expect( schemaState ).to.have.property( 'treeDefinition' );
		expect( schemaState ).to.have.property( 'currentSchemaDefinitionName' );
		expect( schemaState ).to.have.property( 'currentSchemaDefinition' );
	} );

	it( 'should pass through when no action was passed to the reducer', () => {
		schemaState = schemaReducer( globalState, {
			treeDefinition: [ 'foo' ],
			currentSchemaDefinitionName: 'bar',
			currentSchemaDefinition: 'baz'
		}, {} );

		expect( schemaState.treeDefinition ).to.deep.equal( [ 'foo' ] );
		expect( schemaState.currentSchemaDefinitionName ).to.equal( 'bar' );
		expect( schemaState.currentSchemaDefinition ).to.equal( 'baz' );
	} );

	describe( 'application state', () => {
		describe( '#currentSchemaDefinitionName', () => {
			it( 'should be reset on setEditors() action', () => {
				schemaState.currentSchemaDefinitionName = 'paragraph';
				schemaState = schemaReducer( globalState, schemaState, setEditors( new Map( [ [ 'b', editorB ] ] ) ) );

				expect( schemaState.currentSchemaDefinitionName ).to.be.null;
			} );

			it( 'should be reset on setCurrentEditorName() action', () => {
				schemaState.currentSchemaDefinitionName = null;
				schemaState = schemaReducer( globalState, schemaState, setCurrentEditorName( 'b' ) );

				expect( schemaState.currentSchemaDefinitionName ).to.be.null;
			} );

			it( 'should be set on setSchemaCurrentDefinitionName() action', () => {
				schemaState.currentSchemaDefinitionName = null;
				schemaState = schemaReducer( globalState, schemaState, setSchemaCurrentDefinitionName( 'paragraph' ) );

				expect( schemaState.currentSchemaDefinitionName ).to.equal( 'paragraph' );
			} );
		} );

		describe( '#currentSchemaDefinition', () => {
			it( 'should be reset on setEditors() action', () => {
				schemaState.currentSchemaDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setEditors( new Map( [ [ 'b', editorB ] ] ) ) );

				expect( schemaState.currentSchemaDefinition ).to.be.null;
			} );

			it( 'should be reset on setCurrentEditorName() action', () => {
				schemaState.currentSchemaDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setCurrentEditorName( 'b' ) );

				expect( schemaState.currentSchemaDefinition ).to.be.null;
			} );

			it( 'should be set on setSchemaCurrentDefinitionName() action', () => {
				schemaState.currentSchemaDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setSchemaCurrentDefinitionName( 'paragraph' ) );

				expect( schemaState.currentSchemaDefinition ).to.be.an( 'object' );
			} );

			it( 'should be set on setActiveTab() action', () => {
				schemaState.currentSchemaDefinitionName = 'paragraph';
				schemaState.currentSchemaDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setActiveTab( 'Schema' ) );

				expect( schemaState.currentSchemaDefinition ).to.be.an( 'object' );
			} );
		} );

		describe( '#treeDefinition', () => {
			it( 'should be empty if there are no editors', () => {
				schemaState.treeDefinition = null;

				globalState.editors = new Map();
				globalState.currentEditorName = null;

				schemaState = schemaReducer( globalState, schemaState, setEditors( new Map() ) );

				expect( schemaState.treeDefinition ).to.be.an( 'array' );
				expect( schemaState.treeDefinition ).to.have.length( 0 );
			} );

			it( 'should be set on setEditors() action', () => {
				schemaState.treeDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setEditors( new Map( [ [ 'b', editorB ] ] ) ) );

				expect( schemaState.treeDefinition ).to.be.an( 'array' );
			} );

			it( 'should be set on setCurrentEditorName() action', () => {
				schemaState.treeDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setCurrentEditorName( 'b' ) );

				expect( schemaState.treeDefinition ).to.be.an( 'array' );
			} );

			it( 'should be set on setActiveTab() action', () => {
				schemaState.treeDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setActiveTab( 'Commands' ) );

				expect( schemaState.treeDefinition ).to.be.an( 'array' );
			} );
		} );
	} );
} );
