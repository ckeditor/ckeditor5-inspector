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

		this.state = {
			activePaneName: Object.keys( this.props.panesDefinitions )[ 0 ]
		};

		this.handleTabClick = this.handleTabClick.bind( this );
		this.tabsRef = React.createRef();
	}

	setActivePane( activePaneName, callback ) {
		this.setState( { activePaneName }, () => {
			this.tabsRef.current.setActiveTab( activePaneName );

			if ( callback ){
				callback();
			}
		} );
	}

	handleTabClick( activePaneName ) {
		this.setState( { activePaneName }, () => {
			this.props.onPaneChange( activePaneName );
		} );
	}

	render() {
		return <div className="ck-inspector-panes">
			<div className="ck-inspector-panes__navigation">
				{this.props.contentBefore}
				<Tabs
					ref={this.tabsRef}
					definitions={this.props.panesDefinitions}
					activeTabName={this.state.activePaneName}
					onClick={this.handleTabClick}
					/>
				{this.props.contentAfter}
			</div>
			<div className="ck-inspector-panes__content">
				{this.props.panesDefinitions[ this.state.activePaneName ].content}
			</div>
		</div>
	}
}

