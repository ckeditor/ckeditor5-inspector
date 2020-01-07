/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';

export default class Select extends Component {
	render() {
		return [
			<label htmlFor={this.props.id} key="label">{this.props.label}:</label>,
			<select
				id={this.props.id}
				value={this.props.value}
				onChange={this.props.onChange}
				key="select"
			>
				{this.props.options.map( option => {
					return <option value={option} key={option}>{option}</option>;
				} )}
			</select>
		];
	}
}
