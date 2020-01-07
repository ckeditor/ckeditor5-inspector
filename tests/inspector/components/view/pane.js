/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import React from 'react';
import TestEditor from '../../../utils/testeditor';
import ViewPane from '../../../../src/components/view/pane';
import ViewTree from '../../../../src/components/view/tree';
import ViewNodeInspector from '../../../../src/components/view/nodeinspector';
import ViewSelectionInspector from '../../../../src/components/view/selectioninspector';

describe( '<ViewPane />', () => {
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
				<ViewPane editor={editor} />,
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
			expect( state.editorRoots ).to.have.deep.members( [ ...editor.editing.view.document.roots ] );
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

			wrapper.instance().handleTreeClick( evt, editor.editing.view.document.getRoot().getChild( 0 ) );

			expect( wrapper.state().currentEditorNode ).to.equal( editor.editing.view.document.getRoot().getChild( 0 ) );
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

			wrapper.instance().handleTreeClick( evt, editor.editing.view.document.getRoot().getChild( 0 ) );
			expect( wrapper.state().activeTab ).to.equal( 'Inspect' );
		} );
	} );

	describe( 'handlePaneChange()', () => {
		it( 'changes state#activeTab and saves to local storage', () => {
			const instance = wrapper.instance();

			instance.handlePaneChange( 'Selection' );

			expect( wrapper.state().activeTab ).to.equal( 'Selection' );
			expect( window.localStorage.getItem( 'ck5-inspector-active-view-tab-name' ) ).to.equal( 'Selection' );
		} );
	} );

	describe( 'handleRootChange()', () => {
		it( 'changes state#currentRootName', () => {
			const instance = wrapper.instance();

			instance.handleRootChange( 'main' );

			expect( wrapper.state().currentRootName ).to.equal( 'main' );
		} );
	} );

	describe( 'render()', () => {
		it( 'renders a placeholder when no props#editor', () => {
			wrapper.setProps( { editor: null } );

			expect( wrapper.text() ).to.match( /^Nothing to show/ );
		} );

		it( 'renders a <ViewTree/>', () => {
			const firstChild = editor.editing.view.document.getRoot().getChild( 0 );

			wrapper.setState( {
				currentEditorNode: firstChild,
				currentRootName: 'main'
			} );

			expect( wrapper.find( ViewTree ).props().editor ).to.equal( editor );
			expect( wrapper.find( ViewTree ).props().editorRoots ).to.have.members( wrapper.state().editorRoots );
			expect( wrapper.find( ViewTree ).props().currentEditorNode ).to.equal( wrapper.state().currentEditorNode );
			expect( wrapper.find( ViewTree ).props().currentRootName ).to.equal( 'main' );
			expect( wrapper.find( ViewTree ).props().onClick ).to.equal( wrapper.instance().handleTreeClick );
			expect( wrapper.find( ViewTree ).props().onRootChange ).to.equal( wrapper.instance().handleRootChange );
		} );

		it( 'renders a <ViewNodeInspector/>', () => {
			const firstChild = editor.editing.view.document.getRoot().getChild( 0 );

			wrapper.setState( {
				currentEditorNode: firstChild,
				currentRootName: 'main'
			} );

			expect( wrapper.find( ViewNodeInspector ).props().editor ).to.equal( editor );
			expect( wrapper.find( ViewNodeInspector ).props().currentRootName ).to.equal( 'main' );
			expect( wrapper.find( ViewNodeInspector ).props().inspectedNode ).to.equal( wrapper.state().currentEditorNode );
		} );

		it( 'renders a <ViewSelectionInspector/>', () => {
			wrapper.setState( {
				activeTab: 'Selection'
			} );

			expect( wrapper.find( ViewSelectionInspector ).props().editor ).to.equal( editor );
		} );
	} );

	describe( 'getDerivedStateFromProps()', () => {
		it( 'resets the state when the editor changes', () => {
			wrapper.setState( {
				currentEditorNode: editor.editing.view.document.getRoot().getChild( 0 ),
				currentRootName: 'main'
			} );

			return TestEditor.create( element ).then( anotherEditor => {
				wrapper.setState( { editor: anotherEditor } );

				expect( wrapper.state().currentEditorNode ).to.be.null;
				expect( wrapper.state().currentRootName ).to.equal( 'main' );
			} );
		} );
	} );
} );
