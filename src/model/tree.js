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
	setModelCurrentNode,
	setModelActiveTab
} from './data/actions';

import Tree from '../components/tree/tree';
import NavBox from '../components/navbox';
import Select from '../components/select';
import Checkbox from '../components/checkbox';

class ModelTree extends Component {
	constructor( props ) {
		super( props );

		this.handleTreeClick = this.handleTreeClick.bind( this );
	}

	handleTreeClick( evt, currentNode ) {
		evt.persist();
		evt.stopPropagation();

		this.props.setModelCurrentNode( currentNode );

		// Double click on a tree element should open the inspector.
		if ( evt.detail === 2 ) {
			this.props.setModelActiveTab( 'Inspect' );
		}
	}

	render() {
		return <NavBox>
			{[
				<div className="ck-inspector-tree__config" key="root-cfg">
					<Select
						id="view-root-select"
						label="Root"
						value={this.props.currentRootName}
						options={this.props.roots.map( root => root.rootName )}
						onChange={evt => this.props.setModelCurrentRootName( evt.target.value )}
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
			<div className={[
				!this.props.showMarkers ? 'ck-inspector-model-tree__hide-markers' : ''
			]}>
				<Tree
					definition={this.props.treeDefinition}
					textDirection={this.props.currentEditor.locale.contentLanguageDirection}
					onClick={this.handleTreeClick}
					showCompactText={this.props.showCompactText}
					activeNode={this.props.currentNode}
				/>
			</div>
		</NavBox>;
	}
}

const mapStateToProps = ( { currentEditor, model: { roots, treeDefinition, currentRootName, showMarkers, showCompactText } } ) => {
	return { treeDefinition, currentEditor, currentRootName, roots, showMarkers, showCompactText };
};

const mapDispatchToProps = {
	toggleModelShowCompactText,
	setModelCurrentRootName,
	toggleModelShowMarkers,
	setModelCurrentNode,
	setModelActiveTab
};

export default connect( mapStateToProps, mapDispatchToProps )( ModelTree );
