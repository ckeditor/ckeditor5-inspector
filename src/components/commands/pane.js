/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import CommandTree from './tree';
import Pane from '../pane';
import Tabs from '../tabs';
import SidePane from '../sidepane';
import CommandInspector from './commandinspector';
import '../pane.css';
export default class CommandsPane extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			editor: null,
			currentCommandName: null,
		};

		this.handleTreeClick = this.handleTreeClick.bind( this );
	}

	handleTreeClick( evt, currentCommandName ) {
		evt.persist();
		evt.stopPropagation();

		this.setState( { currentCommandName } );
	}

	render() {
		if ( !this.props.editor ) {
			return <Pane isEmpty="true">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</Pane>;
		}

		return <Pane splitVertically="true">
			<CommandTree
				editor={this.props.editor}
				currentCommandName={this.state.currentCommandName}
				onClick={this.handleTreeClick}
			/>
			<SidePane>
				<Tabs activeTab="Inspect">
					<CommandInspector
						label="Inspect"
						editor={this.props.editor}
						inspectedCommandName={this.state.currentCommandName}
					/>
				</Tabs>
			</SidePane>
		</Pane>;
	}

	static getDerivedStateFromProps( props, state ) {
		if ( props.editor !== state.editor ) {
			return {
				editor: props.editor,
				currentCommandName: null
			};
		} else {
			return null;
		}
	}
}
