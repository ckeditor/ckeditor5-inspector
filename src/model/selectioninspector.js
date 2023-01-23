/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../components/button';
import ObjectInspector from '../components/objectinspector';
import { stringifyPropertyList } from '../components/utils';

import Logger from '../logger';
import { getModelPositionDefinition } from './utils';

import ConsoleIcon from '../assets/img/console.svg';
import EyeIcon from '../assets/img/eye.svg';

const API_DOCS_PREFIX = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_selection-Selection.html';

class ModelSelectionInspector extends Component {
	constructor( props ) {
		super( props );

		this.handleSelectionLogButtonClick = this.handleSelectionLogButtonClick.bind( this );
		this.handleScrollToSelectionButtonClick = this.handleScrollToSelectionButtonClick.bind( this );
	}

	handleSelectionLogButtonClick() {
		const editor = this.props.editor;

		Logger.log( editor.model.document.selection );
	}

	handleScrollToSelectionButtonClick() {
		const domSelectionElement = document.querySelector( '.ck-inspector-tree__position.ck-inspector-tree__position_selection' );

		// E.g. wrong root is selected.
		if ( !domSelectionElement ) {
			return;
		}

		domSelectionElement.scrollIntoView( {
			behavior: 'smooth',
			block: 'center'
		} );
	}

	render() {
		const editor = this.props.editor;
		const info = this.props.info;

		return <ObjectInspector
			header={[
				<span key="link">
					<a href={API_DOCS_PREFIX}
						target="_blank" rel="noopener noreferrer">
						<b>Selection</b>
					</a>
				</span>,
				<Button
					key="log"
					icon={<ConsoleIcon />}
					text="Log in console"
					onClick={this.handleSelectionLogButtonClick}
				/>,
				<Button
					key="scroll"
					icon={<EyeIcon />}
					text="Scroll to selection"
					onClick={this.handleScrollToSelectionButtonClick}
				/>
			]}
			lists={[
				{
					name: 'Attributes',
					url: `${ API_DOCS_PREFIX }#function-getAttributes`,
					itemDefinitions: info.attributes
				},
				{
					name: 'Properties',
					url: `${ API_DOCS_PREFIX }`,
					itemDefinitions: info.properties
				},
				{
					name: 'Anchor',
					url: `${ API_DOCS_PREFIX }#member-anchor`,
					buttons: [
						{
							icon: <ConsoleIcon />,
							text: 'Log in console',
							onClick: () => Logger.log( editor.model.document.selection.anchor )
						}
					],
					itemDefinitions: info.anchor
				},
				{
					name: 'Focus',
					url: `${ API_DOCS_PREFIX }#member-focus`,
					buttons: [
						{
							icon: <ConsoleIcon />,
							text: 'Log in console',
							onClick: () => Logger.log( editor.model.document.selection.focus )
						}
					],
					itemDefinitions: info.focus
				},
				{
					name: 'Ranges',
					url: `${ API_DOCS_PREFIX }#function-getRanges`,
					buttons: [
						{
							icon: <ConsoleIcon />,
							text: 'Log in console',
							onClick: () => Logger.log( ...editor.model.document.selection.getRanges() )
						}
					],
					itemDefinitions: info.ranges,
					presentation: {
						expandCollapsibles: true
					}
				}
			]}
		/>;
	}
}

const mapStateToProps = ( { editors, currentEditorName, model: { ranges } } ) => {
	const editor = editors.get( currentEditorName );
	const info = getEditorSelectionInfo( editor, ranges );

	return {
		editor, currentEditorName, info
	};
};

export default connect( mapStateToProps, {} )( ModelSelectionInspector );

function getPositionDetails( { path, stickiness, index, isAtEnd, isAtStart, offset, textNode } ) {
	return {
		path: {
			value: path
		},
		stickiness: {
			value: stickiness
		},
		index: {
			value: index
		},
		isAtEnd: {
			value: isAtEnd
		},
		isAtStart: {
			value: isAtStart
		},
		offset: {
			value: offset
		},
		textNode: {
			value: textNode
		}
	};
}

function getEditorSelectionInfo( editor, ranges ) {
	const selection = editor.model.document.selection;
	const anchor = selection.anchor;
	const focus = selection.focus;
	const info = {
		properties: {
			isCollapsed: {
				value: selection.isCollapsed
			},
			isBackward: {
				value: selection.isBackward
			},
			isGravityOverridden: {
				value: selection.isGravityOverridden
			},
			rangeCount: {
				value: selection.rangeCount
			}
		},
		attributes: {},
		anchor: getPositionDetails( getModelPositionDefinition( anchor ) ),
		focus: getPositionDetails( getModelPositionDefinition( focus ) ),
		ranges: {}
	};

	for ( const [ name, value ] of selection.getAttributes() ) {
		info.attributes[ name ] = { value };
	}

	ranges.forEach( ( range, index ) => {
		info.ranges[ index ] = {
			value: '',
			subProperties: {
				start: {
					value: '',
					subProperties: stringifyPropertyList( getPositionDetails( range.start ) )
				},
				end: {
					value: '',
					subProperties: stringifyPropertyList( getPositionDetails( range.end ) )
				}
			}
		};
	} );

	for ( const category in info ) {
		if ( category === 'ranges' ) {
			continue;
		}

		info[ category ] = stringifyPropertyList( info[ category ] );
	}

	return info;
}
