/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window */

import TestEditor from '../utils/testeditor';
import CKEditorInspector from '../../src/ckeditorinspector';
import Logger from '../../src/logger';

describe( 'CKEditorInspector', () => {
	let editor, element, inspectorRef;

	beforeEach( () => {
		// Silence inspector logs.
		sinon.stub( Logger, 'log' ).callsFake( () => {} );

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;
		} );
	} );

	afterEach( () => {
		Logger.log.restore();

		element.remove();

		return editor.destroy();
	} );

	describe( 'CKEDITOR_INSPECTOR_VERSION', () => {
		it( 'is set', () => {
			expect( window.CKEDITOR_INSPECTOR_VERSION ).to.be.a( 'string' );
		} );
	} );

	describe( '#attach()', () => {
		it( 'adds inspector to DOM', () => {
			expect( document.querySelector( '.ck-inspector-wrapper' ) ).to.be.null;

			CKEditorInspector.attach( 'foo', editor );

			const wrapper = document.querySelector( '.ck-inspector-wrapper' );

			expect( wrapper.tagName.toLowerCase() ).to.equal( 'div' );
			expect( wrapper.parentNode ).to.equal( document.body );
			expect( wrapper.childNodes.length ).to.equal( 2 );
			expect( wrapper.firstChild.classList.contains( 'ck-inspector' ) ).to.be.true;
		} );

		it( 'attaches editors under generated names', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					CKEditorInspector.attach( editor );
					CKEditorInspector.attach( anotherEditor );

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.state.editors.get( 'editor-1' ) ).to.equal( editor );
					expect( inspectorRef.state.editors.get( 'editor-2' ) ).to.equal( anotherEditor );

					return anotherEditor.destroy();
				} )
				.catch( err => {
					throw err;
				} );
		} );

		it( 'attaches a new editor (named)', () => {
			CKEditorInspector.attach( 'foo', editor );

			inspectorRef = CKEditorInspector._inspectorRef.current;

			expect( inspectorRef.state.editors.get( 'foo' ) ).to.equal( editor );
		} );

		it( 'detaches when the editor is destroyed', () => {
			const spy = sinon.spy( CKEditorInspector, 'detach' );

			CKEditorInspector.attach( 'bar', editor );

			return editor.destroy().then( () => {
				sinon.assert.calledOnce( spy );
				sinon.assert.calledWith( spy, 'bar' );

				expect( inspectorRef.state.editors.size ).to.equal( 0 );
			} );
		} );

		describe( 'options', () => {
			describe( '#isCollapsed', () => {
				beforeEach( () => {
					CKEditorInspector.destroy();
				} );

				it( 'does nothing if unspecified', () => {
					CKEditorInspector.attach( 'foo', editor );

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.props.isCollapsed ).to.be.undefined;
				} );

				it( 'controlls the initial collapsed state of the editor #1', () => {
					CKEditorInspector.attach( 'foo', editor, { isCollapsed: true } );

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.props.isCollapsed ).to.be.true;
				} );

				it( 'controlls the initial collapsed state of the editor #2', () => {
					CKEditorInspector.attach( editor, { isCollapsed: true } );

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.props.isCollapsed ).to.be.true;
				} );
			} );
		} );
	} );

	describe( '#detach()', () => {
		it( 'detaches an editor', () => {
			CKEditorInspector.attach( 'foo', editor );

			inspectorRef = CKEditorInspector._inspectorRef.current;

			expect( inspectorRef.state.editors.get( 'foo' ) ).to.equal( editor );

			CKEditorInspector.detach( 'foo' );

			expect( inspectorRef.state.editors.size ).to.equal( 0 );
		} );
	} );

	describe( '#destroy()', () => {
		it( 'destroys the entire inspector application', () => {
			CKEditorInspector.attach( 'foo', editor );

			CKEditorInspector.destroy();

			expect( CKEditorInspector._inspectorRef.current ).to.be.null;
			expect( document.querySelector( '.ck-inspector-wrapper' ) ).to.be.null;
			expect( CKEditorInspector._editors.size ).to.equal( 0 );
		} );
	} );
} );
