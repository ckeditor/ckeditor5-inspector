/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import ModelTree from './tree';
import Panes from '../tabbedpanes';
import ModelNodeInspector from './nodeinspector';
import ModelSelectionInspector from './selectioninspector';
import StorageManager from '../../storagemanager';
import '../sidebar.css';

const LOCAL_STORAGE_ACTIVE_PANE = 'ck5-inspector-active-model-pane-name';
export default class ModelPane extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			editor: null,
			editorRoots: null,
			currentRootName: null,
			currentEditorNode: null,

			activePane: StorageManager.get( LOCAL_STORAGE_ACTIVE_PANE ) || 'Inspect'
		};

		this.handleRootChange = this.handleRootChange.bind( this );
		this.handlePaneChange = this.handlePaneChange.bind( this );
		this.handleTreeClick = this.handleTreeClick.bind( this );
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
			<ModelTree
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
				<ModelNodeInspector
					label="Inspect"
					editor={this.state.editor}
					currentRootName={this.state.currentRootName}
					inspectedNode={this.state.currentEditorNode}
				/>
				<ModelSelectionInspector
					label="Selection"
					editor={this.state.editor}
				/>
			</Panes>
		</div>
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

	return [ ...editor.model.document.roots ];
}

function getCurrentRootName( editor ) {
	if ( !editor ) {
		return null;
	}

	if ( editor.model.document.roots.has( 'main' ) ) {
		return 'main';
	} else {
		return getEditorRoots( editor )[ 0 ].rootName;
	}
}
