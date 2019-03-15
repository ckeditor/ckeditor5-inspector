/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global window */

import React, { Component } from 'react';
import { Rnd } from 'react-rnd';

import ModelTree from './tree';
import Pane from '../pane';
import Tabs from '../tabs';
import ModelNodeInspector from './nodeinspector';
import ModelSelectionInspector from './selectioninspector';
import StorageManager from '../../storagemanager';

const LOCAL_STORAGE_SIDE_PANE_WIDTH = 'side-pane-width';
const SIDE_PANE_MIN_WIDTH = 200;
const SIDE_PANE_DEFAULT_WIDTH = '500px';
const SIDE_PANE_STYLES = {
	position: 'relative'
};

const LOCAL_STORAGE_ACTIVE_TAB = 'active-model-tab-name';
export default class ModelPane extends Component {
	constructor( props ) {
		super( props );

		const sidePaneWidth = StorageManager.get( LOCAL_STORAGE_SIDE_PANE_WIDTH ) || SIDE_PANE_DEFAULT_WIDTH;

		this.state = {
			editor: null,
			editorRoots: null,
			currentRootName: null,
			currentEditorNode: null,

			sidePaneWidth,
			activeTab: StorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Inspect',
		};

		this.handleRootChange = this.handleRootChange.bind( this );
		this.handlePaneChange = this.handlePaneChange.bind( this );
		this.handleTreeClick = this.handleTreeClick.bind( this );
		this.handleSidePaneResize = this.handleSidePaneResize.bind( this );

		this.paneRef = React.createRef();
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

	handleSidePaneResize( evt, direction, ref ) {
		this.setState( {
			sidePaneWidth: ref.style.width,
		}, () => {
			StorageManager.set( LOCAL_STORAGE_SIDE_PANE_WIDTH, ref.style.width );
		} );
	}

	get maxSidePaneWidth() {
		return Math.min( window.innerWidth - 400, window.innerWidth * .8 );
	}

	render() {
		if ( !this.props.editor ) {
			return <Pane isEmpty="true">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</Pane>;
		}

		return <Pane splitVertically="true" ref={this.paneRef}>
			<ModelTree
				editor={this.props.editor}
				editorRoots={this.state.editorRoots}
				currentEditorNode={this.state.currentEditorNode}
				currentRootName={this.state.currentRootName}
				onClick={this.handleTreeClick}
				onRootChange={this.handleRootChange}
			/>
			<div style={{ position: 'relative' }} >
				<Rnd
					enableResizing={{ left: true }}
					disableDragging={true}
					minWidth={SIDE_PANE_MIN_WIDTH}
					maxWidth={this.maxSidePaneWidth}
					style={SIDE_PANE_STYLES}
					position={{ x: '100%', y: '100%' }}
					size={{
						width: this.state.sidePaneWidth,
						height: '100%'
					}}
					onResizeStop={this.handleSidePaneResize}>
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
				</Rnd>
			</div>
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
