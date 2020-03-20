/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
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
import editorEventObserver from '../editorobserver';

class ViewPane extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.currentEditor.editing.view,
			event: 'render'
		};
	}

	editorEventObserverCallback() {
		this.props.updateViewState();
	}

	render() {
		if ( !this.props.currentEditor ) {
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

const mapStateToProps = ( { currentEditor, view: { ui: { activeTab } } } ) => {
	return { currentEditor, activeTab };
};

const mapDispatchToProps = {
	setViewActiveTab,
	updateViewState
};

export default connect( mapStateToProps, mapDispatchToProps )( editorEventObserver( ViewPane ) );
