/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React, { Component } from 'react';
import { Rnd } from 'react-rnd';

import StorageManager from '../storagemanager';
import ModelPane from './model/pane';
import ViewPane from './view/pane';
import CommandsPane from './commands/pane';
import Tabs from './tabs';
import Select from './select';
import './ui.css';

const LOCAL_STORAGE_ACTIVE_TAB = 'active-tab-name';
const LOCAL_STORAGE_IS_COLLAPSED = 'is-collapsed';
const LOCAL_STORAGE_INSPECTOR_HEIGHT = 'height';
const INSPECTOR_MIN_HEIGHT = '100';
const INSPECTOR_DEFAULT_HEIGHT = '400px';
const INSPECTOR_COLLAPSED_HEIGHT = 30;
const INSPECTOR_STYLES = {
	position: 'fixed',
	bottom: '0',
	left: '0',
	right: '0',
	top: 'auto'
};

export default class InspectorUI extends Component {
	constructor( props ) {
		super( props );

		const height = StorageManager.get( LOCAL_STORAGE_INSPECTOR_HEIGHT ) || INSPECTOR_DEFAULT_HEIGHT;

		// The collapsed state can be either configured by passing an option to `attach()`
		// or retrieved from the last "session".
		const isCollapsed = this.props.isCollapsed === true || StorageManager.get( LOCAL_STORAGE_IS_COLLAPSED ) === 'true';

		this.state = {
			isCollapsed,
			height,
			editors: null,
			currentEditorName: null,
			activeTab: StorageManager.get( LOCAL_STORAGE_ACTIVE_TAB ) || 'Model'
		};

		updateBodyHeight( height );

		this.handlePaneChange = this.handlePaneChange.bind( this );
		this.handleEditorChange = this.handleEditorChange.bind( this );
		this.handleToggleCollapseClick = this.handleToggleCollapseClick.bind( this );
		this.handleInspectorResize = this.handleInspectorResize.bind( this );
	}

	handlePaneChange( activeTab ) {
		this.setState( {
			activeTab
		}, () => {
			StorageManager.set( LOCAL_STORAGE_ACTIVE_TAB, activeTab );
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

	handleInspectorResize( evt, direction, ref ) {
		this.setState( {
			height: ref.style.height,
		}, () => {
			const height = ref.style.height;

			StorageManager.set( LOCAL_STORAGE_INSPECTOR_HEIGHT, height );
			updateBodyHeight( height );
		} );
	}

	render() {
		if ( this.state.isCollapsed ) {
			document.body.classList.remove( 'ck-inspector-body-expanded' );
			document.body.classList.add( 'ck-inspector-body-collapsed' );
		} else {
			document.body.classList.remove( 'ck-inspector-body-collapsed' );
			document.body.classList.add( 'ck-inspector-body-expanded' );
		}

		const currentEditorInstance = this.state.editors.get( this.state.currentEditorName );

		return <Rnd
			bounds='window'
			enableResizing={{ top: !this.state.isCollapsed }}
			disableDragging={true}
			minHeight={INSPECTOR_MIN_HEIGHT}
			maxHeight="100%"
			style={INSPECTOR_STYLES}
			className={[
				'ck-inspector',
				this.state.isCollapsed ? 'ck-inspector_collapsed' : '',
			].join( ' ' )}
			position={{ x: 0, y: '100%' }}
			size={{
				width: '100%',
				height: this.state.isCollapsed ? INSPECTOR_COLLAPSED_HEIGHT : this.state.height
			}}
			onResizeStop={this.handleInspectorResize}>
			<Tabs
				onTabChange={this.handlePaneChange}
				contentBefore={<DocsButton key="docs" />}
				activeTab={this.state.activeTab}
				contentAfter={[
					<EditorInstanceSelector
						key="selector"
						currentEditorName={this.state.currentEditorName}
						editors={this.state.editors}
						onChange={evt => this.handleEditorChange( evt.target.value )}
					/>,
					<ToggleButton key="inspector-toggle" onClick={this.handleToggleCollapseClick} isUp={this.state.isCollapsed} />
				]}
			>
				<ModelPane label="Model" editor={currentEditorInstance} />
				<ViewPane label="View" editor={currentEditorInstance} />
				<CommandsPane label="Commands" editor={currentEditorInstance} />
			</Tabs>
		</Rnd>;
	}

	componentWillUnmount() {
		document.body.classList.remove( 'ck-inspector-body-expanded' );
		document.body.classList.remove( 'ck-inspector-body-collapsed' );
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

export class DocsButton extends Component {
	render() {
		return <a className="ck-inspector-navbox__navigation__logo"
			title="Go to the documentation"
			href="https://ckeditor.com/docs/ckeditor5/latest/"
			target="_blank"
			rel="noopener noreferrer">CKEditor documentation</a>;
	}
}

export class ToggleButton extends Component {
	render() {
		return <button
			type="button"
			onClick={this.props.onClick}
			title="Toggle inspector"
			className={[
				'ck-inspector-navbox__navigation__toggle',
				this.props.isUp ? ' ck-inspector-navbox__navigation__toggle_up' : ''
			].join( ' ' )}>
				Toggle inspector
		</button>;
	}
}

export class EditorInstanceSelector extends Component {
	render() {
		return <div className="ck-inspector-editor-selector" key="editor-selector">
			{this.props.currentEditorName ? <Select
				id="inspector-editor-selector"
				label="Editor instance"
				value={this.props.currentEditorName}
				options={[ ...this.props.editors ].map( ( [ editorName ] ) => editorName ) }
				onChange={this.props.onChange}
			/> : ''}
		</div>;
	}
}

function updateBodyHeight( height ) {
	document.body.style.setProperty( '--ck-inspector-height', height );
}
