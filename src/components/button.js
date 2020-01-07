/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import './button.css';
export default class Button extends Component {
	render() {
		return <button
			className={`ck-inspector-button ck-inspector-button_${ this.props.type }`}
			type="button"
			onClick={this.props.onClick}
			title={this.props.text}
		>
			{this.props.text}
		</button>;
	}
}
