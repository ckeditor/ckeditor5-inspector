/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';

import Tree from '../components/tree/tree';
import NavBox from '../components/navbox';
import Select from '../components/select';
import Checkbox from '../components/checkbox';

import StorageManager from '../storagemanager';

const LOCAL_STORAGE_COMPACT_TEXT = 'model-compact-text';

export default class ModelTree extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showCompactText: StorageManager.get( LOCAL_STORAGE_COMPACT_TEXT ) === 'true'
		};

		this.handleCompactTextChange = this.handleCompactTextChange.bind( this );
	}

	handleCompactTextChange( evt ) {
		this.setState( { showCompactText: evt.target.checked }, () => {
			StorageManager.set( LOCAL_STORAGE_COMPACT_TEXT, this.state.showCompactText );
		} );
	}

	render() {
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
					<Checkbox
						label="Show markers"
						id="model-show-markers"
						isChecked={this.props.showMarkers}
						onChange={this.props.onShowMarkersChange}
					/>
				</div>
			]}
			<Tree
				definition={this.props.definition}
				textDirection={this.props.editor.locale.contentLanguageDirection}
				onClick={this.props.onClick}
				showCompactText={this.state.showCompactText}
				activeNode={this.props.currentEditorNode}
			/>
		</NavBox>;
	}
}
