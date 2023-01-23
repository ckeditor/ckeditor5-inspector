/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../components/button';
import Pane from '../components/pane';
import ObjectInspector from '../components/objectinspector';

import Logger from '../logger';

import ConsoleIcon from '../assets/img/console.svg';
import PlayIcon from '../assets/img/play.svg';

class CommandInspector extends Component {
	constructor( props ) {
		super( props );

		this.handleCommandLogButtonClick = this.handleCommandLogButtonClick.bind( this );
		this.handleCommandExecuteButtonClick = this.handleCommandExecuteButtonClick.bind( this );
	}

	handleCommandLogButtonClick() {
		Logger.log( this.props.currentCommandDefinition.command );
	}

	handleCommandExecuteButtonClick() {
		this.props.editors.get( this.props.currentEditorName ).execute( this.props.currentCommandName );
	}

	render() {
		const definition = this.props.currentCommandDefinition;

		if ( !definition ) {
			return <Pane isEmpty="true">
				<p>Select a command to inspect</p>
			</Pane>;
		}

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
					icon={<PlayIcon />}
					text="Execute command"
					onClick={this.handleCommandExecuteButtonClick}
				/>,
				<Button
					key="log"
					icon={<ConsoleIcon />}
					text="Log in console"
					onClick={this.handleCommandLogButtonClick}
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
