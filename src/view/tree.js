/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	setViewCurrentRootName,
	toggleViewShowElementTypes,
	setViewCurrentNode,
	setViewActiveTab
} from './data/actions';

import Tree from '../components/tree/tree';
import Select from '../components/select';
import NavBox from '../components/navbox';
import Checkbox from '../components/checkbox';

class ViewTree extends Component {
	constructor( props ) {
		super( props );

		this.handleTreeClick = this.handleTreeClick.bind( this );
	}

	handleTreeClick( evt, currentNode ) {
		evt.persist();
		evt.stopPropagation();

		this.props.setViewCurrentNode( currentNode );

		// Double click on a tree element should open the inspector.
		if ( evt.detail === 2 ) {
			this.props.setViewActiveTab( 'Inspect' );
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
						onChange={evt => this.props.setViewCurrentRootName( evt.target.value )}
					/>
				</div>,
				<div className="ck-inspector-tree__config" key="types-cfg">
					<Checkbox
						label="Show element types"
						id="view-show-types"
						isChecked={this.props.showElementTypes}
						onChange={this.props.toggleViewShowElementTypes}
					/>
				</div>
			]}
			<Tree
				definition={this.props.treeDefinition}
				textDirection={this.props.currentEditor.locale.contentLanguageDirection}
				onClick={this.handleTreeClick}
				showCompactText="true"
				showElementTypes={this.props.showElementTypes}
				activeNode={this.props.currentEditorNode}
			/>
		</NavBox>;
	}
}

const mapStateToProps = ( { currentEditor, view: { roots, treeDefinition, currentRootName, currentNode, ui: { showElementTypes } } } ) => {
	return { treeDefinition, currentEditor, currentRootName, roots, currentNode, showElementTypes };
};

const mapDispatchToProps = {
	setViewCurrentRootName,
	toggleViewShowElementTypes,
	setViewCurrentNode,
	setViewActiveTab
};

export default connect( mapStateToProps, mapDispatchToProps )( ViewTree );