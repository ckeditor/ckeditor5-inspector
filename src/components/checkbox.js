/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { PureComponent } from 'react';

export default class Checkbox extends PureComponent {
	render() {
		return [
			<label htmlFor={this.props.id} key="label">{this.props.label}:</label>,
			<input type="checkbox" id={this.props.id}
				key="input"
				checked={this.props.isChecked}
				onChange={this.props.onChange} />
		];
	}
}

