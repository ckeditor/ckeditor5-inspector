/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	setModelActiveTab,
	updateModelState
} from './data/actions';

import Pane from '../components/pane';
import Tabs from '../components/tabs';
import SidePane from '../components/sidepane';

import ModelTree from './tree';
import ModelNodeInspector from './nodeinspector';
import ModelSelectionInspector from './selectioninspector';
import ModelMarkerInspector from './markerinspector';

import editorEventObserver from '../editorobserver';

class ModelPane extends Component {
	editorEventObserverConfig( props ) {
		const editor = props.currentEditor;

		return {
			target: editor.model.document,
			event: 'change'
		};
	}

	editorEventObserverCallback() {
		this.props.updateModelState();
	}

	render() {
		if ( !this.props.currentEditor ) {
			return <Pane isEmpty="true">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</Pane>;
		}

		return <Pane splitVertically="true">
			<ModelTree />
			<SidePane>
				<Tabs onTabChange={this.props.setModelActiveTab} activeTab={this.props.activeTab} >
					<ModelNodeInspector label="Inspect" />
					<ModelSelectionInspector label="Selection" />
					<ModelMarkerInspector label="Markers" />
				</Tabs>
			</SidePane>
		</Pane>;
	}
}

const mapStateToProps = ( { currentEditor, model: { roots, currentRootName, activeTab, showMarkers } } ) => {
	return { currentEditor, roots, activeTab, currentRootName, showMarkers };
};

const mapDispatchToProps = {
	setModelActiveTab,
	updateModelState
};

export default connect( mapStateToProps, mapDispatchToProps )( editorEventObserver( ModelPane ) );
