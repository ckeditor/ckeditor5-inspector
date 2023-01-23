/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
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

class CommandsPane extends Component {
	render() {
		if ( !this.props.currentEditorName ) {
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

const mapStateToProps = ( { currentEditorName } ) => {
	return { currentEditorName };
};

export default connect( mapStateToProps, { updateCommandsState } )( CommandsPane );
