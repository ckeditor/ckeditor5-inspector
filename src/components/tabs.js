/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React, { Component } from 'react';
import HorizontalNav from './horizontalnav';
import NavBox from './navbox';

export default class Tabs extends Component {
	constructor( props ) {
		super( props );

		this.handleTabClick = this.handleTabClick.bind( this );
	}

	handleTabClick( activeTab ) {
		this.props.onTabChange( activeTab );
	}

	render() {
		const children = Array.isArray( this.props.children ) ? this.props.children : [ this.props.children ];

		return <NavBox>
			{[
				this.props.contentBefore,
				<HorizontalNav
					key="navigation"
					definitions={children.map( child => child.props.label )}
					activeTab={this.props.activeTab}
					onClick={this.handleTabClick}
				/>,
				this.props.contentAfter
			]}
			{children.filter( child => {
				return child.props.label === this.props.activeTab;
			} )}
		</NavBox>;
	}
}
