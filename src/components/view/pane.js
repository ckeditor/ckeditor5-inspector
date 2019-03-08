/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import ViewTree from './tree';
import ViewInspector from './inspector';
import StorageManager from '../../storagemanager';

const LOCAL_STORAGE_ACTIVE_PANE = 'ck5-inspector-active-view-pane-name';

export default class ViewPane extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			editor: null,
			currentEditorNode: null,
			editorRoots: null,
			currentRootName: null,

			activePane: StorageManager.get( LOCAL_STORAGE_ACTIVE_PANE ) || 'Inspect'
		};

		this.treeRef = React.createRef();
		this.inspectorRef = React.createRef();

		this.handleTreeClick = this.handleTreeClick.bind( this );
		this.handlePaneChange = this.handlePaneChange.bind( this );
		this.handleRootChange = this.handleRootChange.bind( this );
		this.syncPaneWithEditor = this.syncPaneWithEditor.bind( this );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps && prevProps.editor ) {
			prevProps.editor.editing.view.off( 'render', this.syncPaneWithEditor );
		}

		this.startListeningToEditor();
	}

	componentDidMount() {
		this.startListeningToEditor();
	}

	startListeningToEditor() {
		if ( this.props.editor ) {
			this.props.editor.editing.view.on( 'render', this.syncPaneWithEditor );
			this.syncPaneWithEditor();
		}
	}

	handleTreeClick( evt, currentEditorNode ) {
		evt.persist();
		evt.stopPropagation();

		this.setState( { currentEditorNode }, () => {
			this.syncPaneWithEditor();

			// Double click on a tree element should open the inspector.
			if ( evt.detail == 2 ) {
				this.setState( {
					activePane: 'Inspect'
				} );
			}
		} );
	}

	handleRootChange( currentRootName ) {
		this.setState( { currentRootName }, () => {
			this.syncPaneWithEditor();
		} );
	}

	handlePaneChange( activePane ) {
		this.setState( {
			activePane
		}, () => {
			StorageManager.set( LOCAL_STORAGE_ACTIVE_PANE, activePane );
		} );
	}

	syncPaneWithEditor() {
		this.treeRef.current.update();
		this.inspectorRef.current.update();
	}

	componentWillUnmount() {
		if ( this.props.editor ) {
			this.props.editor.editing.view.off( 'render', this.syncPaneWithEditor );
		}
	}

	render() {
		if ( !this.props.editor ) {
			return <div className="ck-inspector-panes__content__empty-wrapper">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</div>;
		}

		return [
			<ViewTree
				currentEditorNode={this.state.currentEditorNode}
				currentRootName={this.state.currentRootName}
				editor={this.props.editor}
				editorRoots={this.state.editorRoots}
				key="tree"
				onClick={this.handleTreeClick}
				onRootChange={this.handleRootChange}
				ref={this.treeRef}
			/>,
			<ViewInspector
				currentRootName={this.state.currentRootName}
				activePane={this.state.activePane}
				onPaneChange={this.handlePaneChange}
				editor={this.props.editor}
				inspectedNode={this.state.currentEditorNode}
				key="inspector"
				ref={this.inspectorRef}
			/>
		];
	}

	static getDerivedStateFromProps( props, state ) {
		if ( props.editor !== state.editor ) {
			return {
				editor: props.editor,
				editorRoots: getEditorRoots( props.editor ),
				currentRootName: getCurrentRootName( props.editor ),
				currentEditorNode: null
			};
		} else {
			return null;
		}
	}
}

function getEditorRoots( editor ) {
	if ( !editor ) {
		return null;
	}

	return [ ...editor.editing.view.document.roots ];
}

function getCurrentRootName( editor ) {
	if ( !editor ) {
		return null;
	}

	if ( editor.editing.view.document.roots.has( 'main' ) ) {
		return 'main';
	} else {
		return getEditorRoots( editor )[ 0 ].rootName;
	}
}
