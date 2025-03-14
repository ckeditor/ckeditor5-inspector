/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React, { PureComponent } from 'react';
import './checkbox.css';

export default class Checkbox extends PureComponent {
	render() {
		return [
			<input type="checkbox"
				className="ck-inspector-checkbox"
				id={this.props.id}
				key="input"
				checked={this.props.isChecked}
				onChange={this.props.onChange} />,
			<label htmlFor={this.props.id} key="label">{this.props.label}</label>
		];
	}
}

