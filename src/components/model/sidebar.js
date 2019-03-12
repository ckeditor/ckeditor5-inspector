/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Panes from '../panes';
import ModelNodeInspector from './nodeinspector';
import ModelSelectionInspector from './selectioninspector';
import '../sidebar.css';

export default class ModelSidebar extends Component {
	render() {
		return <div className="ck-inspector__sidebar">
			<Panes
				onPaneChange={this.props.onPaneChange}
				activePane={this.props.activePane}
			>
				<ModelNodeInspector
					label="Inspect"
					editor={this.props.editor}
					currentRootName={this.props.currentRootName}
					inspectedNode={this.props.inspectedNode}
				/>
				<ModelSelectionInspector
					label="Selection"
					editor={this.props.editor}
				/>
			</Panes>
		</div>;
	}
}
