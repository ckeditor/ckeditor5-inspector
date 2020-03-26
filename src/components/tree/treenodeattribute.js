/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { truncateString } from '../utils';

const MAX_ATTRIBUTE_VALUE_LENGTH = 500;

/**
 * A class which instances represent attributes in the tree.
 */
export default class TreeNodeAttribute extends Component {
	render() {
		let valueElement;
		const value = truncateString( this.props.value, MAX_ATTRIBUTE_VALUE_LENGTH );

		if ( !this.props.dontRenderValue ) {
			valueElement = <span className="ck-inspector-tree-node__attribute__value">
				{value}
			</span>;
		}

		return <span className="ck-inspector-tree-node__attribute">
			<span className="ck-inspector-tree-node__attribute__name" title={value}>
				{this.props.name}
			</span>
			{valueElement}
		</span>;
	}
}
