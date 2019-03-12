/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console */

import editorEventObserver from '../../../src/components/editorobserver';
import TestEditor from '../../utils/testeditor';
import React, { Component } from 'react';

describe( 'editorEventObserver()', () => {
	let editor;

	class Test extends Component {
		editorEventObserverConfig( props ) {
			return {
				target: props.editor.model.document,
				event: 'foo'
			};
		}

		render() {
			return <div></div>;
		}
	}

	const TestObserver = editorEventObserver( Test );

	beforeEach( () => {
		return TestEditor.create().then( newEditor => {
			editor = newEditor;
		} );
	} );

	afterEach( () => {
		return editor.destroy();
	} );

	describe( 'componentDidMount()', () => {
		it( 'listens to the event from the start', () => {
			const wrapper = mount( <TestObserver editor={editor} /> );
			const spy = sinon.spy( wrapper.instance(), 'forceUpdate' );

			editor.model.document.fire( 'foo' );

			sinon.assert.calledOnce( spy );
		} );
	} );

	describe( 'componentDidUpdate()', () => {
		it( 'keeps listening to the event if props#editor remains the same', () => {
			const wrapper = mount( <TestObserver editor={editor} /> );
			const spy = sinon.spy( wrapper.instance(), 'stopListeningToEditor' );

			wrapper.setProps( { editor: editor } );

			sinon.assert.notCalled( spy );
		} );

		it( 'stops listening to the event if props#editor changed and different', () => {
			const wrapper = mount( <TestObserver editor={editor} /> );
			const spy = sinon.spy( wrapper.instance(), 'stopListeningToEditor' );

			wrapper.setProps( { editor: null } );

			sinon.assert.calledOnce( spy );
			sinon.assert.calledWithExactly( spy, { editor: editor } );
		} );

		it( 'starts listening to the event if props#editor changed and different', () => {
			return TestEditor.create().then( newEditor => {
				const wrapper = mount( <TestObserver editor={editor} /> );
				const stopSpy = sinon.spy( wrapper.instance(), 'stopListeningToEditor' );
				const startSpy = sinon.spy( wrapper.instance(), 'startListeningToEditor' );

				wrapper.setProps( { editor } );

				sinon.assert.notCalled( stopSpy );
				sinon.assert.notCalled( startSpy );

				wrapper.setProps( { editor: newEditor } );

				sinon.assert.calledOnce( stopSpy );
				sinon.assert.calledWithExactly( stopSpy, { editor: editor } );
				sinon.assert.calledOnce( startSpy );

				return newEditor.destroy();
			} );
		} );
	} );

	describe( 'componentWillUnmount()', () => {
		it( 'stops listening to the event', () => {
			const wrapper = mount( <TestObserver editor={editor} /> );
			const spy = sinon.spy( wrapper.instance(), 'stopListeningToEditor' );

			wrapper.unmount();

			sinon.assert.calledOnce( spy );
			sinon.assert.calledWithExactly( spy, { editor: editor } );
		} );
	} );

	describe( 'stopListeningToEditor()', () => {
		it( 'starts listening and calls forceUpdate() upon and event', () => {
			const wrapper = mount( <TestObserver editor={editor} /> );
			const spy = sinon.spy( wrapper.instance(), 'forceUpdate' );

			editor.model.document.fire( 'foo' );
			sinon.assert.calledOnce( spy );

			wrapper.instance().stopListeningToEditor( { editor } );

			editor.model.document.fire( 'foo' );
			sinon.assert.calledOnce( spy );
		} );
	} );
} );