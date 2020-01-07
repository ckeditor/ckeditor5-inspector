/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import ViewTree from './tree';
import Pane from '../pane';
import Tabs from '../tabs';
import SidePane from '../sidepane';
import ViewNodeInspector from './nodeinspector';
import ViewSelectionInspector from './selectioninspector';
import StorageManager from '../../storagemanager';
import '../pane.css';

const LOCAL_STORAGE_ACTIVE_TAB = 'active-view-tab-name';

export default class ViewPane extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			editor: null,
			currentEditorNode: null,
			editorRoots: null,
			currentRootName: null,

			activeTab: StorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Inspect'
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
					activeTab: 'Inspect'
				}, () => {
					StorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, 'Inspect' );
				} );
			}
		} );
	}

	handleRootChange( currentRootName ) {
		this.setState( { currentRootName } );
	}

	handlePaneChange( activeTab ) {
		this.setState( {
			activeTab
		}, () => {
			StorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, activeTab );
		} );
	}

	render() {
		if ( !this.props.editor ) {
			return <Pane isEmpty="true">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</Pane>;
		}

		return <Pane splitVertically="true">
			<ViewTree
				currentEditorNode={this.state.currentEditorNode}
				currentRootName={this.state.currentRootName}
				editor={this.props.editor}
				editorRoots={this.state.editorRoots}
				onClick={this.handleTreeClick}
				onRootChange={this.handleRootChange}
			/>
			<SidePane>
				<Tabs
					onTabChange={this.handlePaneChange}
					activeTab={this.state.activeTab}
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
				</Tabs>
			</SidePane>
		</Pane>;
	}

	static getDerivedStateFromProps( props, state ) {
		const editorRoots = getEditorRoots( props.editor );

		if ( props.editor !== state.editor ) {
			return {
				editor: props.editor,
				editorRoots,
				currentRootName: editorRoots ? editorRoots[ 0 ].rootName : null,
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
