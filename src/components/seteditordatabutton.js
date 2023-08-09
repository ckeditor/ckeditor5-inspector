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
import Select from './select';
import { getEditorRoots } from '../utils';

export default class SetEditorDataButton extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			...this._initEditorModalState(),
			isModalOpen: false
		};

		this.textarea = React.createRef();
		this.handleRootChange = this.handleRootChange.bind( this );
	}

	handleRootChange( evt ) {
		const newEditorRootValues = Object.assign( {}, this.state.editorRootValues );
		const oldRootName = this.state.currentRootName;
		const newRootName = evt.target.value;

		newEditorRootValues[ oldRootName ].currentValue = this.state.textareaValue;

		if ( !newEditorRootValues[ newRootName ].initialValue ) {
			newEditorRootValues[ newRootName ].initialValue = this.props.editor.getData( { rootName: newRootName } );
		}

		this.setState( {
			currentRootName: newRootName,
			textareaValue:
				newEditorRootValues[ newRootName ].currentValue === null ?
					newEditorRootValues[ newRootName ].initialValue : newEditorRootValues[ newRootName ].currentValue,
			editorRootValues: newEditorRootValues
		} );

		console.log( this.state.editorRootValues );
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
				<div className="root-selector">
					<Select
						id="view-root-select"
						label="Root"
						value={ this.state.currentRootName }
						options={ this.state.rootNames }
						onChange={ this.handleRootChange }
					/>
				</div>
				<textarea
					autoFocus
					ref={ this.textarea }
					value={ this.state.textareaValue }
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
						onClick={
							this._onDataLoad.bind( this )
						}
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

	_initEditorModalState() {
		const rootNames = getEditorRoots( this.props.editor )
			.map( root => root.rootName )
			.filter( rootName => rootName !== '$graveyard' );
		const editorRootValues = rootNames.reduce( ( acc, rootName ) => {
			acc[ rootName ] = {
				initialValue: null,
				currentValue: null
			};

			return acc;
		}, {} );

		editorRootValues[ rootNames[ 0 ] ].initialValue = this.props.editor.getData( { rootName: rootNames[ 0 ] } );

		return {
			rootNames,
			textareaValue: editorRootValues[ rootNames[ 0 ] ].initialValue,
			editorRootValues,
			currentRootName: rootNames[ 0 ]
		};
	}

	_setEditorDataAndCloseModal() {
		const newEditorRootValues = Object.assign( {}, this.state.editorRootValues );
		newEditorRootValues[ this.state.currentRootName ].currentValue = this.state.textareaValue;

		this.setState( {
			editorRootValues: newEditorRootValues
		} );

		const changedRootsData = {};

		for ( const rootName in newEditorRootValues ) {
			const currentValue = newEditorRootValues[ rootName ].currentValue;
			const initialValue = newEditorRootValues[ rootName ].initialValue;

			if ( currentValue !== null && currentValue !== initialValue ) {
				changedRootsData[ rootName ] = currentValue;
			}
		}

		this.props.editor.setData( changedRootsData );

		this._closeModal();
	}

	_closeModal() {
		this.setState( {
			isModalOpen: false
		} );
	}

	_handlDataChange( evt ) {
		this.setState( {
			textareaValue: evt.target.value
		} );
	}

	_onDataLoad() {
		const newEditorRootValues = Object.assign( {}, this.state.editorRootValues );
		newEditorRootValues[ this.state.currentRootName ].currentValue = null;

		this.setState( {
			textareaValue: this.state.editorRootValues[ this.state.currentRootName ].initialValue,
			editorRootValues: newEditorRootValues
		} );
	}

	_handleModalAfterOpen() {
		this.setState( this._initEditorModalState() );

		this.textarea.current.select();
	}
}
