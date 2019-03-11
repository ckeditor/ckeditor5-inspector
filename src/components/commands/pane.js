/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import CommandTree from './tree';
import CommandInspector from './inspector';

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
			return <div className="ck-inspector-panes__content__empty-wrapper">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</div>;
		}

		return [
			<CommandTree
				editor={this.props.editor}
				currentCommandName={this.state.currentCommandName}
				key="tree"
				onClick={this.handleTreeClick}
			/>,
			<CommandInspector
				editor={this.props.editor}
				inspectedCommandName={this.state.currentCommandName}
				activePane="Inspect"
				key="explorer"
			/>
		];
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
