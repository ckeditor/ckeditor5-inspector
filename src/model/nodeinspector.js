/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../components/button';
import Pane from '../components/pane';
import ObjectInspector from '../components/objectinspector';

import Logger from '../logger';

import ConsoleIcon from '../assets/img/console.svg';

class ModelNodeInspector extends Component {
	constructor( props ) {
		super( props );

		this.handleNodeLogButtonClick = this.handleNodeLogButtonClick.bind( this );
	}

	handleNodeLogButtonClick() {
		Logger.log( this.props.currentNodeDefinition.editorNode );
	}

	render() {
		const definition = this.props.currentNodeDefinition;

		if ( !definition ) {
			return <Pane isEmpty="true">
				<p>Select a node in the tree to inspect</p>
			</Pane>;
		}

		return <ObjectInspector
			header={[
				<span key="link">
					<a href={definition.url} target="_blank" rel="noopener noreferrer">
						<b>{definition.type}</b>:
					</a>
					{ definition.type === 'Text' ? <em>{definition.name}</em> : definition.name }
				</span>,
				<Button
					key="log"
					icon={<ConsoleIcon />}
					text="Log in console"
					onClick={this.handleNodeLogButtonClick}
				/>
			]}
			lists={[
				{
					name: 'Attributes',
					url: definition.url,
					itemDefinitions: definition.attributes
				},
				{
					name: 'Properties',
					url: definition.url,
					itemDefinitions: definition.properties
				}
			]}
		/>;
	}
}

const mapStateToProps = ( { model: { currentNodeDefinition } } ) => {
	return { currentNodeDefinition };
};

export default connect( mapStateToProps, {} )( ModelNodeInspector );
