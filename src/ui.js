/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React, { Component } from 'react';
import { Rnd } from 'react-rnd';
import { connect } from 'react-redux';
import {
	toggleIsCollapsed,
	setHeight,
	setEditors,
	setCurrentEditorName,
	setActiveTab
} from './data/actions';

import Tabs from './components/tabs';
import Select from './components/select';

import ModelPane from './model/pane';
import ViewPane from './view/pane';
import CommandsPane from './commands/pane';

import './ui.css';

const INSPECTOR_MIN_HEIGHT = '100';
const INSPECTOR_COLLAPSED_HEIGHT = 30;
const INSPECTOR_STYLES = {
	position: 'fixed',
	bottom: '0',
	left: '0',
	right: '0',
	top: 'auto'
};

class InspectorUI extends Component {
	constructor( props ) {
		super( props );

		updateBodyHeight( this.props.height );

		this.handleInspectorResize = this.handleInspectorResize.bind( this );
	}

	handleInspectorResize( evt, direction, ref ) {
		const height = ref.style.height;

		this.props.setHeight( height );
		updateBodyHeight( height );
	}

	render() {
		if ( this.props.isCollapsed ) {
			document.body.classList.remove( 'ck-inspector-body-expanded' );
			document.body.classList.add( 'ck-inspector-body-collapsed' );
		} else {
			document.body.classList.remove( 'ck-inspector-body-collapsed' );
			document.body.classList.add( 'ck-inspector-body-expanded' );
		}

		return <Rnd
			bounds='window'
			enableResizing={{ top: !this.props.isCollapsed }}
			disableDragging={true}
			minHeight={INSPECTOR_MIN_HEIGHT}
			maxHeight="100%"
			style={INSPECTOR_STYLES}
			className={[
				'ck-inspector',
				this.props.isCollapsed ? 'ck-inspector_collapsed' : ''
			].join( ' ' )}
			position={{ x: 0, y: '100%' }}
			size={{
				width: '100%',
				height: this.props.isCollapsed ? INSPECTOR_COLLAPSED_HEIGHT : this.props.height
			}}
			onResizeStop={this.handleInspectorResize}>
			<Tabs
				onTabChange={this.props.setActiveTab}
				contentBefore={<DocsButton key="docs" />}
				activeTab={this.props.activeTab}
				contentAfter={[
					<EditorInstanceSelector key="selector" />,
					<ToggleButton key="inspector-toggle" />
				]}
			>
				<ModelPane label="Model" />
				<ViewPane label="View" />
				<CommandsPane label="Commands" />
			</Tabs>
		</Rnd>;
	}

	componentWillUnmount() {
		document.body.classList.remove( 'ck-inspector-body-expanded' );
		document.body.classList.remove( 'ck-inspector-body-collapsed' );
	}
}

const mapStateToProps = ( { editors, currentEditorName, ui: { isCollapsed, height, activeTab } } ) => {
	return { isCollapsed, height, editors, currentEditorName, activeTab };
};

const mapDispatchToProps = { toggleIsCollapsed, setHeight, setEditors, setCurrentEditorName, setActiveTab };

export default connect( mapStateToProps, mapDispatchToProps )( InspectorUI );

export class DocsButton extends Component {
	render() {
		return <a className="ck-inspector-navbox__navigation__logo"
			title="Go to the documentation"
			href="https://ckeditor.com/docs/ckeditor5/latest/"
			target="_blank"
			rel="noopener noreferrer">CKEditor documentation</a>;
	}
}

class ToggleButtonVisual extends Component {
	render() {
		return <button
			type="button"
			onClick={this.props.toggleIsCollapsed}
			title="Toggle inspector"
			className={[
				'ck-inspector-navbox__navigation__toggle',
				this.props.isCollapsed ? ' ck-inspector-navbox__navigation__toggle_up' : ''
			].join( ' ' )}>
				Toggle inspector
		</button>;
	}
}

export const ToggleButton = connect( ( { ui: { isCollapsed } } ) => {
	return { isCollapsed };
}, { toggleIsCollapsed } )( ToggleButtonVisual );

export class EditorInstanceSelectorVisual extends Component {
	render() {
		return <div className="ck-inspector-editor-selector" key="editor-selector">
			{this.props.currentEditorName ? <Select
				id="inspector-editor-selector"
				label="Editor instance"
				value={this.props.currentEditorName}
				options={[ ...this.props.editors ].map( ( [ editorName ] ) => editorName ) }
				onChange={evt => this.props.setCurrentEditorName( evt.target.value )}
			/> : ''}
		</div>;
	}
}

export const EditorInstanceSelector = connect(
	( { currentEditorName, editors } ) => ( { currentEditorName, editors } ),
	{ setCurrentEditorName }
)( EditorInstanceSelectorVisual );

function updateBodyHeight( height ) {
	document.body.style.setProperty( '--ck-inspector-height', height );
}
