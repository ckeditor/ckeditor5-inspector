/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	isModelElement,
	isModelRoot,
	getModelNodePathString,
	getEditorModelNodeByRootAndPath
} from '../../utils';

import { stringifyPropertyList } from '../../../components/utils';

const DOCS_URL_PREFIX = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_';

/**
 * Returns a definition for the model node inspector.
 *
 * @param {Editor} currentEditor
 * @param {String} currentRootName
 * @param {Array} nodePath
 *
 * @returns {Object}
 */
export function getEditorModelNodeDefinition( currentEditor, currentRootName, nodePath ) {
	const node = getEditorModelNodeByRootAndPath( currentEditor, currentRootName, nodePath );

	const definition = {
		path: nodePath,
		rootName: currentRootName,

		properties: {},
		attributes: {}
	};

	if ( isModelElement( node ) ) {
		if ( isModelRoot( node ) ) {
			definition.type = 'RootElement';
			definition.name = node.rootName;
			definition.url = `${ DOCS_URL_PREFIX }rootelement-RootElement.html`;
		} else {
			definition.type = 'Element';
			definition.name = node.name;
			definition.url = `${ DOCS_URL_PREFIX }element-Element.html`;
		}

		definition.properties = {
			childCount: {
				value: node.childCount
			},
			startOffset: {
				value: node.startOffset
			},
			endOffset: {
				value: node.endOffset
			},
			maxOffset: {
				value: node.maxOffset
			}
		};
	} else {
		definition.name = node.data;
		definition.type = 'Text';
		definition.url = `${ DOCS_URL_PREFIX }text-Text.html`;

		definition.properties = {
			startOffset: {
				value: node.startOffset
			},
			endOffset: {
				value: node.endOffset
			},
			offsetSize: {
				value: node.offsetSize
			}
		};
	}

	definition.properties.path = { value: getModelNodePathString( node ) };

	for ( const [ name, value ] of node.getAttributes() ) {
		definition.attributes[ name ] = { value };
	}

	definition.properties = stringifyPropertyList( definition.properties );
	definition.attributes = stringifyPropertyList( definition.attributes );

	for ( const attribute in definition.attributes ) {
		const attributePropertyDefinitions = {};
		const attirbuteProperties = currentEditor.model.schema.getAttributeProperties( attribute );

		for ( const name in attirbuteProperties ) {
			attributePropertyDefinitions[ name ] = { value: attirbuteProperties[ name ] };
		}

		definition.attributes[ attribute ].subProperties = stringifyPropertyList( attributePropertyDefinitions );
	}

	return definition;
}
