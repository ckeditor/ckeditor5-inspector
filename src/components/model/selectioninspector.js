/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Logger from '../../logger';
import Button from './../button';
import editorEventObserver from '../editorobserver';
import PropertyList from './../propertylist';
import { getNodePathString } from './utils';
import { stringifyPropertyList } from '../utils';

class ModelSelectionInspector extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.model.document,
			event: 'change'
		};
	}

	render() {
		const info = this.getEditorSelectionInfo();
		let attributesList;

		if ( info.attributes.length ) {
			attributesList = <div>
				<h3>
					<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_selection-Selection.html#function-getAttributes" // eslint-disable-line max-len
						target="_blank" rel="noopener noreferrer">
						Attributes
					</a>
				</h3>
				<PropertyList items={info.attributes} />
				<hr/>
			</div>;
		}

		return <div className="ck-inspector__object-inspector">
			<h2 className="ck-inspector-code">
				<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_selection-Selection.html"
					target="_blank" rel="noopener noreferrer"><b>Selection</b></a>
				<Button type="log" text="Log in console" onClick={() => Logger.log( this.props.editor.model.document.selection )} />
			</h2>
			<hr/>

			{attributesList}

			<h3>Properties</h3>
			<PropertyList items={info.properties} />
			<hr/>

			<h3>
				<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_selection-Selection.html#member-anchor"
					target="_blank" rel="noopener noreferrer">Anchor</a>
				<Button type="log" text="Log in console" onClick={() => Logger.log( this.props.editor.model.document.selection.anchor )} />
			</h3>
			<PropertyList items={info.anchor} />
			<hr/>

			<h3>
				<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_selection-Selection.html#member-focus"
					target="_blank" rel="noopener noreferrer">Focus</a>
				<Button type="log" text="Log in console" onClick={() => Logger.log( this.props.editor.model.document.selection.focus )} />
			</h3>
			<PropertyList items={info.focus} />

		</div>;
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
