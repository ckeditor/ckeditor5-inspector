/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Paragraph } from 'ckeditor5';

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

		expect( schemaState ).toBeNull();
	} );

	it( 'should create a default state if no schema state was passed to the reducer', () => {
		schemaState = schemaReducer( globalState, null, {} );

		expect( schemaState ).toHaveProperty( 'treeDefinition' );
		expect( schemaState ).toHaveProperty( 'currentSchemaDefinitionName' );
		expect( schemaState ).toHaveProperty( 'currentSchemaDefinition' );
	} );

	it( 'should pass through when no action was passed to the reducer', () => {
		schemaState = schemaReducer( globalState, {
			treeDefinition: [ 'foo' ],
			currentSchemaDefinitionName: 'bar',
			currentSchemaDefinition: 'baz'
		}, {} );

		expect( schemaState.treeDefinition ).toEqual( [ 'foo' ] );
		expect( schemaState.currentSchemaDefinitionName ).toBe( 'bar' );
		expect( schemaState.currentSchemaDefinition ).toBe( 'baz' );
	} );

	describe( 'application state', () => {
		describe( '#currentSchemaDefinitionName', () => {
			it( 'should be reset on setEditors() action', () => {
				schemaState.currentSchemaDefinitionName = 'paragraph';
				schemaState = schemaReducer( globalState, schemaState, setEditors( new Map( [ [ 'b', editorB ] ] ) ) );

				expect( schemaState.currentSchemaDefinitionName ).toBeNull();
			} );

			it( 'should be reset on setCurrentEditorName() action', () => {
				schemaState.currentSchemaDefinitionName = null;
				schemaState = schemaReducer( globalState, schemaState, setCurrentEditorName( 'b' ) );

				expect( schemaState.currentSchemaDefinitionName ).toBeNull();
			} );

			it( 'should be set on setSchemaCurrentDefinitionName() action', () => {
				schemaState.currentSchemaDefinitionName = null;
				schemaState = schemaReducer( globalState, schemaState, setSchemaCurrentDefinitionName( 'paragraph' ) );

				expect( schemaState.currentSchemaDefinitionName ).toBe( 'paragraph' );
			} );
		} );

		describe( '#currentSchemaDefinition', () => {
			it( 'should be reset on setEditors() action', () => {
				schemaState.currentSchemaDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setEditors( new Map( [ [ 'b', editorB ] ] ) ) );

				expect( schemaState.currentSchemaDefinition ).toBeNull();
			} );

			it( 'should be reset on setCurrentEditorName() action', () => {
				schemaState.currentSchemaDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setCurrentEditorName( 'b' ) );

				expect( schemaState.currentSchemaDefinition ).toBeNull();
			} );

			it( 'should be set on setSchemaCurrentDefinitionName() action', () => {
				schemaState.currentSchemaDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setSchemaCurrentDefinitionName( 'paragraph' ) );

				expect( schemaState.currentSchemaDefinition ).toEqual( expect.any( Object ) );
			} );

			it( 'should be set on setActiveTab() action', () => {
				schemaState.currentSchemaDefinitionName = 'paragraph';
				schemaState.currentSchemaDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setActiveTab( 'Schema' ) );

				expect( schemaState.currentSchemaDefinition ).toEqual( expect.any( Object ) );
			} );
		} );

		describe( '#treeDefinition', () => {
			it( 'should be empty if there are no editors', () => {
				schemaState.treeDefinition = null;

				globalState.editors = new Map();
				globalState.currentEditorName = null;

				schemaState = schemaReducer( globalState, schemaState, setEditors( new Map() ) );

				expect( schemaState.treeDefinition ).toEqual( expect.any( Array ) );
				expect( schemaState.treeDefinition ).toHaveLength( 0 );
			} );

			it( 'should be set on setEditors() action', () => {
				schemaState.treeDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setEditors( new Map( [ [ 'b', editorB ] ] ) ) );

				expect( schemaState.treeDefinition ).toEqual( expect.any( Array ) );
			} );

			it( 'should be set on setCurrentEditorName() action', () => {
				schemaState.treeDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setCurrentEditorName( 'b' ) );

				expect( schemaState.treeDefinition ).toEqual( expect.any( Array ) );
			} );

			it( 'should be set on setActiveTab() action', () => {
				schemaState.treeDefinition = null;
				schemaState = schemaReducer( globalState, schemaState, setActiveTab( 'Commands' ) );

				expect( schemaState.treeDefinition ).toEqual( expect.any( Array ) );
			} );
		} );
	} );
} );
