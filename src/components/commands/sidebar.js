/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Panes from '../panes';
import CommandInspector from './inspector';
import '../inspector.css';

export default class CommandSidebar extends Component {
	render() {
		return <div className="ck-inspector__explorer">
			<Panes
				onPaneChange={this.props.onPaneChange}
				activePane={this.props.activePane}
			>
				<CommandInspector
					label="Inspect"
					editor={this.props.editor}
					inspectedCommandName={this.props.inspectedCommandName}
				/>
			</Panes>
		</div>;
	}
}
