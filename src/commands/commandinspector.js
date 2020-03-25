/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../components/button';
import Pane from '../components/pane';
import ObjectInspector from '../components/objectinspector';

import Logger from '../logger';

class CommandInspector extends Component {
	render() {
		const definition = this.props.currentCommandDefinition;

		if ( !definition ) {
			return <Pane isEmpty="true">
				<p>Select a command to inspect</p>
			</Pane>;
		}

		const currentEditor = this.props.editors.get( this.props.currentEditorName );

		return <ObjectInspector
			header={[
				<span key="link">
					<a href={definition.url} target="_blank" rel="noopener noreferrer">
						<b>{definition.type}</b>
					</a>
					:{this.props.currentCommandName}
				</span>,
				<Button
					key="exec"
					type="exec"
					text="Execute command"
					onClick={() => currentEditor.execute( this.props.currentCommandName )}
				/>,
				<Button
					key="log"
					type="log"
					text="Log in console"
					onClick={() => Logger.log( definition.command )}
				/>
			]}
			lists={[
				{
					name: 'Properties',
					url: definition.url,
					itemDefinitions: definition.properties
				}
			]}
		/>;
	}
}

const mapStateToProps = ( { editors, currentEditorName, commands: { currentCommandName, currentCommandDefinition } } ) => {
	return { editors, currentEditorName, currentCommandName, currentCommandDefinition };
};

export default connect( mapStateToProps, {} )( CommandInspector );
