/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Button from './../button';
import Logger from '../../logger';
import editorEventObserver from '../editorobserver';
import {
	isViewElement,
	isViewText,
	isViewRoot,
	isViewAttributeElement,
	isViewContainerElement,
	isViewUiElement,
	isViewEmptyElement
} from './utils';
import { PropertyList } from './../propertylist';

class NodeInspector extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.editing.view,
			event: 'render'
		};
	}

	render() {
		const info = this.getInspectedEditorNodeInfo();

		if ( !info ) {
			return <div className="ck-inspector-panes__content__empty-wrapper">
				<p>Select a node in the tree to inspect</p>
			</div>;
		}

		let nodeNameContent;

		if ( info.type === 'Text' ) {
			nodeNameContent = <span>
				<a href={info.url} target="_blank" rel="noopener noreferrer"><b>{info.type}</b></a>:&quot;<em>{info.name}</em>&quot;
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

		if ( !isViewRoot( node ) && !node.parent ) {
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

		if ( isViewElement( node ) ) {
			if ( isViewRoot( node ) ) {
				info.type = 'RootEditableElement';
				info.name = node.rootName;
				info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_rooteditableelement-RootEditableElement.html';
			} else {
				info.name = node.name;

				if ( isViewAttributeElement( node ) ) {
					info.type = 'AttributeElement';
					info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_attributeelement-AttributeElement.html';
				} else if ( isViewEmptyElement( node ) ) {
					info.type = 'EmptyElement';
					info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_emptyelement-EmptyElement.html';
				} else if ( isViewUiElement( node ) ) {
					info.type = 'UIElement';
					info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_uielement-UIElement.html';
				} else if ( isViewContainerElement ( node ) ) {
					info.type = 'ContainerElement';
					info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_containerelement-ContainerElement.html';
				} else {
					info.type = 'Element';
					info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_element-Element.html';
				}
			}

			info.attributes.push( ...node.getAttributes() );
			info.properties.push(
				[ 'index', node.index ],
				[ 'isEmpty', node.isEmpty ],
				[ 'childCount', node.childCount ],
			);
		} else if ( isViewText( node ) ) {
			info.name = node.data;
			info.type = 'Text';
			info.url = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_text-Text.html';

			info.properties.push(
				[ 'index', node.index ]
			);
		}

		return info;
	}
}

export default editorEventObserver( NodeInspector );
