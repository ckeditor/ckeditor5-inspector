/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { PureComponent } from 'react';

import './button.css';

export default class Button extends PureComponent {
	render() {
		const classes = [
			'ck-inspector-button',
			this.props.className || '',
			this.props.isOn ? 'ck-inspector-button_on' : '',
			this.props.isEnabled === false ? 'ck-inspector-button_disabled' : ''
		].filter( className => className ).join( ' ' );

		return <button
			className={classes}
			type="button"
			onClick={this.props.isEnabled === false ? () => {} : this.props.onClick}
			title={this.props.title || this.props.text}
		>
			<span>{this.props.text}</span>
			{this.props.icon}
		</button>;
	}
}
