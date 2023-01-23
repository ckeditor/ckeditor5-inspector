/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { getEditorModelMarkers } from '../../../src/model/data/utils';

import Button from '../../../src/components/button';
import ObjectInspector from '../../../src/components/objectinspector';
import Logger from '../../../src/logger';
import ModelMarkerInspector from '../../../src/model/markerinspector';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import BoldEditing from '@ckeditor/ckeditor5-basic-styles/src/bold/boldediting';

describe( '<ModelMarkerInspector />', () => {
	let editor, wrapper, element, store;

	beforeEach( () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		return TestEditor.create( element, {
			plugins: [ Paragraph, BoldEditing ],
			initialData: '<p>foo</p>'
		} ).then( newEditor => {
			editor = newEditor;

			editor.model.change( writer => {
				const root = editor.model.document.getRoot();
				const range = editor.model.createRange(
					editor.model.createPositionFromPath( root, [ 0, 1 ] ),
					editor.model.createPositionFromPath( root, [ 0, 3 ] )
				);

				writer.addMarker( 'foo:marker', { range, usingOperation: false, affectsData: true } );
			} );

			store = createStore( state => state, {
				editors: new Map( [ [ 'foo', editor ] ] ),
				currentEditorName: 'foo',
				model: {
					markers: getEditorModelMarkers( editor, 'main' )
				}
			} );

			wrapper = mount( <Provider store={store}><ModelMarkerInspector /></Provider> );
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
			const logMarkersButton = wrapper.find( Button ).first();
			const logSpy = sinon.stub( Logger, 'log' ).callsFake( () => {} );

			expect( wrapper.find( ObjectInspector ) ).to.have.length( 1 );
			expect( wrapper.childAt( 0 ).find( 'h2 > span' ).text() ).to.equal( 'Markers' );

			logMarkersButton.simulate( 'click' );
			sinon.assert.calledOnce( logSpy );
		} );

		it( 'should render markers tree', () => {
			const inspector = wrapper.find( ObjectInspector );
			const lists = inspector.props().lists;

			expect( lists[ 0 ].name ).to.equal( 'Markers tree' );
			expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {
				foo:
				{
					value: '1 marker',
					subProperties:
					{
						marker:
						{
							value: '',
							presentation: {
								colorBox: '#03a9f4'
							},
							subProperties: {
								name: {
									value: '"foo:marker"'
								},
								start: {
									value: '[0,1]'
								},
								end: {
									value: '[0,3]'
								},
								affectsData: {
									value: 'true'
								},
								managedUsingOperations: {
									value: 'false'
								}
							}
						}
					}
				}
			} );
		} );
	} );
} );
