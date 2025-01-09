/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React, { Component } from 'react';

/**
 * A class which instances represent comments in the tree.
 */
export default class TreeComment extends Component {
	render() {
		return <span
			className="ck-inspector-tree-comment"
			dangerouslySetInnerHTML={{ __html: this.props.definition.text }}></span>;
	}
}
