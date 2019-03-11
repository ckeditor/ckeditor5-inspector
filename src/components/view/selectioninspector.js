/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Logger from '../../logger';
import Button from './../button';
import editorEventObserver from '../editorobserver';
import PropertyList from './../propertylist';
import { nodeToString } from './utils';
import { stringifyPropertyList } from '../utils';
class ViewSelectionInspector extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.editing.view,
			event: 'render'
		};
	}

	render() {
		const info = this.getEditorSelectionInfo();

		return <div className="ck-inspector__object-inspector">
			<h2 className="ck-inspector-code">
				<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_selection-Selection.html"
					target="_blank" rel="noopener noreferrer">
					<b>Selection</b>
				</a>
				<Button type="log" text="Log in console" onClick={() => Logger.log( this.props.editor.editing.view.document.selection )} />
			</h2>
			<hr/>

			<h3>Properties</h3>
			<PropertyList items={info.properties} />
			<hr/>

			<h3>
				<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_selection-Selection.html#member-anchor"
					target="_blank" rel="noopener noreferrer">Anchor</a>
				<Button type="log" text="Log in console"
					onClick={() => Logger.log( this.props.editor.editing.view.document.selection.focus )} />
			</h3>
			<PropertyList items={info.anchor} />
			<hr/>

			<h3>
				<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_selection-Selection.html#member-focus"
					target="_blank" rel="noopener noreferrer">Focus</a>
				<Button type="log" text="Log in console"
					onClick={() => Logger.log( this.props.editor.editing.view.document.selection.anchor )} />
			</h3>
			<PropertyList items={info.focus} />
		</div>;
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
