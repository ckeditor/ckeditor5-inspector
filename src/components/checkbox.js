/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import './checkbox.css';

export default class Checkbox extends Component {
	render() {
		return [
			<label htmlFor={this.props.id} key="label">{this.props.label}:</label>,
			<input type="checkbox"
				className="ck-inspector-checkbox"
				id={this.props.id}
				key="input"
				checked={this.props.isChecked}
				onChange={this.props.onChange} />
		];
	}
}

