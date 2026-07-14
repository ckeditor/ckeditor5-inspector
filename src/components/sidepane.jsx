/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React, { Component } from 'react';
import { Rnd } from 'react-rnd';
import { connect } from 'react-redux';
import {
	setSidePaneWidth
} from '../data/actions';
import { HostContext } from '../hostcontext';

import './sidepane.css';

const SIDE_PANE_MIN_WIDTH = 200;
const SIDE_PANE_STYLES = {
	position: 'relative'
};

class SidePane extends Component {
	static contextType = HostContext;

	get maxSidePaneWidth() {
		const hostWindow = this.context.window;
		return Math.min( hostWindow.innerWidth - 400, hostWindow.innerWidth * .8 );
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
					width: this.props.sidePaneWidth,
					height: '100%'
				}}
				onResizeStop={( evt, direction, ref ) => this.props.setSidePaneWidth( ref.style.width )}
			>
				{this.props.children}
			</Rnd>
		</div>;
	}
}

const mapStateToProps = ( { ui: { sidePaneWidth } } ) => {
	return { sidePaneWidth };
};

const mapDispatchToProps = {
	setSidePaneWidth
};

export default connect( mapStateToProps, mapDispatchToProps )( SidePane );
