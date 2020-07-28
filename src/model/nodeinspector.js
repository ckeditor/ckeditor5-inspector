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
import { getEditorModelNodeByRootAndPath } from './utils';

class ModelNodeInspector extends Component {
	constructor( props ) {
		super( props );

		this.handleNodeLogButtonClick = this.handleNodeLogButtonClick.bind( this );
	}

	handleNodeLogButtonClick() {
		const editor = this.props.editors.get( this.props.currentEditorName );
		const node = getEditorModelNodeByRootAndPath( editor, this.props.currentRootName, this.props.currentNodeDefinition.path );

		Logger.log( node );
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
					type="log"
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

const mapStateToProps = ( { editors, currentEditorName, model: { currentNodeDefinition, currentRootName } } ) => {
	return { editors, currentEditorName, currentNodeDefinition, currentRootName };
};

export default connect( mapStateToProps, {} )( ModelNodeInspector );
