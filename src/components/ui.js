/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React, { Component } from 'react';

import StorageManager from '../storagemanager';
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
			currentEditorName: null,
			activePane: StorageManager.get( LOCAL_STORAGE_ACTIVE_PANE ) || 'Model'
		};

		this.panesRef = React.createRef();
		this.handlePaneChange = this.handlePaneChange.bind( this );
		this.handleEditorChange = this.handleEditorChange.bind( this );
		this.handleToggleCollapseClick = this.handleToggleCollapseClick.bind( this );
	}

	handlePaneChange( activePane ) {
		this.setState( {
			activePane
		}, () => {
			StorageManager.set( LOCAL_STORAGE_ACTIVE_PANE, activePane );
		} );
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
				contentBefore={<DocsButton />}
				activePane={this.state.activePane}
				contentAfter={[
					<div className="ck-inspector-editor-selector" key="editor-selector">
						{currentEditorInstance ? editorInstanceSelector	: '' }
					</div>,
					<ToggleButton key="inspector-toggle" onClick={this.handleToggleCollapseClick} isUp={this.state.isCollapsed} />
				]}
			>
				<ModelPane label="Model" editor={currentEditorInstance} />
				<ViewPane label="View" editor={currentEditorInstance} />
				<CommandsPane label="Commands" editor={currentEditorInstance} />
			</Panes>
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
