/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import ObjectInspector from '../components/objectinspector';
import Button from '../components/button';
import Pane from '../components/pane';
import { stringifyPropertyList } from '../components/utils';

import {
	isViewElement,
	isViewRoot,
	isViewAttributeElement,
	isViewUiElement,
	isViewEditableElement,
	isViewEmptyElement
} from './utils';
import Logger from '../logger';

const DOCS_URL_PREFIX = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view';

class ViewNodeInspector extends Component {
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
				},
				{
					name: 'Custom Properties',
					url: `${ DOCS_URL_PREFIX }_element-Element.html#function-getCustomProperty`,
					itemDefinitions: info.customProperties
				}
			]}
		/>;
	}

	getInspectedEditorNodeInfo() {
		const node = this.props.currentNode;

		if ( !node ) {
			return null;
		}

		if ( !isViewRoot( node ) && !node.parent ) {
			return;
		}

		const info = {
			editorNode: node,
			properties: {},
			attributes: {},
			customProperties: {}
		};

		if ( isViewElement( node ) ) {
			if ( isViewRoot( node ) ) {
				info.type = 'RootEditableElement';
				info.name = node.rootName;
				info.url = `${ DOCS_URL_PREFIX }_rooteditableelement-RootEditableElement.html`;
			} else {
				info.name = node.name;

				if ( isViewAttributeElement( node ) ) {
					info.type = 'AttributeElement';
					info.url = `${ DOCS_URL_PREFIX }_attributeelement-AttributeElement.html`;
				} else if ( isViewEmptyElement( node ) ) {
					info.type = 'EmptyElement';
					info.url = `${ DOCS_URL_PREFIX }_emptyelement-EmptyElement.html`;
				} else if ( isViewUiElement( node ) ) {
					info.type = 'UIElement';
					info.url = `${ DOCS_URL_PREFIX }_uielement-UIElement.html`;
				} else if ( isViewEditableElement( node ) ) {
					info.type = 'EditableElement';
					info.url = `${ DOCS_URL_PREFIX }_editableelement-EditableElement.html`;
				} else {
					info.type = 'ContainerElement';
					info.url = `${ DOCS_URL_PREFIX }_containerelement-ContainerElement.html`;
				}
			}

			for ( const [ name, value ] of node.getAttributes() ) {
				info.attributes[ name ] = { value };
			}

			info.properties = {
				index: {
					value: node.index
				},
				isEmpty: {
					value: node.isEmpty
				},
				childCount: {
					value: node.childCount
				}
			};

			for ( const [ name, value ] of node.getCustomProperties() ) {
				info.customProperties[ name ] = { value };
			}
		} else {
			info.name = node.data;
			info.type = 'Text';
			info.url = `${ DOCS_URL_PREFIX }_text-Text.html`;

			info.properties = {
				index: {
					value: node.index
				}
			};
		}

		info.properties = stringifyPropertyList( info.properties );
		info.customProperties = stringifyPropertyList( info.customProperties );
		info.attributes = stringifyPropertyList( info.attributes );

		return info;
	}
}

const mapStateToProps = ( { view: { currentNode } } ) => {
	return { currentNode };
};

export default connect( mapStateToProps, {} )( ViewNodeInspector );
