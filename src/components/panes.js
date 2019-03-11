/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Tabs from './tabs';
import './panes.css';

export default class Panes extends Component {
	constructor( props ) {
		super( props );

		this.handleTabClick = this.handleTabClick.bind( this );
	}

	handleTabClick( activePane ) {
		this.props.onPaneChange( activePane );
	}

	render() {
		const children = Array.isArray( this.props.children ) ? this.props.children : [ this.props.children ];

		return <div className="ck-inspector-panes">
			<div className="ck-inspector-panes__navigation">
				{this.props.contentBefore}
				<Tabs
					definitions={children.map( child => child.props.label )}
					activeTab={this.props.activePane}
					onClick={this.handleTabClick}
				>
				</Tabs>
				{this.props.contentAfter}
			</div>
			<div className="ck-inspector-panes__content">
				{children.filter( child => {
					return child.props.label === this.props.activePane;
				})}
			</div>
		</div>
	}
}
