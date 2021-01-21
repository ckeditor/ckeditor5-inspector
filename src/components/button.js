/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { PureComponent } from 'react';
import './button.css';

export default class Button extends PureComponent {
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
