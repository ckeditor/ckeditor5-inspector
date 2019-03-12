/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global */

import React, { Component } from 'react';
import Button from './../button';
import Logger from '../../logger';
import editorEventObserver from '../editorobserver';
import { isModelElement, isModelText, isModelRoot } from './utils';
import PropertyList from './../propertylist';
import { getNodePathString } from './utils';
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
			return <div className="ck-inspector-tabbed-panes__content__empty-wrapper">
				<p>Select a node in the tree to inspect</p>
			</div>;
		}

		let nodeNameContent;

		if ( info.type === 'Text' ) {
			nodeNameContent = <span>
				<a href={info.url} target="_blank" rel="noopener noreferrer"><b>Text</b></a>:&quot;<em>{info.name}</em>&quot;
			</span>;
		} else {
			nodeNameContent = <span>
				<a href={info.url} target="_blank" rel="noopener noreferrer"><b>{info.type}</b></a>:{info.name}
			</span>;
		}

		const content = [
			<h2 key="node-name" className="ck-inspector-code">
				{nodeNameContent}
				<Button type="log" text="Log in console" onClick={() => Logger.log( info.editorNode )} />
			</h2>,
			<hr key="props-separator" />,
			<h3 key="props-header">Properties</h3>,
			<PropertyList key="props-list" items={info.properties} />
		];

		if ( info.attributes.length ) {
			content.push(
				<hr key="attrs-separator" />,
				<h3 key="attrs-header">Attributes</h3>,
				<PropertyList key="attrs" items={info.attributes} />
			);
		}

		return <div className="ck-inspector__object-inspector">{content}</div>;
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
		} else if ( isModelText( node ) ) {
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

		return info;
	}
}

export default editorEventObserver( ModelNodeInspector );
