/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global window */

import React, { Component } from 'react';
import { Rnd } from 'react-rnd';
import StorageManager from '../storagemanager';
import './sidepane.css';

const LOCAL_STORAGE_SIDE_PANE_WIDTH = 'side-pane-width';
const SIDE_PANE_MIN_WIDTH = 200;
const SIDE_PANE_DEFAULT_WIDTH = '500px';
const SIDE_PANE_STYLES = {
	position: 'relative'
};

export default class SidePane extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			width: StorageManager.get( LOCAL_STORAGE_SIDE_PANE_WIDTH ) || SIDE_PANE_DEFAULT_WIDTH
		};

		this.handleSidePaneResize = this.handleSidePaneResize.bind( this );
	}

	get maxSidePaneWidth() {
		return Math.min( window.innerWidth - 400, window.innerWidth * .8 );
	}

	handleSidePaneResize( evt, direction, ref ) {
		this.setState( {
			width: ref.style.width,
		}, () => {
			StorageManager.set( LOCAL_STORAGE_SIDE_PANE_WIDTH, ref.style.width );
		} );
	}

	render() {
		return <div className="ck-inspector-side-pane">
			<Rnd
				enableResizing={{ left: true }}
				disableDragging={true}
				minWidth={SIDE_PANE_MIN_WIDTH}
				maxWidth={this.maxSidePaneWidth}
				style={SIDE_PANE_STYLES}
				position={{ x: '100%', y: '100%' }}
				size={{
					width: this.state.width,
					height: '100%'
				}}
				onResizeStop={this.handleSidePaneResize}
			>
				{this.props.children}
			</Rnd>
		</div>;
	}
}
