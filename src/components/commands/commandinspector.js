/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Button from './../button';
import Pane from '../pane';
import Logger from '../../logger';
import editorEventObserver from '../editorobserver';
import ObjectInspector from './../objectinspector';
import { stringifyPropertyList } from '../utils';

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
			return <Pane isEmpty="true">
				<p>Select a command to inspect</p>
			</Pane>;
		}

		return <ObjectInspector
			header={[
				<span key="link">
					<a href={info.url} target="_blank" rel="noopener noreferrer">
						<b>{info.type}</b>
					</a>
					:{info.name}
				</span>,
				<Button
					key="exec"
					type="exec"
					text="Execute command"
					onClick={() => this.props.editor.execute( info.name )}
				/>,
				<Button
					key="log"
					type="log"
					text="Log in console"
					onClick={() => Logger.log( info.command )}
				/>
			]}
			lists={[
				{
					name: 'Properties',
					url: info.url,
					items: info.properties
				}
			]}
		/>;
	}

	getEditorCommandInfo() {
		const editor = this.props.editor;
		const name = this.props.inspectedCommandName;

		if ( !name ) {
			return null;
		}

		const command = editor.commands.get( name );

		return {
			name,
			type: 'Command',
			url: 'https://ckeditor.com/docs/ckeditor5/latest/api/module_core_command-Command.html',
			properties: stringifyPropertyList( [
				[ 'isEnabled', command.isEnabled ],
				[ 'value', command.value ]
			] ),
			command,
		};
	}
}

export default editorEventObserver( CommandInspector );
