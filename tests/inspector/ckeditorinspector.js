/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window, HTMLElement */

import TestEditor from '../utils/testeditor';
import CKEditorInspector from '../../src/ckeditorinspector';
import Logger from '../../src/logger';

describe( 'CKEditorInspector', () => {
	let editor, element, inspectorRef, warnStub;

	beforeEach( () => {
		// Silence inspector logs.
		sinon.stub( Logger, 'log' ).callsFake( () => {} );
		warnStub = sinon.stub( Logger, 'warn' ).callsFake( () => {} );

		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element ).then( newEditor => {
			editor = newEditor;
		} );
	} );

	afterEach( () => {
		Logger.log.restore();
		Logger.warn.restore();

		element.remove();

		CKEditorInspector.destroy();

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
			expect( CKEditorInspector._wrapper ).to.be.null;

			CKEditorInspector.attach( { foo: editor } );

			expect( CKEditorInspector._wrapper ).to.be.instanceOf( HTMLElement );

			const wrapper = CKEditorInspector._wrapper;

			expect( wrapper.tagName.toLowerCase() ).to.equal( 'div' );
			expect( wrapper.parentNode ).to.equal( document.body );
			expect( wrapper.childNodes.length ).to.equal( 2 );
			expect( wrapper.firstChild.classList.contains( 'ck-inspector' ) ).to.be.true;
		} );

		it( 'adds inspector to DOM only once when attaching to the first editor', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					CKEditorInspector.attach( { foo: editor } );
					CKEditorInspector.attach( { bar: anotherEditor } );

					expect( document.querySelectorAll( '.ck-inspector-wrapper' ) ).to.be.lengthOf( 1 );
					expect( document.querySelectorAll( '.ck-inspector' ) ).to.be.lengthOf( 1 );

					return anotherEditor.destroy();
				} )
				.catch( err => {
					throw err;
				} );
		} );

		it( 'attaches to editors under generated names', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					const firstNames = CKEditorInspector.attach( editor );
					const secondNames = CKEditorInspector.attach( anotherEditor );

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.state.editors.get( 'editor-1' ) ).to.equal( editor );
					expect( inspectorRef.state.editors.get( 'editor-2' ) ).to.equal( anotherEditor );
					expect( firstNames ).to.have.members( [ 'editor-1' ] );
					expect( secondNames ).to.have.members( [ 'editor-2' ] );

					return anotherEditor.destroy();
				} )
				.catch( err => {
					throw err;
				} );
		} );

		it( 'attaches to a named editor', () => {
			CKEditorInspector.attach( { foo: editor } );

			inspectorRef = CKEditorInspector._inspectorRef.current;

			expect( inspectorRef.state.editors.get( 'foo' ) ).to.equal( editor );
		} );

		it( 'attaches to multiple editors at a time', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					const names = CKEditorInspector.attach( { foo: editor, bar: anotherEditor } );

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.state.editors.get( 'foo' ) ).to.equal( editor );
					expect( inspectorRef.state.editors.get( 'bar' ) ).to.equal( anotherEditor );
					expect( names ).to.have.members( [ 'foo', 'bar' ] );

					return anotherEditor.destroy();
				} )
				.catch( err => {
					throw err;
				} );
		} );

		it( 'supports the deprecated syntax but warns', () => {
			CKEditorInspector.attach( 'foo', editor );

			inspectorRef = CKEditorInspector._inspectorRef.current;
			expect( inspectorRef.state.editors.get( 'foo' ) ).to.equal( editor );
			sinon.assert.calledOnce( warnStub );
			sinon.assert.calledWithMatch( warnStub, /^\[CKEditorInspector\]/ );
		} );

		it( 'detaches when the editor is destroyed', () => {
			const spy = sinon.spy( CKEditorInspector, 'detach' );

			CKEditorInspector.attach( { bar: editor } );

			return editor.destroy().then( () => {
				sinon.assert.calledOnce( spy );
				sinon.assert.calledWith( spy, 'bar' );

				inspectorRef = CKEditorInspector._inspectorRef.current;

				expect( inspectorRef.state.editors.size ).to.equal( 0 );
			} );
		} );

		describe( 'options', () => {
			describe( '#isCollapsed', () => {
				beforeEach( () => {
					CKEditorInspector.destroy();
				} );

				it( 'does nothing if unspecified', () => {
					CKEditorInspector.attach( editor );

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.props.isCollapsed ).to.be.undefined;
				} );

				it( 'controlls the initial collapsed state of the editor (single editor)', () => {
					CKEditorInspector.attach( editor, { isCollapsed: true } );

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.props.isCollapsed ).to.be.true;
				} );

				it( 'controlls the initial collapsed state of the editor (multiple editors)', () => {
					CKEditorInspector.attach( { foo: editor }, { isCollapsed: true } );

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.props.isCollapsed ).to.be.true;
				} );
			} );
		} );
	} );

	describe( '#detach()', () => {
		it( 'detaches an editor', () => {
			CKEditorInspector.attach( { foo: editor } );

			inspectorRef = CKEditorInspector._inspectorRef.current;

			expect( inspectorRef.state.editors.get( 'foo' ) ).to.equal( editor );

			CKEditorInspector.detach( 'foo' );

			expect( inspectorRef.state.editors.size ).to.equal( 0 );
		} );

		it( 'does not throw if executed multiple times', () => {
			CKEditorInspector.attach( { foo: editor } );

			expect( () => {
				CKEditorInspector.detach( 'foo' );
				CKEditorInspector.detach( 'foo' );
			} ).to.not.throw();
		} );
	} );

	describe( '#destroy()', () => {
		it( 'destroys the entire inspector application', () => {
			CKEditorInspector.attach( { foo: editor } );

			CKEditorInspector.destroy();

			expect( CKEditorInspector._inspectorRef.current ).to.be.null;
			expect( document.querySelector( '.ck-inspector-wrapper' ) ).to.be.null;
			expect( CKEditorInspector._editors.size ).to.equal( 0 );
			expect( CKEditorInspector._wrapper ).to.be.null;
		} );
	} );
} );
