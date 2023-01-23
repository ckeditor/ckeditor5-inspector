/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import isEqual from 'lodash.isequal';

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

	shouldComponentUpdate( nextProps ) {
		return !isEqual( this.props, nextProps );
	}
}
