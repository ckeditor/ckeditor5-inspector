/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Panes from '../panes';
import ViewNodeInspector from './nodeinspector';
import ViewSelectionInspector from './selectioninspector';
import '../sidebar.css';

export default class ViewInspector extends Component {
	render() {
		return <div className="ck-inspector__sidebar">
			<Panes
				onPaneChange={this.props.onPaneChange}
				activePane={this.props.activePane}
			>
				<ViewNodeInspector
					label="Inspect"
					editor={this.props.editor}
					currentRootName={this.props.currentRootName}
					inspectedNode={this.props.inspectedNode}
				/>
				<ViewSelectionInspector
					label="Selection"
					editor={this.props.editor}
				/>
			</Panes>
		</div>;
	}
}
