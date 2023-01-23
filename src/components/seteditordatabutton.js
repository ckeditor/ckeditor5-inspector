/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React, { Component } from 'react';
import Modal from 'react-modal';

import Button from './button';
import LoadDataIcon from '../assets/img/load-data.svg';

import './seteditordatabutton.css';

export default class SetEditorDataButton extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isModalOpen: false,
			editorDataValue: ''
		};

		this.textarea = React.createRef();
	}

	render() {
		return [
			<Button
				text="Set editor data"
				icon={<LoadDataIcon />}
				isEnabled={!!this.props.editor}
				onClick={() => this.setState( {
					isModalOpen: true
				} )}
				key="button"
			/>,
			<Modal
				isOpen={this.state.isModalOpen}
				appElement={document.querySelector( '.ck-inspector-wrapper' )}
				onAfterOpen={
					this._handleModalAfterOpen.bind( this )
				}
				overlayClassName='ck-inspector-modal ck-inspector-quick-actions__set-data-modal'
				className='ck-inspector-quick-actions__set-data-modal__content'
				onRequestClose={
					this._closeModal.bind( this )
				}
				portalClassName='ck-inspector-portal'
				shouldCloseOnEsc={true}
				shouldCloseOnOverlayClick={true}
				key="modal"
			>
				<h2>Set editor data</h2>
				<textarea
					autoFocus
					ref={ this.textarea }
					value={ this.state.editorDataValue }
					placeholder="Paste HTML here..."
					onChange={
						this._handlDataChange.bind( this )
					}
					onKeyPress={ event => {
						if ( event.key == 'Enter' && event.shiftKey ) {
							this._setEditorDataAndCloseModal();
						}
					}}
				>
				</textarea>
				<div className="ck-inspector-quick-actions__set-data-modal__buttons">
					<button
						type="button"
						onClick={() => {
							this.setState( {
								editorDataValue: this.props.editor.getData()
							} );

							this.textarea.current.focus();
						}}
					>
						Load data
					</button>
					<button
						type="button"
						title="Cancel (Esc)"
						onClick={
							this._closeModal.bind( this )
						}
					>
						Cancel
					</button>
					<button
						type="button"
						title="Set editor data (⇧+Enter)"
						onClick={
							this._setEditorDataAndCloseModal.bind( this )
						}
					>
						Set data
					</button>
				</div>
			</Modal>
		];
	}

	_setEditorDataAndCloseModal() {
		this.props.editor.setData( this.state.editorDataValue );

		this._closeModal();
	}

	_closeModal() {
		this.setState( {
			isModalOpen: false
		} );
	}

	_handlDataChange( evt ) {
		this.setState( {
			editorDataValue: evt.target.value
		} );
	}

	_handleModalAfterOpen() {
		this.setState( {
			editorDataValue: this.props.editor.getData()
		} );

		this.textarea.current.select();
	}
}
