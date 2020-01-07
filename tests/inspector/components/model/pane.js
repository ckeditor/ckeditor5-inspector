/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../../../utils/testeditor';
import ModelPane from '../../../../src/components/model/pane';
import ModelTree from '../../../../src/components/model/tree';
import ModelNodeInspector from '../../../../src/components/model/nodeinspector';
import ModelSelectionInspector from '../../../../src/components/model/selectioninspector';

describe( '<ModelPane />', () => {
	let editor, wrapper, element;

	const container = document.createElement( 'div' );
	document.body.appendChild( container );

	beforeEach( () => {
		window.localStorage.clear();

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;

			wrapper = mount(
				<ModelPane editor={editor} />,
				{ attachTo: container }
			);
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();

		return editor.destroy();
	} );

	describe( 'state', () => {
		it( 'has initial state', () => {
			const state = wrapper.state();

			expect( state.editor ).to.equal( editor );
			expect( state.editorRoots ).to.have.deep.members( [ ...editor.model.document.roots ] );
			expect( state.currentRootName ).to.equal( 'main' );
			expect( state.currentEditorNode ).to.be.null;
			expect( state.activeTab ).to.equal( 'Inspect' );
		} );
	} );

	describe( 'handleTreeClick()', () => {
		it( 'changes state#currentCommandName', () => {
			const evt = {
				persist: sinon.spy(),
				stopPropagation: sinon.spy()
			};

			wrapper.instance().handleTreeClick( evt, editor.model.document.getRoot().getChild( 0 ) );

			expect( wrapper.state().currentEditorNode ).to.equal( editor.model.document.getRoot().getChild( 0 ) );
			sinon.assert.calledOnce( evt.persist );
			sinon.assert.calledOnce( evt.stopPropagation );
		} );

		it( 'opens the inspector when double clicked', () => {
			wrapper.setState( { activeTab: 'Selection' } );

			const evt = {
				persist: sinon.spy(),
				stopPropagation: sinon.spy(),
				detail: 2
			};

			wrapper.instance().handleTreeClick( evt, editor.model.document.getRoot().getChild( 0 ) );
			expect( wrapper.state().activeTab ).to.equal( 'Inspect' );
		} );
	} );

	describe( 'handlePaneChange()', () => {
		it( 'changes state#activeTab and saves to local storage', () => {
			const instance = wrapper.instance();

			instance.handlePaneChange( 'Selection' );

			expect( wrapper.state().activeTab ).to.equal( 'Selection' );
			expect( window.localStorage.getItem( 'ck5-inspector-active-model-tab-name' ) ).to.equal( 'Selection' );
		} );
	} );

	describe( 'handleRootChange()', () => {
		it( 'changes state#currentRootName', () => {
			const instance = wrapper.instance();

			instance.handleRootChange( '$graveyard' );

			expect( wrapper.state().currentRootName ).to.equal( '$graveyard' );
		} );
	} );

	describe( 'render()', () => {
		it( 'renders a placeholder when no props#editor', () => {
			wrapper.setProps( { editor: null } );

			expect( wrapper.text() ).to.match( /^Nothing to show/ );
		} );

		it( 'renders a <ModelTree/>', () => {
			const firstChild = editor.model.document.getRoot().getChild( 0 );

			wrapper.setState( {
				currentEditorNode: firstChild,
				currentRootName: 'main'
			} );

			expect( wrapper.find( ModelTree ).props().editor ).to.equal( editor );
			expect( wrapper.find( ModelTree ).props().editorRoots ).to.have.members( wrapper.state().editorRoots );
			expect( wrapper.find( ModelTree ).props().currentEditorNode ).to.equal( wrapper.state().currentEditorNode );
			expect( wrapper.find( ModelTree ).props().currentRootName ).to.equal( 'main' );
			expect( wrapper.find( ModelTree ).props().onClick ).to.equal( wrapper.instance().handleTreeClick );
			expect( wrapper.find( ModelTree ).props().onRootChange ).to.equal( wrapper.instance().handleRootChange );
		} );

		it( 'renders a <ModelNodeInspector/>', () => {
			const firstChild = editor.model.document.getRoot().getChild( 0 );

			wrapper.setState( {
				currentEditorNode: firstChild,
				currentRootName: 'main'
			} );

			expect( wrapper.find( ModelNodeInspector ).props().editor ).to.equal( editor );
			expect( wrapper.find( ModelNodeInspector ).props().currentRootName ).to.equal( 'main' );
			expect( wrapper.find( ModelNodeInspector ).props().inspectedNode ).to.equal( wrapper.state().currentEditorNode );
		} );

		it( 'renders a <ModelSelectionInspector/>', () => {
			wrapper.setState( {
				activeTab: 'Selection'
			} );

			expect( wrapper.find( ModelSelectionInspector ).props().editor ).to.equal( editor );
		} );
	} );

	describe( 'getDerivedStateFromProps()', () => {
		it( 'resets the state when the editor changes', () => {
			wrapper.setState( {
				currentEditorNode: editor.model.document.getRoot().getChild( 0 ),
				currentRootName: '$graveyard'
			} );

			return TestEditor.create( element ).then( anotherEditor => {
				wrapper.setState( { editor: anotherEditor } );

				expect( wrapper.state().currentEditorNode ).to.be.null;
				expect( wrapper.state().currentRootName ).to.equal( 'main' );
			} );
		} );
	} );
} );
