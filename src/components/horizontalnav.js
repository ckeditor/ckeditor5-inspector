/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import './horizontalnav.css';

export default class HorizontalNav extends Component {
	constructor( props ) {
		super( props );

		this.handleTabClick = this.handleTabClick.bind( this );
	}

	handleTabClick( activeTab ) {
		this.setState( { activeTab }, () => {
			this.props.onClick( activeTab );
		} );
	}

	render() {
		return <div className="ck-inspector-horizontal-nav">
			{this.props.definitions.map( label => {
				return <NavItem
					key={label}
					label={label}
					isActive={this.props.activeTab === label}
					onClick={() => this.handleTabClick( label )}
				/>;
			} )}
		</div>;
	}
}

export class NavItem extends Component {
	render() {
		return <button
			className={[
				'ck-inspector-horizontal-nav__item',
				( this.props.isActive ? ' ck-inspector-horizontal-nav__item_active' : '' )
			].join( ' ' )}
			key={this.props.label}
			onClick={this.props.onClick}
			type="button"
		>
			{this.props.label}
		</button>;
	}
}
