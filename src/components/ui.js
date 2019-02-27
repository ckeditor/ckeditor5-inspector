/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React, { Component } from 'react';

import StorageManager from '../storage';
import ModelPane from './model/pane';
import ViewPane from './view/pane';
import CommandsPane from './commands/pane';
import Panes from './panes';
import Select from './select';
import './ui.css';

const LOCAL_STORAGE_ACTIVE_PANE = 'ck5-inspector-active-pane-name';
const LOCAL_STORAGE_IS_COLLAPSED = 'ck5-inspector-is-collapsed';

export default class InspectorUI extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isCollapsed: StorageManager.get( LOCAL_STORAGE_IS_COLLAPSED ) === 'true',
			editors: null,
			currentEditorName: null
		};

		this.panesRef = React.createRef();
		this.handlePaneChange = this.handlePaneChange.bind( this );
		this.handleEditorChange = this.handleEditorChange.bind( this );
		this.handleToggleCollapseClick = this.handleToggleCollapseClick.bind( this );
	}

	componentDidMount() {
		const activePaneName = StorageManager.get( LOCAL_STORAGE_ACTIVE_PANE );

		if ( activePaneName ) {
			this.panesRef.current.setActivePane( activePaneName );
		}
	}

	handlePaneChange( activePaneName ) {
		StorageManager.set( LOCAL_STORAGE_ACTIVE_PANE, activePaneName );
	}

	handleEditorChange( name ) {
		this.setState( {
			currentEditorName: name
		} );
	}

	handleToggleCollapseClick() {
		this.setState( {
			isCollapsed: !this.state.isCollapsed
		}, () => {
			StorageManager.set( LOCAL_STORAGE_IS_COLLAPSED, this.state.isCollapsed );
		} );
	}

	render() {
		if ( this.state.isCollapsed ) {
			document.body.classList.remove( 'ck-inspector-body-expanded' );
		} else {
			document.body.classList.add( 'ck-inspector-body-expanded' );
		}

		const currentEditorInstance = this.state.editors.get( this.state.currentEditorName );
		const panesDefinitions = {
			model: {
				label: 'Model',
				content: <ModelPane editor={currentEditorInstance} />
			},
			view: {
				label: 'View',
				content: <ViewPane editor={currentEditorInstance} />
			},
			commands: {
				label: 'Commands',
				content: <CommandsPane editor={currentEditorInstance} />
			}
		};

		const editorInstanceSelector = <Select
			id="inspector-editor-selector"
			label="Editor instance"
			value={this.state.currentEditorName}
			options={[ ...this.state.editors ].map( ( [ editorName ] ) => editorName ) }
			onChange={( evt ) => this.handleEditorChange( evt.target.value )}
		/>;

		return <div className={`ck-inspector ${this.state.isCollapsed ? 'ck-inspector_collapsed' : ''}`}>
			<Panes
				ref={this.panesRef}
				onPaneChange={this.handlePaneChange}
				panesDefinitions={panesDefinitions}
				initialActivePaneName="model"
				contentBefore={<DocsButton />}
				contentAfter={[
					<div className="ck-inspector-editor-selector" key="editor-selector">
						{currentEditorInstance ? editorInstanceSelector	: '' }
					</div>,
					<ToggleButton key="inspector-toggle" onClick={this.handleToggleCollapseClick} isUp={this.state.isCollapsed} />
				]}
			/>
		</div>;
	}

	static getDerivedStateFromProps( props, state ) {
		if ( !props.editors.has( state.currentEditorName ) ) {
			return {
				editors: props.editors,
				currentEditorName: props.editors.size ? [ ...props.editors ][ 0 ][ 0 ] : ''
			};
		} else {
			return null;
		}
	}
}

class DocsButton extends Component {
	render() {
		return <a className="ck-inspector-panes__navigation__logo"
			title="Go to the documentation"
			href="https://ckeditor.com/docs/ckeditor5/latest/"
			target="_blank"
			rel="noopener noreferrer">CKEditor documentation</a>;
	}
}

class ToggleButton extends Component {
	render() {
		return <button
			type="button"
			onClick={this.props.onClick}
			title="Toggle inspector"
			className={`ck-inspector-panes__navigation__toggle ${ this.props.isUp ? ' ck-inspector-panes__navigation__toggle_up' : '' }`}>
				Toggle inspector
		</button>;
	}
}
