/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { renderTreeNodeFromDefinition } from './utils';
import './tree.css';

/**
 * A class representing a tree of nodes.
 */
export default class Tree extends Component {
	render() {
		let treeContent;

		if ( this.props.definition ) {
			treeContent = this.props.definition.map( ( definition, index ) => {
				return renderTreeNodeFromDefinition( definition, index, {
					onClick: this.props.onClick,
					showCompactText: this.props.showCompactText,
					showElementTypes: this.props.showElementTypes,
					activeNode: this.props.activeNode
				} );
			} );
		} else {
			treeContent = 'Nothing to show.';
		}

		return <div className={[
			'ck-inspector-tree',
			...( this.props.className || [] ),
			this.props.textDirection ? 'ck-inspector-tree_text-direction_' + this.props.textDirection : '',
			this.props.showCompactText ? 'ck-inspector-tree_compact-text' : ''
		].join( ' ' )}>
			{treeContent}
		</div>;
	}
}
