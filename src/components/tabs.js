/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import './tabs.css';

export default class Tabs extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			activeTabName: this.props.activeTabName
		};

		this.handleTabClick = this.handleTabClick.bind( this );
	}

	handleTabClick( activeTabName ) {
		this.setState( { activeTabName }, () => {
			this.props.onClick( activeTabName );
		} );
	}

	setActiveTab( name ) {
		this.setState( { activeTabName: name } );
	}

	render() {
		const buttons = [];

		for ( const name in this.props.definitions ) {
			const { label } = this.props.definitions[ name ];

			buttons.push(
				<button
					className={'ck-inspector-tabs__tab' + ( this.state.activeTabName == name ? ' ck-inspector-tabs__tab_active' : '' ) }
					key={name}
					onClick={() => this.handleTabClick( name )}
					type="button">{label}
				</button>
			);
		}
		return <div className="ck-inspector-tabs">{buttons}</div>
	}
}
