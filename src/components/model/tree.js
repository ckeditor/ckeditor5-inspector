/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Tree from '../tree/tree';
import NavBox from '../navbox';
import Select from '../select';
import Checkbox from '../checkbox';
import StorageManager from '../../storagemanager';
import editorEventObserver from '../editorobserver';
import { getModelNodeDefinition } from './utils';

const LOCAL_STORAGE_COMPACT_TEXT = 'model-compact-text';

class ModelTree extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showCompactText: StorageManager.get( LOCAL_STORAGE_COMPACT_TEXT ) === 'true'
		};

		this.handleCompactTextChange = this.handleCompactTextChange.bind( this );
	}

	editorEventObserverConfig( props ) {
		return {
			target: props.editor.model.document,
			event: 'change'
		};
	}

	handleCompactTextChange( evt ) {
		this.setState( { showCompactText: evt.target.checked }, () => {
			StorageManager.set( LOCAL_STORAGE_COMPACT_TEXT, this.state.showCompactText );
		} );
	}

	render() {
		const treeDefinition = this.getEditorModelTreeDefinition();

		return <NavBox>
			{[
				<div className="ck-inspector-tree__config" key="root-cfg">
					<Select
						id="view-root-select"
						label="Root"
						value={this.props.currentRootName}
						options={this.props.editorRoots.map( root => root.rootName )}
						onChange={evt => this.props.onRootChange( evt.target.value )}
					/>
				</div>,
				<div className="ck-inspector-tree__config" key="text-cfg">
					<Checkbox
						label="Compact text"
						id="model-compact-text"
						isChecked={this.state.showCompactText}
						onChange={this.handleCompactTextChange}
					/>
				</div>
			]}
			<Tree
				definition={treeDefinition}
				textDirection={this.props.editor.locale.contentLanguageDirection}
				onClick={this.props.onClick}
				showCompactText={this.state.showCompactText}
				activeNode={this.props.currentEditorNode}
			/>
		</NavBox>;
	}

	getEditorModelTreeDefinition() {
		if ( !this.props.currentRootName ) {
			return null;
		}

		const editor = this.props.editor;
		const model = editor.model;

		return [
			getModelNodeDefinition(
				model.document.getRoot( this.props.currentRootName ),
				getEditorModelRanges( this.props.editor )
			)
		];
	}
}

function getEditorModelRanges( editor ) {
	const ranges = [];
	const model = editor.model;

	for ( const range of model.document.selection.getRanges() ) {
		ranges.push( {
			type: 'selection',
			startPath: range.start.path,
			endPath: range.end.path
		} );
	}

	for ( const marker of model.markers ) {
		ranges.push( {
			type: 'marker',
			name: marker.name,
			startPath: marker.getStart().path,
			endPath: marker.getEnd().path
		} );
	}

	return ranges;
}

export default editorEventObserver( ModelTree );
