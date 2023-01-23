/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React from 'react';
import TestEditor from '../../utils/testeditor';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { getSchemaDefinition } from '../../../src/schema/data/utils';

import { reducer } from '../../../src/data/reducer';
import ObjectInspector from '../../../src/components/objectinspector';
import SchemaDefinitionInspector from '../../../src/schema/schemadefinitioninspector';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';

describe( '<SchemaDefinitionInspector />', () => {
	let editor, wrapper, element, store;

	beforeEach( async () => {
		element = document.createElement( 'div' );
		document.body.appendChild( element );

		editor = await TestEditor.create( element, {
			plugins: [
				Paragraph,
				function( editor ) {
					this.afterInit = () => {
						editor.model.schema.extend( 'paragraph', {
							allowAttributes: [ 'foo' ]
						} );

						editor.model.schema.setAttributeProperties( 'foo', {
							someProperty: 123
						} );
					};
				}
			]
		} );

		const editors = new Map( [ [ 'test-editor', editor ] ] );
		const currentEditorName = 'test-editor';

		store = createStore( reducer, {
			editors,
			currentEditorName,
			ui: {
				activeTab: 'Schema'
			},
			schema: {
				currentSchemaDefinitionName: 'paragraph',
				currentSchemaDefinition: getSchemaDefinition( { editors, currentEditorName }, 'paragraph' ),
				treeDefinition: null
			}
		} );

		wrapper = mount( <Provider store={store}><SchemaDefinitionInspector /></Provider> );
	} );

	afterEach( async () => {
		wrapper.unmount();
		element.remove();
		sinon.restore();

		await editor.destroy();
	} );

	describe( 'render()', () => {
		it( 'should render a placeholder when no props#currentSchemaDefinition', () => {
			const store = createStore( state => state, {
				editors: new Map( [ [ 'test-editor', editor ] ] ),
				currentEditorName: 'test-editor',
				schema: {
					currentSchemaDefinition: null
				}
			} );

			const wrapper = mount( <Provider store={store}><SchemaDefinitionInspector /></Provider> );

			expect( wrapper.childAt( 0 ).text() ).to.match( /^Select a schema definition/ );

			wrapper.unmount();
		} );

		it( 'should render an object inspector when there is props#currentSchemaDefinition', () => {
			expect( wrapper.find( ObjectInspector ) ).to.have.length( 1 );
		} );

		describe( 'scheme definition info', () => {
			it( 'should render schema definition properties', () => {
				wrapper.setProps( { currentSchemaDefinitionName: 'paragraph' } );

				const inspector = wrapper.find( ObjectInspector );
				const lists = inspector.props().lists;

				expect( lists[ 0 ].name ).to.equal( 'Properties' );
				expect( lists[ 0 ].url ).to.match( /^https:\/\/ckeditor.com\/docs\// );
				expect( lists[ 0 ].itemDefinitions ).to.deep.equal( {
					isBlock: { value: 'true' }
				} );
			} );

			it( 'should render schema definition allowed attributes', () => {
				wrapper.setProps( { currentSchemaDefinitionName: 'paragraph' } );

				const inspector = wrapper.find( ObjectInspector );
				const lists = inspector.props().lists;

				expect( lists[ 1 ].name ).to.equal( 'Allowed attributes' );
				expect( lists[ 1 ].url ).to.match( /^https:\/\/ckeditor.com\/docs\// );
				expect( lists[ 1 ].itemDefinitions ).to.deep.equal( {
					foo: {
						subProperties: {
							someProperty: {
								value: '123'
							}
						},
						value: 'true'
					}
				} );
			} );

			it( 'should render schema definition allowed children', () => {
				wrapper.setProps( { currentSchemaDefinitionName: 'paragraph' } );

				const inspector = wrapper.find( ObjectInspector );
				const lists = inspector.props().lists;

				expect( lists[ 2 ].name ).to.equal( 'Allowed children' );
				expect( lists[ 2 ].url ).to.match( /^https:\/\/ckeditor.com\/docs\// );
				expect( lists[ 2 ].itemDefinitions ).to.deep.include( {
					$text: {
						value: 'true',
						title: 'Click to see the definition of $text'
					}
				} );
			} );

			it( 'should render schema definition allowed in', () => {
				wrapper.setProps( { currentSchemaDefinitionName: 'paragraph' } );

				const inspector = wrapper.find( ObjectInspector );
				const lists = inspector.props().lists;

				expect( lists[ 3 ].name ).to.equal( 'Allowed in' );
				expect( lists[ 3 ].url ).to.match( /^https:\/\/ckeditor.com\/docs\// );
				expect( lists[ 3 ].itemDefinitions ).to.deep.include( {
					$clipboardHolder: {
						value: 'true',
						title: 'Click to see the definition of $clipboardHolder'
					},
					$documentFragment: {
						value: 'true',
						title: 'Click to see the definition of $documentFragment'
					},
					$root: {
						value: 'true',
						title: 'Click to see the definition of $root'
					}
				} );
			} );
		} );

		it( 'should navigate to another definition upon clicking a name in "allowed children"', () => {
			wrapper.setProps( { currentSchemaDefinitionName: 'paragraph' } );

			const inspector = wrapper.find( ObjectInspector );
			const propertyTitleLabel = inspector
				.find( 'PropertyTitle' )
				.filter( { name: '$text' } )
				.first()
				.find( 'label' );

			propertyTitleLabel.simulate( 'click' );

			expect( store.getState().schema.currentSchemaDefinitionName ).to.equal( '$text' );
		} );

		it( 'should navigate to another definition upon clicking a name in "allowed in"', () => {
			wrapper.setProps( { currentSchemaDefinitionName: 'paragraph' } );

			const inspector = wrapper.find( ObjectInspector );
			const propertyTitleLabel = inspector
				.find( 'PropertyTitle' )
				.filter( { name: '$root' } )
				.first()
				.find( 'label' );

			propertyTitleLabel.simulate( 'click' );

			expect( store.getState().schema.currentSchemaDefinitionName ).to.equal( '$root' );
		} );
	} );
} );
