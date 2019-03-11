/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Button from './../button';
import Logger from '../../logger';
import editorEventObserver from '../editorobserver';
import { PropertyList } from './../propertylist';

class CommandInspector extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.model.document,
			event: 'change'
		};
	}

	render() {
		const info = this.getEditorCommandInfo();

		if ( !info ) {
			return <div className="ck-inspector-panes__content__empty-wrapper">
				<p>Select a command to inspect</p>
			</div>;
		}

		const content = [
			<h2 key="node-name" className="ck-inspector-code">
				<span>
					<a href={info.url} target="_blank" rel="noopener noreferrer"><b>{info.type}</b></a>:{info.name}
				</span>
				<Button type="exec" text="Execute command" onClick={() => this.props.editor.execute( info.name )} />
				<Button type="log" text="Log in console" onClick={() => Logger.log( info.command )} />
			</h2>,
			<hr key="props-separator" />,
			<h3 key="props-header">Properties</h3>,
			<PropertyList key="props-list" items={info.properties} />
		];

		return <div className="ck-inspector__object-inspector">{content}</div>;
	}

	getEditorCommandInfo() {
		const editor = this.props.editor;
		const name = this.props.inspectedCommandName;

		if ( !name ) {
			return null;
		}

		const command = editor.commands.get( name );

		return {
			type: 'Command',
			name: name,
			url: 'https://ckeditor.com/docs/ckeditor5/latest/api/module_core_command-Command.html',
			properties: [
				[ 'isEnabled', command.isEnabled ],
				[ 'value', command.value ]
			],
			command,
		};
	}
}

export default editorEventObserver( CommandInspector );
