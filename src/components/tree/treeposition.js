/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import isEqual from 'lodash.isequal';

/**
 * A class which instances represent positions (selection, markers) in the tree.
 */
export default class TreePosition extends Component {
	render() {
		const definition = this.props.definition;
		const attrs = {
			className: [
				'ck-inspector-tree__position',
				definition.type === 'selection' ? 'ck-inspector-tree__position_selection' : '',
				definition.type === 'marker' ? 'ck-inspector-tree__position_marker' : '',
				definition.isEnd ? 'ck-inspector-tree__position_end' : ''
			].join( ' ' ),
			style: {}
		};

		if ( definition.presentation && definition.presentation.color ) {
			attrs.style[ '--ck-inspector-color-tree-position' ] = definition.presentation.color;
		}

		if ( definition.type === 'marker' ) {
			attrs[ 'data-marker-name' ] = definition.name;
		}

		return <span {...attrs}>&#8203;</span>;
	}

	shouldComponentUpdate( nextProps ) {
		return !isEqual( this.props, nextProps );
	}
}
