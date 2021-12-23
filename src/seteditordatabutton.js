/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React, { Component } from 'react';
import Modal from 'react-modal';

import Button from './components/button';
import LoadDataIcon from './assets/img/load-data.svg';

import './seteditordatabutton.css';

export default class SetEditorDataButton extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isSetDataModalOpen: false,
			setDataModalValue: ''
		};

		this.textarea = React.createRef();
	}

	render() {
		return [
			<Button
				text="Set editor data"
				icon={<LoadDataIcon />}
				isEnabled={!!this.props.editor}
				onClick={() => this.setState( { isSetDataModalOpen: true } )}
				key="button"
			/>,
			<Modal
				isOpen={this.state.isSetDataModalOpen}
				appElement={document.querySelector( '.ck-inspector-wrapper' )}
				onAfterOpen={() => this.setState( { setDataModalValue: '' } )}
				overlayClassName='ck-inspector-modal ck-inspector-quick-actions__set-data-modal'
				className='ck-inspector-quick-actions__set-data-modal__content'
				onRequestClose={this._closeModal.bind( this )}
				portalClassName="ck-inspector-portal"
				shouldCloseOnEsc={true}
				shouldCloseOnOverlayClick={true}
				key="modal"
			>
				<h2>Set editor data</h2>
				<textarea
					autoFocus
					ref={this.textarea}
					value={ this.state.setDataModalValue }
					placeholder="Paste HTML here..."
					onChange={ this._handleSetDataModalValueChange.bind( this ) }
					onKeyPress={ event => {
						if ( event.key == 'Enter' && event.shiftKey ) {
							this._setEditorData();
						}
					}}
				>
				</textarea>
				<div className="ck-inspector-quick-actions__set-data-modal__buttons">
					<button
						type="button"
						onClick={() => {
							this.setState( {
								setDataModalValue: this.props.editor.getData()
							} );

							this.textarea.current.focus();
						}}>
						Load current editor data
					</button>
					<button
						type="button"
						title="Cancel (Esc)"
						onClick={() => this._closeModal()}>
						Cancel
					</button>
					<button
						type="button"
						title="Set editor data (⇧+Enter)"
						onClick={() => this._setEditorData()}>
						Set data
					</button>
				</div>
			</Modal>
		];
	}

	_setEditorData() {
		this.props.editor.setData( this.state.setDataModalValue );

		this._closeModal();
	}

	_closeModal() {
		this.setState( {
			isSetDataModalOpen: false
		} );
	}

	_handleSetDataModalValueChange( evt ) {
		this.setState( {
			setDataModalValue: evt.target.value
		} );
	}
}
