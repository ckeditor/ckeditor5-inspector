/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console */

import React, { Component } from 'react';
import Button from './../button';
import Logger from '../../logger';
import { isModelElement, isModelText, isModelRoot } from './utils';
import { PropertyList } from './../propertylist';
import { getNodePathString } from './utils';
export default class ModelNodeInspector extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			inspectedNodeInfo: null
		};
	}

	update() {
		this.setState( {
			inspectedNodeInfo: getNodeInfo( this.props.inspectedNode, this.props.currentRootName )
		} );
	}

	componentDidMount() {
		// When a node is selected in the tree and switching back from the selection tab.
		this.update();
	}

	render() {
		const info = this.state.inspectedNodeInfo;

		if ( !info ) {
			return <div className="ck-inspector-panes__content__empty-wrapper">
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
}

function getNodeInfo( node, currentRootName ) {
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

	return info;
}
