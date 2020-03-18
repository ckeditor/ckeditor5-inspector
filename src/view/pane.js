/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';

import Pane from '../components/pane';
import Tabs from '../components/tabs';
import SidePane from '../components/sidepane';

import ViewTree from './tree';
import ViewNodeInspector from './nodeinspector';
import ViewSelectionInspector from './selectioninspector';
import { getViewNodeDefinition, getViewPositionDefinition } from './utils';
import editorEventObserver from '../editorobserver';
import LocalStorageManager from '../localstoragemanager';

// import '../pane.css';

const LOCAL_STORAGE_ACTIVE_TAB = 'active-view-tab-name';
const LOCAL_STORAGE_ELEMENT_TYPES = 'view-element-types';

class ViewPane extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			editor: null,
			currentEditorNode: null,
			editorRoots: null,
			currentRootName: null,

			showTypes: LocalStorageManager.get( LOCAL_STORAGE_ELEMENT_TYPES ) === 'true',
			activeTab: LocalStorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Inspect'
		};

		this.handleTreeClick = this.handleTreeClick.bind( this );
		this.handlePaneChange = this.handlePaneChange.bind( this );
		this.handleRootChange = this.handleRootChange.bind( this );
		this.handleShowTypesChange = this.handleShowTypesChange.bind( this );
	}

	editorEventObserverConfig( props ) {
		return {
			target: props.editor.editing.view,
			event: 'render'
		};
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
					LocalStorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, 'Inspect' );
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
			LocalStorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, activeTab );
		} );
	}

	handleShowTypesChange( evt ) {
		this.setState( { showTypes: evt.target.checked }, () => {
			LocalStorageManager.set( LOCAL_STORAGE_ELEMENT_TYPES, this.state.showTypes );
		} );
	}

	render() {
		if ( !this.props.editor ) {
			return <Pane isEmpty="true">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</Pane>;
		}

		const ranges = getEditorViewRanges( this.props.editor );
		const treeDefinition = this.getEditorViewTreeDefinition( ranges );

		return <Pane splitVertically="true">
			<ViewTree
				currentEditorNode={this.state.currentEditorNode}
				currentRootName={this.state.currentRootName}
				editor={this.props.editor}
				definition={treeDefinition}
				editorRoots={this.state.editorRoots}
				showTypes={this.state.showTypes}
				onClick={this.handleTreeClick}
				onRootChange={this.handleRootChange}
				onShowTypesChange={this.handleShowTypesChange}
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
						ranges={ranges}
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

	getEditorViewTreeDefinition( ranges ) {
		if ( !this.state.currentRootName ) {
			return;
		}

		const editor = this.props.editor;
		const document = editor.editing.view.document;
		const root = document.getRoot( this.state.currentRootName );

		return [
			getViewNodeDefinition( root, [ ...ranges ], this.state.showTypes )
		];
	}
}

export default editorEventObserver( ViewPane );

function getEditorRoots( editor ) {
	if ( !editor ) {
		return null;
	}

	return [ ...editor.editing.view.document.roots ];
}

function getEditorViewRanges( editor ) {
	const ranges = [];
	const selection = editor.editing.view.document.selection;

	for ( const range of selection.getRanges() ) {
		ranges.push( {
			type: 'selection',
			start: getViewPositionDefinition( range.start ),
			end: getViewPositionDefinition( range.end )
		} );
	}

	return ranges;
}
