/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	toggleModelShowCompactText,
	setModelCurrentRootName,
	toggleModelShowMarkers,
	setModelCurrentNodePath,
	setModelActiveTab
} from './data/actions';

import { getEditorModelRoots } from './data/utils/utils';

import Tree from '../components/tree/tree';
import NavBox from '../components/navbox';
import Select from '../components/select';
import Checkbox from '../components/checkbox';

class ModelTree extends Component {
	constructor( props ) {
		super( props );

		this.handleTreeClick = this.handleTreeClick.bind( this );
		this.handleRootChange = this.handleRootChange.bind( this );
	}

	handleTreeClick( evt, currentNodePath ) {
		evt.persist();
		evt.stopPropagation();

		this.props.setModelCurrentNodePath( currentNodePath );

		// Double click on a tree element should open the inspector.
		if ( evt.detail === 2 ) {
			this.props.setModelActiveTab( 'Inspect' );
		}
	}

	handleRootChange( evt ) {
		this.props.setModelCurrentRootName( evt.target.value );
	}

	render() {
		const currentEditor = this.props.editors.get( this.props.currentEditorName );

		return <NavBox>
			{[
				<div className="ck-inspector-tree__config" key="root-cfg">
					<Select
						id="view-root-select"
						label="Root"
						value={this.props.currentRootName}
						options={getEditorModelRoots( currentEditor ).map( root => root.rootName )}
						onChange={this.handleRootChange}
					/>
				</div>,
				<div className="ck-inspector-tree__config" key="text-cfg">
					<Checkbox
						label="Compact text"
						id="model-compact-text"
						isChecked={this.props.showCompactText}
						onChange={this.props.toggleModelShowCompactText}
					/>
					<Checkbox
						label="Show markers"
						id="model-show-markers"
						isChecked={this.props.showMarkers}
						onChange={this.props.toggleModelShowMarkers}
					/>
				</div>
			]}
			<Tree
				className={[
					!this.props.showMarkers ? 'ck-inspector-model-tree__hide-markers' : ''
				]}
				definition={this.props.treeDefinition}
				textDirection={currentEditor.locale.contentLanguageDirection}
				onClick={this.handleTreeClick}
				showCompactText={this.props.showCompactText}
				activeNodePath={this.props.currentNodePath}
			/>
		</NavBox>;
	}
}

const mapStateToProps = (
	{ editors, currentEditorName, model: { treeDefinition, currentRootName, currentNodePath, ui: { showMarkers, showCompactText } } }
) => {
	return { treeDefinition, editors, currentEditorName, currentRootName, currentNodePath, showMarkers, showCompactText };
};

const mapDispatchToProps = {
	toggleModelShowCompactText,
	setModelCurrentRootName,
	toggleModelShowMarkers,
	setModelCurrentNodePath,
	setModelActiveTab
};

export default connect( mapStateToProps, mapDispatchToProps )( ModelTree );
