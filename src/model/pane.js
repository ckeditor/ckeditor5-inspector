/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setModelActiveTab } from './data/actions';

import Pane from '../components/pane';
import Tabs from '../components/tabs';
import SidePane from '../components/sidepane';

import ModelTree from './tree';
import ModelNodeInspector from './nodeinspector';
import ModelSelectionInspector from './selectioninspector';
import ModelMarkerInspector from './markerinspector';

import './model.css';

class ModelPane extends Component {
	render() {
		if ( !this.props.currentEditorName ) {
			return <Pane isEmpty="true">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</Pane>;
		}

		return <Pane splitVertically="true">
			<ModelTree />
			<SidePane>
				<Tabs onTabChange={this.props.setModelActiveTab} activeTab={this.props.activeTab}>
					<ModelNodeInspector label="Inspect" />
					<ModelSelectionInspector label="Selection" />
					<ModelMarkerInspector label="Markers" />
				</Tabs>
			</SidePane>
		</Pane>;
	}
}

const mapStateToProps = ( { currentEditorName, model: { ui: { activeTab } } } ) => {
	return { currentEditorName, activeTab };
};

const mapDispatchToProps = { setModelActiveTab };

export default connect( mapStateToProps, mapDispatchToProps )( ModelPane );
