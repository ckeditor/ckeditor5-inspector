/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../components/button';
import ObjectInspector from '../components/objectinspector';
import { stringifyPropertyList } from '../components/utils';

import Logger from '../logger';
import { getModelPositionDefinition } from './utils';

const API_DOCS_PREFIX = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_selection-Selection.html';

class ModelSelectionInspector extends Component {
	render() {
		const info = this.getEditorSelectionInfo();
		const editor = this.props.currentEditor;

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
					type="log"
					text="Log in console"
					onClick={() => Logger.log( editor.model.document.selection )}
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
							type: 'log',
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
							type: 'log',
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
							type: 'log',
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

	getEditorSelectionInfo() {
		const selection = this.props.currentEditor.model.document.selection;
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

		this.props.ranges.forEach( ( range, index ) => {
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
}

const mapStateToProps = ( { currentEditor, model: { ranges } } ) => {
	return { currentEditor, ranges };
};

const mapDispatchToProps = {};

export default connect( mapStateToProps, mapDispatchToProps )( ModelSelectionInspector );

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
