/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Panes from '../panes';
import ViewNodeInspector from './nodeinspector';
import ViewSelectionInspector from './selectioninspector';
import StorageManager from '../../storage';
import '../inspector.css';

const LOCAL_STORAGE_ACTIVE_PANE = 'ck5-inspector-active-view-pane-name';
export default class ViewInspector extends Component {
	constructor( props ) {
		super( props );

		this.nodeInspectorRef = React.createRef();
		this.selectionInspectorRef = React.createRef();
		this.panesRef = React.createRef();

		this.handlePaneChange = this.handlePaneChange.bind( this );
	}

	update() {
		if ( this.nodeInspectorRef.current ) {
			this.nodeInspectorRef.current.update();
		}

		if ( this.selectionInspectorRef.current ) {
			this.selectionInspectorRef.current.update();
		}
	}

	componentDidMount() {
		const activePaneName = StorageManager.get( LOCAL_STORAGE_ACTIVE_PANE );

		if ( activePaneName ) {
			this.setActivePane( activePaneName );
		}
	}

	setActivePane( name ) {
		this.panesRef.current.setActivePane( name, () => {
			this.update();
		} );
	}

	handlePaneChange( activePaneName ) {
		StorageManager.set( LOCAL_STORAGE_ACTIVE_PANE, activePaneName );
	}

	render() {
		const panesDefinitions = {
			inspect: {
				label: 'Inspect',
				content: <ViewNodeInspector
					editor={this.props.editor}
					currentRootName={this.props.currentRootName}
					inspectedNode={this.props.inspectedNode}
					ref={this.nodeInspectorRef}
				/>
			},
			selection: {
				label: 'Selection',
				content: <ViewSelectionInspector
					editor={this.props.editor}
					ref={this.selectionInspectorRef}
				/>
			}
		};

		return <div className="ck-inspector__explorer">
			<Panes
				panesDefinitions={panesDefinitions}
				ref={this.panesRef}
				onPaneChange={this.handlePaneChange}
			/>
		</div>;
	}
}
