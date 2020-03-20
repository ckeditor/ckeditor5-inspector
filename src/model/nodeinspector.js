/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../components/button';
import Pane from '../components/pane';
import ObjectInspector from '../components/objectinspector';
import { stringifyPropertyList } from '../components/utils';

import Logger from '../logger';
import {
	isModelElement,
	isModelRoot,
	getNodePathString
} from './utils';

class ModelNodeInspector extends Component {
	render() {
		const info = this.getInspectedEditorNodeInfo();

		if ( !info ) {
			return <Pane isEmpty="true">
				<p>Select a node in the tree to inspect</p>
			</Pane>;
		}

		return <ObjectInspector
			header={[
				<span key="link">
					<a href={info.url} target="_blank" rel="noopener noreferrer">
						<b>{info.type}</b>:
					</a>
					{ info.type === 'Text' ? <em>{info.name}</em> : info.name }
				</span>,
				<Button
					key="log"
					type="log"
					text="Log in console"
					onClick={() => Logger.log( info.editorNode )}
				/>
			]}
			lists={[
				{
					name: 'Attributes',
					url: info.url,
					itemDefinitions: info.attributes
				},
				{
					name: 'Properties',
					url: info.url,
					itemDefinitions: info.properties
				}
			]}
		/>;
	}

	getInspectedEditorNodeInfo() {
		const node = this.props.currentNode;
		const currentRootName = this.props.currentRootName;

		if ( !node ) {
			return null;
		}

		if ( !isModelRoot( node ) && !node.parent ) {
			return;
		}

		if ( node.root.rootName !== currentRootName ) {
			return;
		}

		const info = {
			editorNode: node,
			properties: {},
			attributes: {}
		};

		if ( isModelElement( node ) ) {
			if ( isModelRoot( node ) ) {
				info.type = 'RootElement';
				info.name = node.rootName;
				info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_rootelement-RootElement.html';
			} else {
				info.type = 'Element';
				info.name = node.name;
				info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_element-Element.html';
			}

			info.properties = {
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
			info.name = node.data;
			info.type = 'Text';
			info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_text-Text.html';

			info.properties = {
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

		info.properties.path = { value: getNodePathString( node ) };

		for ( const [ name, value ] of node.getAttributes() ) {
			info.attributes[ name ] = { value };
		}

		info.properties = stringifyPropertyList( info.properties );
		info.attributes = stringifyPropertyList( info.attributes );

		for ( const attribute in info.attributes ) {
			const attributePropertyDefinitions = {};
			const attirbuteProperties = this.props.currentEditor.model.schema.getAttributeProperties( attribute );

			for ( const name in attirbuteProperties ) {
				attributePropertyDefinitions[ name ] = { value: attirbuteProperties[ name ] };
			}

			info.attributes[ attribute ].subProperties = stringifyPropertyList( attributePropertyDefinitions );
		}

		return info;
	}
}

const mapStateToProps = ( { currentEditor, model: { currentNode, currentRootName } } ) => {
	return { currentEditor, currentNode, currentRootName };
};

export default connect( mapStateToProps, {} )( ModelNodeInspector );
