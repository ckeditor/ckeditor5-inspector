/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateCommandsState } from './data/actions';

import Pane from '../components/pane';
import Tabs from '../components/tabs';
import SidePane from '../components/sidepane';

import CommandTree from './tree';
import CommandInspector from './commandinspector';

import editorEventObserver from '../editorobserver';

class CommandsPane extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.currentEditor.model.document,
			event: 'change'
		};
	}

	editorEventObserverCallback() {
		this.props.updateCommandsState();
	}

	render() {
		if ( !this.props.currentEditor ) {
			return <Pane isEmpty="true">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</Pane>;
		}

		return <Pane splitVertically="true">
			<CommandTree />
			<SidePane>
				<Tabs activeTab="Inspect">
					<CommandInspector label="Inspect" />
				</Tabs>
			</SidePane>
		</Pane>;
	}
}

const mapStateToProps = ( { currentEditor } ) => {
	return { currentEditor };
};

export default connect( mapStateToProps, { updateCommandsState } )( editorEventObserver( CommandsPane ) );
