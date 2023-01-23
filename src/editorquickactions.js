/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';

import SetEditorDataButton from './components/seteditordatabutton';
import Button from './components/button';

import SourceIcon from './assets/img/source.svg';
import ConsoleIcon from './assets/img/console.svg';
import ReadOnlyIcon from './assets/img/read-only.svg';
import TrashIcon from './assets/img/trash.svg';
import CopyToClipboardIcon from './assets/img/copy-to-clipboard.svg';
import CheckmarkIcon from './assets/img/checkmark.svg';

import './editorquickactions.css';

const INSPECTOR_READ_ONLY_LOCK_ID = 'Lock from Inspector (@ckeditor/ckeditor5-inspector)';

class EditorQuickActions extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isShiftKeyPressed: false,
			wasEditorDataJustCopied: false
		};

		this._keyDownHandler = this._handleKeyDown.bind( this );
		this._keyUpHandler = this._handleKeyUp.bind( this );
		this._readOnlyHandler = this._handleReadOnly.bind( this );
		this._editorDataJustCopiedTimeout = null;
	}

	render() {
		return <div className='ck-inspector-editor-quick-actions'>
			<Button
				text="Log editor"
				icon={<ConsoleIcon />}
				isEnabled={!!this.props.editor}
				onClick={() => console.log( this.props.editor )}
			/>
			{ this._getLogButton() }
			<SetEditorDataButton editor={this.props.editor} />
			<Button
				text="Toggle read only"
				icon={<ReadOnlyIcon />}
				isOn={this.props.isReadOnly}
				isEnabled={!!this.props.editor}
				onClick={this._readOnlyHandler}
			/>
			<Button
				text="Destroy editor"
				icon={<TrashIcon />}
				isEnabled={!!this.props.editor}
				onClick={() => { this.props.editor.destroy(); }}
			/>
		</div>;
	}

	componentDidMount() {
		document.addEventListener( 'keydown', this._keyDownHandler );
		document.addEventListener( 'keyup', this._keyUpHandler );
	}

	componentWillUnmount() {
		// Stop reacting to Shift key press/release after the inspector was destroyed.
		document.removeEventListener( 'keydown', this._keyDownHandler );
		document.removeEventListener( 'keyup', this._keyUpHandler );

		// Don't update the button look after the inspector was destroyed.
		clearTimeout( this._editorDataJustCopiedTimeout );
	}

	_getLogButton() {
		let icon, text;

		if ( this.state.wasEditorDataJustCopied ) {
			icon = <CheckmarkIcon />;
			text = 'Data copied to clipboard.';
		} else {
			icon = this.state.isShiftKeyPressed ? <CopyToClipboardIcon /> : <SourceIcon />;
			text = 'Log editor data (press with Shift to copy)';
		}

		return <Button
			text={text}
			icon={icon}
			className={this.state.wasEditorDataJustCopied ? 'ck-inspector-button_data-copied' : ''}
			isEnabled={!!this.props.editor}
			onClick={this._handleLogEditorDataClick.bind( this )}
		/>;
	}

	_handleLogEditorDataClick( { shiftKey } ) {
		if ( shiftKey ) {
			copy( this.props.editor.getData() );

			this.setState( {
				wasEditorDataJustCopied: true
			} );

			clearTimeout( this._editorDataJustCopiedTimeout );

			this._editorDataJustCopiedTimeout = setTimeout( () => {
				this.setState( {
					wasEditorDataJustCopied: false
				} );
			}, 3000 );
		} else {
			console.log( this.props.editor.getData() );
		}
	}

	_handleKeyDown( { key } ) {
		this.setState( {
			isShiftKeyPressed: key === 'Shift'
		} );
	}

	_handleKeyUp() {
		this.setState( {
			isShiftKeyPressed: false
		} );
	}

	_handleReadOnly() {
		if ( this.props.editor.isReadOnly ) {
			this.props.editor.disableReadOnlyMode( INSPECTOR_READ_ONLY_LOCK_ID );
		} else {
			this.props.editor.enableReadOnlyMode( INSPECTOR_READ_ONLY_LOCK_ID );
		}
	}
}

const mapStateToProps = ( { editors, currentEditorName, currentEditorGlobals: { isReadOnly } } ) => {
	const editor = editors.get( currentEditorName );

	return { editor, isReadOnly };
};

export default connect( mapStateToProps, {} )( EditorQuickActions );
