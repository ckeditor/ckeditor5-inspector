/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	setViewActiveTab,
	updateViewState
} from './data/actions';

import Pane from '../components/pane';
import Tabs from '../components/tabs';
import SidePane from '../components/sidepane';

import ViewTree from './tree';
import ViewNodeInspector from './nodeinspector';
import ViewSelectionInspector from './selectioninspector';

class ViewPane extends Component {
	render() {
		if ( !this.props.currentEditorName ) {
			return <Pane isEmpty="true">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</Pane>;
		}

		return <Pane splitVertically="true">
			<ViewTree />
			<SidePane>
				<Tabs onTabChange={this.props.setViewActiveTab} activeTab={this.props.activeTab}>
					<ViewNodeInspector label="Inspect" />
					<ViewSelectionInspector label="Selection" />
				</Tabs>
			</SidePane>
		</Pane>;
	}
}

const mapStateToProps = ( { currentEditorName, view: { ui: { activeTab } } } ) => {
	return { currentEditorName, activeTab };
};

const mapDispatchToProps = {
	setViewActiveTab,
	updateViewState
};

export default connect( mapStateToProps, mapDispatchToProps )( ViewPane );
