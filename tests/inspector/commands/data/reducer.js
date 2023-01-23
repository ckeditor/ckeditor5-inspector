/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import TestEditor from '../../../utils/testeditor';
import commandsReducer from '../../../../src/commands/data/reducer';

import {
	setCommandsCurrentCommandName,
	updateCommandsState
} from '../../../../src/commands/data/actions';

import {
	setActiveTab,
	setEditors,
	setCurrentEditorName
} from '../../../../src/data/actions';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

describe( 'commands data store reducer', () => {
	let editorA, editorB;
	let elementA, elementB;
	let globalState, commandsState;

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
						activeTab: 'Commands'
					}
				};

				commandsState = commandsReducer( globalState, null, {} );
			} );
		} );
	} );

	afterEach( () => {
		return editorA.destroy().then( () => editorB.destroy() );
	} );

	it( 'should not create a state if ui#activeTab is different than "Commands"', () => {
		globalState.ui.activeTab = 'Model';

		commandsState = commandsReducer( globalState, null, {} );

		expect( commandsState ).to.be.null;
	} );

	it( 'should create a default state if no model state was passed to the reducer', () => {
		commandsState = commandsReducer( globalState, null, {} );

		expect( commandsState ).to.have.property( 'treeDefinition' );
		expect( commandsState ).to.have.property( 'currentCommandName' );
		expect( commandsState ).to.have.property( 'currentCommandDefinition' );
	} );

	describe( 'application state', () => {
		describe( '#currentCommandName', () => {
			it( 'should be reset on setEditors() action', () => {
				commandsState.currentCommandName = 'foo';
				commandsState = commandsReducer( globalState, commandsState, setEditors( new Map( [ [ 'b', editorB ] ] ) ) );

				expect( commandsState.currentCommandName ).to.be.null;
			} );

			it( 'should be reset on setCurrentEditorName() action', () => {
				commandsState.currentCommandName = null;
				commandsState = commandsReducer( globalState, commandsState, setCurrentEditorName( 'b' ) );

				expect( commandsState.currentCommandName ).to.be.null;
			} );

			it( 'should be set on setCommandsCurrentCommandName() action', () => {
				commandsState.currentCommandName = null;
				commandsState = commandsReducer( globalState, commandsState, setCommandsCurrentCommandName( 'foo' ) );

				expect( commandsState.currentCommandName ).to.equal( 'foo' );
			} );
		} );

		describe( '#currentCommandDefinition', () => {
			it( 'should be reset on setEditors() action', () => {
				commandsState.currentCommandDefinition = 'foo';
				commandsState = commandsReducer( globalState, commandsState, setEditors( new Map( [ [ 'b', editorB ] ] ) ) );

				expect( commandsState.currentCommandDefinition ).to.be.null;
			} );

			it( 'should be reset on setCurrentEditorName() action', () => {
				commandsState.currentCommandDefinition = 'foo';
				commandsState = commandsReducer( globalState, commandsState, setCurrentEditorName( 'b' ) );

				expect( commandsState.currentCommandDefinition ).to.be.null;
			} );

			it( 'should be set on setCommandsCurrentCommandName() action', () => {
				commandsState.currentCommandDefinition = null;
				commandsState = commandsReducer( globalState, commandsState, setCommandsCurrentCommandName( 'foo' ) );

				expect( commandsState.currentCommandDefinition ).to.be.an( 'object' );
			} );

			it( 'should be set on updateCommandsState() action', () => {
				commandsState.currentCommandName = 'foo';
				commandsState.currentCommandDefinition = null;
				commandsState = commandsReducer( globalState, commandsState, updateCommandsState() );

				expect( commandsState.currentCommandDefinition ).to.be.an( 'object' );
			} );

			it( 'should be set on setActiveTab() action', () => {
				commandsState.currentCommandName = 'foo';
				commandsState.currentCommandDefinition = null;
				commandsState = commandsReducer( globalState, commandsState, setActiveTab( 'Commands' ) );

				expect( commandsState.currentCommandDefinition ).to.be.an( 'object' );
			} );
		} );

		describe( '#treeDefinition', () => {
			it( 'should be set on setEditors() action', () => {
				commandsState.treeDefinition = 'foo';
				commandsState = commandsReducer( globalState, commandsState, setEditors( new Map( [ [ 'b', editorB ] ] ) ) );

				expect( commandsState.treeDefinition ).to.be.an( 'array' );
			} );

			it( 'should be set on setCurrentEditorName() action', () => {
				commandsState.treeDefinition = 'foo';
				commandsState = commandsReducer( globalState, commandsState, setCurrentEditorName( 'b' ) );

				expect( commandsState.treeDefinition ).to.be.an( 'array' );
			} );

			it( 'should be set on updateCommandsState() action', () => {
				commandsState.treeDefinition = 'foo';
				commandsState = commandsReducer( globalState, commandsState, updateCommandsState() );

				expect( commandsState.treeDefinition ).to.be.an( 'array' );
			} );

			it( 'should be set on setActiveTab() action', () => {
				commandsState.treeDefinition = 'foo';
				commandsState = commandsReducer( globalState, commandsState, setActiveTab( 'Commands' ) );

				expect( commandsState.treeDefinition ).to.be.an( 'array' );
			} );
		} );
	} );
} );
