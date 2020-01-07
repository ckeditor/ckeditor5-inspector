/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Logger from '../../logger';
import Button from './../button';
import editorEventObserver from '../editorobserver';
import ObjectInspector from './../objectinspector';
import { nodeToString } from './utils';
import { stringifyPropertyList } from '../utils';

const API_DOCS_PREFIX = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_selection-Selection.html';

class ViewSelectionInspector extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.editing.view,
			event: 'render'
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
					onClick={() => Logger.log( this.props.editor.editing.view.document.selection )}
				/>
			]}
			lists={[
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
							onClick: () => Logger.log( this.props.editor.editing.view.document.selection.anchor )
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
							onClick: () => Logger.log( this.props.editor.editing.view.document.selection.focus )
						}
					],
					items: info.focus
				}
			]}
		/>;
	}

	getEditorSelectionInfo() {
		const selection = this.props.editor.editing.view.document.selection;
		const info = {
			properties: [
				[ 'isCollapsed', selection.isCollapsed ],
				[ 'isBackward', selection.isBackward ],
				[ 'isFake', selection.isFake ],
				[ 'rangeCount', selection.rangeCount ],
			],
			anchor: getPositionInfo( selection.anchor ),
			focus: getPositionInfo( selection.focus ),
		};

		for ( const category in info ) {
			info[ category ] = stringifyPropertyList( info[ category ] );
		}

		return info;
	}
}

function getPositionInfo( position ) {
	return [
		[ 'offset', position.offset ],
		[ 'isAtEnd', position.isAtEnd ],
		[ 'isAtStart', position.isAtStart ],
		[ 'parent', nodeToString( position.parent ) ]
	];
}

export default editorEventObserver( ViewSelectionInspector );
