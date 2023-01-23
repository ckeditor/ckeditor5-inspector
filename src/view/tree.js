/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
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

import { getEditorViewRoots } from './data/utils';

import Tree from '../components/tree/tree';
import Select from '../components/select';
import NavBox from '../components/navbox';
import Checkbox from '../components/checkbox';

class ViewTree extends Component {
	constructor( props ) {
		super( props );

		this.handleTreeClick = this.handleTreeClick.bind( this );
		this.handleRootChange = this.handleRootChange.bind( this );
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

	handleRootChange( evt ) {
		this.props.setViewCurrentRootName( evt.target.value );
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
						options={getEditorViewRoots( currentEditor ).map( root => root.rootName )}
						onChange={this.handleRootChange}
					/>
				</div>,
				<span className="ck-inspector-separator" key="separator"></span>,
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
				textDirection={currentEditor.locale.contentLanguageDirection}
				onClick={this.handleTreeClick}
				showCompactText="true"
				showElementTypes={this.props.showElementTypes}
				activeNode={this.props.currentNode}
			/>
		</NavBox>;
	}
}

const mapStateToProps = (
	{ editors, currentEditorName, view: { treeDefinition, currentRootName, currentNode, ui: { showElementTypes } } }
) => {
	return { treeDefinition, editors, currentEditorName, currentRootName, currentNode, showElementTypes };
};

const mapDispatchToProps = {
	setViewCurrentRootName,
	toggleViewShowElementTypes,
	setViewCurrentNode,
	setViewActiveTab
};

export default connect( mapStateToProps, mapDispatchToProps )( ViewTree );
