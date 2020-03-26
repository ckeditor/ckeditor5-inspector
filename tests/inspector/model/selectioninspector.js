/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { getEditorModelRanges } from '../../../src/model/data/utils';

import Button from '../../../src/components/button';
import ObjectInspector from '../../../src/components/objectinspector';
import Logger from '../../../src/logger';
import ModelSelectionInspector from '../../../src/model/selectioninspector';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( '<ModelSelectionInspector />', () => {
	let editor, wrapper, element, store;

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ],
			initialData: '<p>foo</p>'
		} ).then( newEditor => {
			editor = newEditor;

			store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				model: {
					ranges: getEditorModelRanges( editor, 'main' )
				}
			} );

			wrapper = mount( <Provider store={store}><ModelSelectionInspector /></Provider> );
		} );
	} );

	afterEach( () => {
		wrapper.unmount();
		element.remove();
		sinon.restore();

		return editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render the inspector', () => {
			const logSelButton = wrapper.find( Button ).first();
			const logAnchorButton = wrapper.find( Button ).at( 1 );
			const logFocusButton = wrapper.find( Button ).last();

			const logSpy = sinon.stub( Logger, 'log' ).callsFake( () => {} );

			expect( wrapper.find( ObjectInspector ) ).to.have.length( 1 );
			expect( wrapper.childAt( 0 ).find( 'h2 span' ).text() ).to.equal( 'Selection' );

			logSelButton.simulate( 'click' );
			sinon.assert.calledOnce( logSpy );

			logAnchorButton.simulate( 'click' );
			sinon.assert.calledTwice( logSpy );

			logFocusButton.simulate( 'click' );
			sinon.assert.calledThrice( logSpy );
		} );

		describe( 'selection properties', () => {
			it( '"Attributes" should be rendered', () => {
				const inspector = wrapper.find( ObjectInspector );
				const lists = inspector.props().lists;

				expect( lists[ 0 ].name ).to.equal( 'Attributes' );
				expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {} );
			} );

			it( '"Properties" should be rendered', () => {
				const inspector = wrapper.find( ObjectInspector );
				const lists = inspector.props().lists;
				expect( lists[ 1 ].name ).to.equal( 'Properties' );
				expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
					isCollapsed: { value: 'true' },
					isBackward: { value: 'false' },
					isGravityOverridden: { value: 'false' },
					rangeCount: { value: '1' }
				} );
			} );

			it( '"Anchor" should be rendered', () => {
				const inspector = wrapper.find( ObjectInspector );
				const lists = inspector.props().lists;

				expect( lists[ 2 ].name ).to.equal( 'Anchor' );
				expect( lists[ 2 ].itemDefinitions ).to.deep.equal( {
					path: { value: '[0,0]' },
					stickiness: { value: '"toNone"' },
					index: { value: '0' },
					isAtEnd: { value: 'false' },
					isAtStart: { value: 'true' },
					offset: { value: '0' },
					textNode: { value: 'null' }
				} );
			} );

			it( '"Focus" should be rendered', () => {
				const inspector = wrapper.find( ObjectInspector );
				const lists = inspector.props().lists;

				expect( lists[ 3 ].name ).to.equal( 'Focus' );
				expect( lists[ 3 ].itemDefinitions ).to.deep.equal( {
					path: { value: '[0,0]' },
					stickiness: { value: '"toNone"' },
					index: { value: '0' },
					isAtEnd: { value: 'false' },
					isAtStart: { value: 'true' },
					offset: { value: '0' },
					textNode: { value: 'null' }
				} );
			} );

			it( '"Ranges" should be rendered', () => {
				const inspector = wrapper.find( ObjectInspector );
				const lists = inspector.props().lists;

				expect( lists[ 4 ].name ).to.equal( 'Ranges' );
				expect( lists[ 4 ].itemDefinitions ).to.deep.equal( {
					0: {
						subProperties: {
							end: {
								subProperties: {
									index: { value: '0' },
									isAtEnd: { value: 'false' },
									isAtStart: { value: 'true' },
									offset: { value: '0' },
									path: { value: '[0,0]' },
									stickiness: { value: '"toNone"' },
									textNode: { value: 'null' }
								},
								value: ''
							},
							start: {
								subProperties: {
									index: { value: '0' },
									isAtEnd: { value: 'false' },
									isAtStart: { value: 'true' },
									offset: { value: '0' },
									path: { value: '[0,0]' },
									stickiness: { value: '"toNone"' },
									textNode: { value: 'null' }
								},
								value: ''
							}
						},
						value: ''
					}
				} );
			} );
		} );
	} );
} );
