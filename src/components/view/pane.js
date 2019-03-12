/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import ViewTree from './tree';
import Panes from '../tabbedpanes';
import ViewNodeInspector from './nodeinspector';
import ViewSelectionInspector from './selectioninspector';
import StorageManager from '../../storagemanager';
import '../sidebar.css';

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

		this.handleTreeClick = this.handleTreeClick.bind( this );
		this.handlePaneChange = this.handlePaneChange.bind( this );
		this.handleRootChange = this.handleRootChange.bind( this );
	}

	handleTreeClick( evt, currentEditorNode ) {
		evt.persist();
		evt.stopPropagation();

		this.setState( {
			currentEditorNode
		}, () => {
			// Double click on a tree element should open the inspector.
			if ( evt.detail == 2 ) {
				this.setState( {
					activePane: 'Inspect'
				}, () => {
					StorageManager.set( LOCAL_STORAGE_ACTIVE_PANE, 'Inspect' );
				} );
			}
		} );
	}

	handleRootChange( currentRootName ) {
		this.setState( { currentRootName } );
	}

	handlePaneChange( activePane ) {
		this.setState( {
			activePane
		}, () => {
			StorageManager.set( LOCAL_STORAGE_ACTIVE_PANE, activePane );
		} );
	}

	render() {
		if ( !this.props.editor ) {
			return <div className="ck-inspector-tabbed-panes__content__empty-wrapper">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</div>;
		}

		return <div className="ck-inspector-pane">
			<ViewTree
				currentEditorNode={this.state.currentEditorNode}
				currentRootName={this.state.currentRootName}
				editor={this.props.editor}
				editorRoots={this.state.editorRoots}
				key="tree"
				onClick={this.handleTreeClick}
				onRootChange={this.handleRootChange}
			/>
			<Panes
				onPaneChange={this.handlePaneChange}
				activePane={this.state.activePane}
			>
				<ViewNodeInspector
					label="Inspect"
					editor={this.state.editor}
					currentRootName={this.state.currentRootName}
					inspectedNode={this.state.currentEditorNode}
				/>
				<ViewSelectionInspector
					label="Selection"
					editor={this.state.editor}
				/>
			</Panes>
		</div>;
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
