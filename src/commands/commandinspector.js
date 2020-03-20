/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../components/button';
import Pane from '../components/pane';
import ObjectInspector from '../components/objectinspector';
import { stringifyPropertyList } from '../components/utils';

import Logger from '../logger';

class CommandInspector extends Component {
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
					onClick={() => this.props.currentEditor.execute( info.name )}
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
					itemDefinitions: info.properties
				}
			]}
		/>;
	}

	getEditorCommandInfo() {
		const editor = this.props.currentEditor;
		const name = this.props.currentCommandName;

		if ( !name ) {
			return null;
		}

		const command = editor.commands.get( name );

		return {
			name,
			type: 'Command',
			url: 'https://ckeditor.com/docs/ckeditor5/latest/api/module_core_command-Command.html',
			properties: stringifyPropertyList( {
				isEnabled: {
					value: command.isEnabled
				},
				value: {
					value: command.value
				}
			} ),
			command
		};
	}
}

const mapStateToProps = ( { currentEditor, commands: { currentCommandName } } ) => {
	return { currentEditor, currentCommandName };
};

export default connect( mapStateToProps, {} )( CommandInspector );
