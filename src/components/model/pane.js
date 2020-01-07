/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import ModelTree from './tree';
import Pane from '../pane';
import Tabs from '../tabs';
import SidePane from '../sidepane';
import ModelNodeInspector from './nodeinspector';
import ModelSelectionInspector from './selectioninspector';
import StorageManager from '../../storagemanager';

const LOCAL_STORAGE_ACTIVE_TAB = 'active-model-tab-name';

export default class ModelPane extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			editor: null,
			editorRoots: null,
			currentRootName: null,
			currentEditorNode: null,

			activeTab: StorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Inspect',
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
			<ModelTree
				editor={this.props.editor}
				editorRoots={this.state.editorRoots}
				currentEditorNode={this.state.currentEditorNode}
				currentRootName={this.state.currentRootName}
				onClick={this.handleTreeClick}
				onRootChange={this.handleRootChange}
			/>
			<SidePane>
				<Tabs
					onTabChange={this.handlePaneChange}
					activeTab={this.state.activeTab}
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
				</Tabs>
			</SidePane>
		</Pane>;
	}

	static getDerivedStateFromProps( props, state ) {
		if ( props.editor !== state.editor ) {
			const editorRoots = getEditorRoots( props.editor );

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

	const roots = [ ...editor.model.document.roots ];

	// Put $graveyard at the end.
	return roots
		.filter( ( { rootName } ) => rootName !== '$graveyard' )
		.concat( roots.filter( ( { rootName } ) => rootName === '$graveyard' ) );
}
