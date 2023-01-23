/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { Component } from 'react';
import { renderTreeNodeFromDefinition } from './utils';
import isEqual from 'lodash.isequal';

/**
 * A base class for nodes in the tree.
 */
export default class TreeNode extends Component {
	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick( evt ) {
		this.globalTreeProps.onClick( evt, this.definition.node );
	}

	getChildren() {
		return this.definition.children.map( ( childDefinition, index ) => {
			return renderTreeNodeFromDefinition( childDefinition, index, this.props.globalTreeProps );
		} );
	}

	get definition() {
		return this.props.definition;
	}

	get globalTreeProps() {
		return this.props.globalTreeProps || {};
	}

	get isActive() {
		return this.definition.node === this.globalTreeProps.activeNode;
	}

	shouldComponentUpdate( nextProps ) {
		return !isEqual( this.props, nextProps );
	}
}
