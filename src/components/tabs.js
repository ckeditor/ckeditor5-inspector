/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import './tabs.css';

export default class Tabs extends Component {
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
		return <div className="ck-inspector-tabs">
			{this.props.definitions.map( label => {
				return <Tab
					key={label}
					label={label}
					isActive={this.props.activeTab === label}
					onClick={() => this.handleTabClick( label )}
				/>;
			})}
		</div>
	}
}

export class Tab extends Component {
	render() {
		return <button
			className={[
				'ck-inspector-tabs__tab',
				( this.props.isActive ? ' ck-inspector-tabs__tab_active' : '' )
			].join( ' ' )}
			key={this.props.label}
			onClick={this.props.onClick}
			type="button"
		>
			{this.props.label}
		</button>;
	}
}
