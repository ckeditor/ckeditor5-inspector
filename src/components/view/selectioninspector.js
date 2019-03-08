/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console */

import React, { Component } from 'react';
import Logger from '../../logger';
import { PropertyList } from './../propertylist';
import { nodeToString } from './utils';
import Button from './../button';
export default class ViewSelectionInspector extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			selectionInfo: getSelectionInfo( this.props.editor )
		};
	}

	update() {
		this.setState( {
			selectionInfo: getSelectionInfo( this.props.editor )
		} );
	}

	render() {
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
			<PropertyList items={this.state.selectionInfo.properties} />
			<hr/>

			<h3>
				<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_selection-Selection.html#member-anchor"
					target="_blank" rel="noopener noreferrer">Anchor</a>
				<Button type="log" text="Log in console"
					onClick={() => Logger.log( this.props.editor.editing.view.document.selection.focus )} />
			</h3>
			<PropertyList items={this.state.selectionInfo.anchor} />
			<hr/>

			<h3>
				<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_selection-Selection.html#member-focus"
					target="_blank" rel="noopener noreferrer">Focus</a>
				<Button type="log" text="Log in console"
					onClick={() => Logger.log( this.props.editor.editing.view.document.selection.anchor )} />
			</h3>
			<PropertyList items={this.state.selectionInfo.focus} />
		</div>;
	}
}

function getSelectionInfo( editor ) {
	const selection = editor.editing.view.document.selection;

	return {
		properties: [
			[ 'isCollapsed', selection.isCollapsed ],
			[ 'isBackward', selection.isBackward ],
			[ 'isFake', selection.isFake ],
			[ 'rangeCount', selection.rangeCount ],
		],
		anchor: [
			[ 'offset', selection.anchor.offset ],
			[ 'isAtEnd', selection.anchor.isAtEnd ],
			[ 'isAtStart', selection.anchor.isAtStart ],
			[ 'parent', nodeToString( selection.anchor.parent ) ]
		],
		focus: [
			[ 'offset', selection.focus.offset ],
			[ 'isAtEnd', selection.focus.isAtEnd ],
			[ 'isAtStart', selection.focus.isAtStart ],
			[ 'parent', nodeToString( selection.focus.parent ) ]
		],
	};
}
