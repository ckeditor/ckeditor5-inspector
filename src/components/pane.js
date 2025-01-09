/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React, { Component } from 'react';
import './pane.css';

export default class Pane extends Component {
	render() {
		return <div className={[
			'ck-inspector-pane',
			this.props.splitVertically ? 'ck-inspector-pane_vsplit' : '',
			this.props.isEmpty ? 'ck-inspector-pane_empty' : ''
		].join( ' ' )}>
			{this.props.children}
		</div>;
	}
}
