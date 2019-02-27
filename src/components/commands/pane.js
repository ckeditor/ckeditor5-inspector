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

		this.treeRef = React.createRef();
		this.inspectorRef = React.createRef();

		this.handleTreeClick = this.handleTreeClick.bind( this );
		this.syncPaneWithEditor = this.syncPaneWithEditor.bind( this );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps && prevProps.editor ) {
			prevProps.editor.model.document.off( 'change', this.syncPaneWithEditor );
		}

		this.startListeningToEditor();
	}

	componentDidMount() {
		this.startListeningToEditor();
	}

	startListeningToEditor() {
		if ( this.props.editor ) {
			this.props.editor.model.document.on( 'change', this.syncPaneWithEditor );
			this.syncPaneWithEditor();
		}
	}

	handleTreeClick( evt, currentCommandName ) {
		evt.persist();
		evt.stopPropagation();

		this.setState( { currentCommandName }, () => {
			this.syncPaneWithEditor();
		} );
	}

	syncPaneWithEditor() {
		this.treeRef.current.update();
		this.inspectorRef.current.update();
	}

	componentWillUnmount() {
		if ( this.props.editor ) {
			this.props.editor.model.document.off( 'change', this.syncPaneWithEditor );
		}
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
				ref={this.treeRef}
			/>,
			<CommandInspector
				editor={this.props.editor}
				inspectedCommandName={this.state.currentCommandName}
				key="explorer"
				ref={this.inspectorRef}
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
