/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
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
		sinon.restore();
		element.remove();

		CKEditorInspector.destroy();

		return editor.destroy();
	} );

	describe( 'CKEDITOR_INSPECTOR_VERSION', () => {
		it( 'is set', () => {
			expect( window.CKEDITOR_INSPECTOR_VERSION ).to.be.a( 'string' );
		} );
	} );

	it( 'warns if called the constructor()', () => {
		// eslint-disable-next-line no-unused-vars
		const inspector = new CKEditorInspector();

		sinon.assert.calledOnce( warnStub );
		sinon.assert.calledWithMatch( warnStub, /^\[CKEditorInspector\]/ );
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
			const anotherEditorElement = document.createElement( 'div' );
			document.body.appendChild( anotherEditorElement );

			return TestEditor.create( anotherEditorElement )
				.then( anotherEditor => {
					CKEditorInspector.attach( { foo: editor } );
					CKEditorInspector.attach( { bar: anotherEditor } );

					expect( document.querySelectorAll( '.ck-inspector-wrapper' ) ).to.be.lengthOf( 1 );
					expect( document.querySelectorAll( '.ck-inspector' ) ).to.be.lengthOf( 1 );

					anotherEditorElement.remove();

					return anotherEditor.destroy();
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
				} );
		} );

		it( 'attaches to a named editor', () => {
			CKEditorInspector.attach( { foo: editor } );

			inspectorRef = CKEditorInspector._inspectorRef.current;

			expect( inspectorRef.state.editors.get( 'foo' ) ).to.equal( editor );
		} );

		it( 'attaches to a editor named like one of core editor properties (used in a duck typing)', () => {
			CKEditorInspector.attach( { model: editor } );
			CKEditorInspector.attach( { editing: editor } );

			inspectorRef = CKEditorInspector._inspectorRef.current;

			expect( inspectorRef.state.editors.get( 'model' ) ).to.equal( editor );
			expect( inspectorRef.state.editors.get( 'editing' ) ).to.equal( editor );
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

	describe( '#attachToAll()', () => {
		it( 'attaches to all editors', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					document.body.appendChild( editor.ui.view.element );
					document.body.appendChild( anotherEditor.ui.view.element );

					const editorNames = CKEditorInspector.attachToAll();

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.state.editors.size ).to.equal( 2 );
					expect( inspectorRef.state.editors.get( 'editor-5' ) ).to.equal( editor );
					expect( inspectorRef.state.editors.get( 'editor-6' ) ).to.equal( anotherEditor );
					expect( editorNames ).to.have.members( [ 'editor-5', 'editor-6' ] );

					return anotherEditor.destroy();
				} );
		} );

		it( 'detects and prevents duplicates', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					document.body.appendChild( editor.ui.view.element );
					document.body.appendChild( anotherEditor.ui.view.element );

					CKEditorInspector.attachToAll();

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.state.editors.size ).to.equal( 2 );
					expect( inspectorRef.state.editors.get( 'editor-7' ) ).to.equal( editor );
					expect( inspectorRef.state.editors.get( 'editor-8' ) ).to.equal( anotherEditor );

					CKEditorInspector.attachToAll();

					inspectorRef = CKEditorInspector._inspectorRef.current;

					expect( inspectorRef.state.editors.size ).to.equal( 2 );

					return anotherEditor.destroy();
				} );
		} );

		it( 'passes options to #attach()', () => {
			return TestEditor.create( element )
				.then( anotherEditor => {
					document.body.appendChild( editor.ui.view.element );
					document.body.appendChild( anotherEditor.ui.view.element );

					const spy = sinon.spy( CKEditorInspector, 'attach' );
					const options = { foo: true };
					CKEditorInspector.attachToAll( options );

					sinon.assert.calledWithExactly( spy.firstCall, editor, options );
					sinon.assert.calledWithExactly( spy.secondCall, anotherEditor, options );

					return anotherEditor.destroy();
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
