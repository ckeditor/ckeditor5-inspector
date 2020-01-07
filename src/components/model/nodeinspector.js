/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global */

import React, { Component } from 'react';
import Button from './../button';
import Pane from '../pane';
import ObjectInspector from '../objectinspector';
import Logger from '../../logger';
import editorEventObserver from '../editorobserver';
import {
	isModelElement,
	isModelRoot,
	getNodePathString
} from './utils';
import { stringifyPropertyList } from '../utils';

class ModelNodeInspector extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.model.document,
			event: 'change'
		};
	}

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
					items: info.attributes
				},
				{
					name: 'Properties',
					url: info.url,
					items: info.properties
				},
			]}
		/>;
	}

	getInspectedEditorNodeInfo() {
		const node = this.props.inspectedNode;
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
			properties: [],
			attributes: []
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

			info.properties.push(
				[ 'childCount', node.childCount ],
				[ 'startOffset', node.startOffset ],
				[ 'endOffset', node.endOffset ],
				[ 'maxOffset', node.maxOffset ]
			);
		} else {
			info.name = node.data;
			info.type = 'Text';
			info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_text-Text.html';

			info.properties.push(
				[ 'startOffset', node.startOffset ],
				[ 'endOffset', node.endOffset ],
				[ 'offsetSize', node.offsetSize ]
			);
		}

		info.properties.push( [ 'path', getNodePathString( node ) ] );
		info.attributes.push( ...node.getAttributes() );

		info.properties = stringifyPropertyList( info.properties );
		info.attributes = stringifyPropertyList( info.attributes );

		for ( const attribute of info.attributes ) {
			const attributeName = attribute[ 0 ];
			const attirbuteProperties = Object.entries( this.props.editor.model.schema.getAttributeProperties( attributeName ) );

			attribute.push( stringifyPropertyList( attirbuteProperties ) );
		}

		return info;
	}
}

export default editorEventObserver( ModelNodeInspector );
