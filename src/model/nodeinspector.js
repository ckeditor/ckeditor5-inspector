/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
	setActiveTab
} from '../data/actions';

import {
	setSchemaCurrentDefinitionName
} from '../schema/data/actions';

import Button from '../components/button';
import Pane from '../components/pane';
import ObjectInspector from '../components/objectinspector';

import Logger from '../logger';

import ConsoleIcon from '../assets/img/console.svg';
import SchemaIcon from '../assets/img/schema.svg';

class ModelNodeInspector extends Component {
	constructor( props ) {
		super( props );

		this.handleNodeLogButtonClick = this.handleNodeLogButtonClick.bind( this );
		this.handleNodeSchemaButtonClick = this.handleNodeSchemaButtonClick.bind( this );
	}

	handleNodeLogButtonClick() {
		Logger.log( this.props.currentNodeDefinition.editorNode );
	}

	handleNodeSchemaButtonClick() {
		const schema = this.props.editors.get( this.props.currentEditorName ).model.schema;
		const schemaDefinition = schema.getDefinition( this.props.currentNodeDefinition.editorNode );

		this.props.setActiveTab( 'Schema' );
		this.props.setSchemaCurrentDefinitionName( schemaDefinition.name );
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
						<b>{definition.type}</b>
					</a>:
					{ definition.type === 'Text' ? <em>{definition.name}</em> : definition.name }
				</span>,
				<Button
					key="log"
					icon={<ConsoleIcon />}
					text="Log in console"
					onClick={this.handleNodeLogButtonClick}
				/>,
				<Button
					key="schema"
					icon={<SchemaIcon />}
					text="Show in schema"
					onClick={this.handleNodeSchemaButtonClick}
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

const mapStateToProps = ( { editors, currentEditorName, model: { currentNodeDefinition } } ) => {
	return { editors, currentEditorName, currentNodeDefinition };
};

const mapDispatchToProps = {
	setActiveTab,
	setSchemaCurrentDefinitionName
};

export default connect( mapStateToProps, mapDispatchToProps )( ModelNodeInspector );
