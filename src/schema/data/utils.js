/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	stringifyPropertyList
} from '../../components/utils';

const definitionPropertyNames = [
	'isBlock',
	'isInline',
	'isObject',
	'isContent',
	'isLimit',
	'isSelectable'
];

const DOCS_PREFIX_URL = 'https://ckeditor.com/docs/ckeditor5/latest/api/';

export function getSchemaDefinition( { editors, currentEditorName }, currentSchemaDefinitionName ) {
	if ( !currentSchemaDefinitionName ) {
		return null;
	}

	const schema = editors.get( currentEditorName ).model.schema;
	const definitions = schema.getDefinitions();
	const definition = definitions[ currentSchemaDefinitionName ];
	const properties = {};
	const allowChildren = {};
	const allowIn = {};
	let allowAttributes = {};

	for ( const propertyName of definitionPropertyNames ) {
		// Include only those that are true.
		if ( definition[ propertyName ] ) {
			properties[ propertyName ] = {
				value: definition[ propertyName ]
			};
		}
	}

	for ( const childName of definition.allowChildren.sort() ) {
		allowChildren[ childName ] = {
			value: true,
			title: `Click to see the definition of ${ childName }`
		};
	}

	for ( const parentName of definition.allowIn.sort() ) {
		allowIn[ parentName ] = {
			value: true,
			title: `Click to see the definition of ${ parentName }`
		};
	}

	for ( const attributeName of definition.allowAttributes.sort() ) {
		allowAttributes[ attributeName ] = {
			value: true
		};
	}

	allowAttributes = stringifyPropertyList( allowAttributes );

	for ( const attributeName in allowAttributes ) {
		const attributeProperties = schema.getAttributeProperties( attributeName );
		const subPropertyDefinitions = {};

		for ( const propertyName in attributeProperties ) {
			subPropertyDefinitions[ propertyName ] = {
				value: attributeProperties[ propertyName ]
			};
		}

		allowAttributes[ attributeName ].subProperties = stringifyPropertyList( subPropertyDefinitions );
	}

	return {
		currentSchemaDefinitionName,
		type: 'SchemaCompiledItemDefinition',
		urls: {
			general: DOCS_PREFIX_URL + 'module_engine_model_schema-SchemaCompiledItemDefinition.html',
			allowAttributes: DOCS_PREFIX_URL + 'module_engine_model_schema-SchemaItemDefinition.html#member-allowAttributes',
			allowChildren: DOCS_PREFIX_URL + 'module_engine_model_schema-SchemaItemDefinition.html#member-allowChildren',
			allowIn: DOCS_PREFIX_URL + 'module_engine_model_schema-SchemaItemDefinition.html#member-allowIn'
		},
		properties: stringifyPropertyList( properties ),
		allowChildren: stringifyPropertyList( allowChildren ),
		allowIn: stringifyPropertyList( allowIn ),
		allowAttributes,
		definition
	};
}

export function getSchemaTreeDefinition( { editors, currentEditorName } ) {
	const editor = editors.get( currentEditorName );

	if ( !editor ) {
		return [];
	}

	const list = [];
	const definitions = editors.get( currentEditorName ).model.schema.getDefinitions();

	for ( const definitionName in definitions ) {
		list.push( {
			name: definitionName,
			type: 'element',
			children: [],
			node: definitionName,
			attributes: [],

			presentation: {
				isEmpty: true,
				cssClass: 'ck-inspector-tree-node_tagless'
			}
		} );
	}

	return list.sort( ( a, b ) => a.name > b.name ? 1 : -1 );
}
