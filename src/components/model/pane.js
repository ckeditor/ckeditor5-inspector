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
import ModelMarkerInspector from './markerinspector';
import StorageManager from '../../storagemanager';
import editorEventObserver from '../editorobserver';
import { getModelNodeDefinition, getModelPositionDefinition } from './utils';

const LOCAL_STORAGE_ACTIVE_TAB = 'active-model-tab-name';
const LOCAL_STORAGE_SHOW_MARKERS = 'model-show-markers';
const MARKER_COLORS = [
	'#e040fb', '#536dfe', '#00c853', '#f57f17', '#607d8b', '#9e9e9e',
];

class ModelPane extends Component {
	constructor( props ) {
		super( props );

		const showMarkers = StorageManager.get( LOCAL_STORAGE_SHOW_MARKERS );

		this.state = {
			editor: null,
			editorRoots: null,
			currentRootName: null,
			currentEditorNode: null,
			showMarkers: showMarkers ? showMarkers === 'true' : true,
			activeTab: StorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Inspect',
		};

		this.handleRootChange = this.handleRootChange.bind( this );
		this.handlePaneChange = this.handlePaneChange.bind( this );
		this.handleTreeClick = this.handleTreeClick.bind( this );
		this.handleShowMarkersChange = this.handleShowMarkersChange.bind( this );
	}

	editorEventObserverConfig( props ) {
		return {
			target: props.editor.model.document,
			event: 'change'
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

	handleShowMarkersChange( evt ) {
		this.setState( {
			showMarkers: evt.target.checked
		}, () => {
			StorageManager.set( LOCAL_STORAGE_SHOW_MARKERS, this.state.showMarkers );
		} );
	}

	render() {
		if ( !this.props.editor ) {
			return <Pane isEmpty="true">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</Pane>;
		}

		const ranges = getEditorModelRanges( this.props.editor );
		const markers = getEditorModelMarkers( this.props.editor );
		const treeDefinition = this.getEditorModelTreeDefinition( ranges, this.state.showMarkers ? markers : [] );

		return <Pane splitVertically="true">
			<ModelTree
				editor={this.props.editor}
				definition={treeDefinition}
				editorRoots={this.state.editorRoots}
				currentEditorNode={this.state.currentEditorNode}
				currentRootName={this.state.currentRootName}
				showMarkers={this.state.showMarkers}
				onClick={this.handleTreeClick}
				onRootChange={this.handleRootChange}
				onShowMarkersChange={this.handleShowMarkersChange}
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
						ranges={ranges}
					/>
					<ModelMarkerInspector
						label="Markers"
						markers={markers}
						editor={this.state.editor}
					/>
				</Tabs>
			</SidePane>
		</Pane>;
	}

	static getDerivedStateFromProps( props, state ) {
		if ( props.editor !== state.editor ) {
			const editorRoots = getEditorModelRoots( props.editor );

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

	getEditorModelTreeDefinition( ranges, markers ) {
		if ( !this.state.currentRootName ) {
			return null;
		}

		const editor = this.props.editor;
		const model = editor.model;
		const modelRoot = model.document.getRoot( this.state.currentRootName );

		return [
			getModelNodeDefinition( modelRoot, [ ...ranges, ...markers ] )
		];
	}
}

export default editorEventObserver( ModelPane );

function getEditorModelRoots( editor ) {
	if ( !editor ) {
		return null;
	}

	const roots = [ ...editor.model.document.roots ];

	// Put $graveyard at the end.
	return roots
		.filter( ( { rootName } ) => rootName !== '$graveyard' )
		.concat( roots.filter( ( { rootName } ) => rootName === '$graveyard' ) );
}

function getEditorModelRanges( editor ) {
	const ranges = [];
	const model = editor.model;

	for ( const range of model.document.selection.getRanges() ) {
		ranges.push( {
			type: 'selection',
			start: getModelPositionDefinition( range.start ),
			end: getModelPositionDefinition( range.end )
		} );
	}

	return ranges;
}

function getEditorModelMarkers( editor ) {
	const markers = [];
	const model = editor.model;
	let markerCount = 1;

	for ( const marker of model.markers ) {
		const { name, affectsData, managedUsingOperations } = marker;

		markers.push( {
			type: 'marker',
			marker,
			name,
			affectsData,
			managedUsingOperations,
			presentation: {
				// When there are more markers than colors, let's start over and reuse
				// the colors.
				color: MARKER_COLORS[ ( MARKER_COLORS.length - 1 ) % markerCount++ ],
			},
			start: getModelPositionDefinition( marker.getStart() ),
			end: getModelPositionDefinition( marker.getEnd() )
		} );
	}

	return markers;
}
