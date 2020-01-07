/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Logger from '../../logger';
import Button from './../button';
import editorEventObserver from '../editorobserver';
import ObjectInspector from './../objectinspector';
import { getNodePathString } from './utils';
import { stringifyPropertyList } from '../utils';

const API_DOCS_PREFIX = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_selection-Selection.html';

class ModelSelectionInspector extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.model.document,
			event: 'change'
		};
	}

	render() {
		const info = this.getEditorSelectionInfo();

		return <ObjectInspector
			header={[
				<span key="link">
					<a href={API_DOCS_PREFIX}
						target="_blank" rel="noopener noreferrer">
						<b>Selection</b>
					</a>
				</span>,
				<Button
					key="log"
					type="log"
					text="Log in console"
					onClick={() => Logger.log( this.props.editor.model.document.selection )}
				/>
			]}
			lists={[
				{
					name: 'Attributes',
					url: `${ API_DOCS_PREFIX }#function-getAttributes`,
					items: info.attributes
				},
				{
					name: 'Properties',
					url: `${ API_DOCS_PREFIX }`,
					items: info.properties
				},
				{
					name: 'Anchor',
					url: `${ API_DOCS_PREFIX }#member-anchor`,
					buttons: [
						{
							type: 'log',
							text: 'Log in console',
							onClick: () => Logger.log( this.props.editor.model.document.selection.anchor )
						}
					],
					items: info.anchor
				},
				{
					name: 'Focus',
					url: `${ API_DOCS_PREFIX }#member-focus`,
					buttons: [
						{
							type: 'log',
							text: 'Log in console',
							onClick: () => Logger.log( this.props.editor.model.document.selection.focus )
						}
					],
					items: info.focus
				}
			]}
		/>;
	}

	getEditorSelectionInfo() {
		const selection = this.props.editor.model.document.selection;
		const anchor = selection.anchor;
		const focus = selection.focus;
		const info = {
			properties: [
				[ 'isCollapsed', selection.isCollapsed ],
				[ 'isBackward', selection.isBackward ],
				[ 'isGravityOverridden', selection.isGravityOverridden ],
				[ 'rangeCount', selection.rangeCount ],
			],
			attributes: [ ...selection.getAttributes() ],
			anchor: getPositionInfo( anchor ),
			focus: getPositionInfo( focus )
		};

		for ( const category in info ) {
			info[ category ] = stringifyPropertyList( info[ category ] );
		}

		return info;
	}
}

function getPositionInfo( position ) {
	return [
		[ 'path', getNodePathString( position ) ],
		[ 'stickiness', position.stickiness ],
		[ 'index', position.index ],
		[ 'isAtEnd', position.isAtEnd ],
		[ 'isAtStart', position.isAtStart ],
		[ 'offset', position.offset ],
		[ 'textNode', position.textNode && position.textNode.data ],
	];
}

export default editorEventObserver( ModelSelectionInspector );
