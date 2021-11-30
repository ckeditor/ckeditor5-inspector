/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from './components/button';

import SourceIcon from './assets/img/source.svg';
import ConsoleIcon from './assets/img/console.svg';
import ReadOnlyIcon from './assets/img/read-only.svg';
import TrashIcon from './assets/img/trash.svg';

import './editorquickactions.css';

class EditorQuickActions extends Component {
	render() {
		return <div className="ck-inspector-editor-quick-actions">
			<Button
				text="Log editor"
				icon={<ConsoleIcon />}
				isEnabled={!!this.props.editor}
				onClick={() => console.log( this.props.editor )}
			/>
			<Button
				text="Log editor data"
				icon={<SourceIcon />}
				isEnabled={!!this.props.editor}
				onClick={() => console.log( this.props.editor.getData() )}
			/>
			<Button
				text="Toggle read only"
				icon={<ReadOnlyIcon />}
				isOn={this.props.isReadOnly}
				isEnabled={!!this.props.editor}
				onClick={() => { this.props.editor.isReadOnly = !this.props.editor.isReadOnly; }}
			/>
			<Button
				text="Destroy editor"
				icon={<TrashIcon />}
				isEnabled={!!this.props.editor}
				onClick={() => { this.props.editor.destroy(); }}
			/>
		</div>;
	}
}

const mapStateToProps = ( { editors, currentEditorName, currentEditorGlobals: { isReadOnly } } ) => {
	const editor = editors.get( currentEditorName );

	return { editor, isReadOnly };
};

export default connect( mapStateToProps, {} )( EditorQuickActions );
