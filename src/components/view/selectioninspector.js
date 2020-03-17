/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Logger from '../../logger';
import Button from './../button';
import editorEventObserver from '../editorobserver';
import ObjectInspector from './../objectinspector';
import { getViewPositionDefinition } from './utils';
import { stringifyPropertyList } from '../utils';

const API_DOCS_PREFIX = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_selection-Selection.html';

class ViewSelectionInspector extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.editing.view,
			event: 'render'
		};
	}

	render() {
		const info = this.getEditorSelectionInfo();

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
					onClick={() => Logger.log( this.props.editor.editing.view.document.selection )}
				/>
			]}
			lists={[
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
							onClick: () => Logger.log( this.props.editor.editing.view.document.selection.anchor )
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
							onClick: () => Logger.log( this.props.editor.editing.view.document.selection.focus )
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
							onClick: () => Logger.log( ...this.props.editor.editing.view.document.selection.getRanges() )
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
		const selection = this.props.editor.editing.view.document.selection;
		const info = {
			properties: {
				isCollapsed: {
					value: selection.isCollapsed
				},
				isBackward: {
					value: selection.isBackward
				},
				isFake: {
					value: selection.isFake
				},
				rangeCount: {
					value: selection.rangeCount
				},
			},
			anchor: getPositionDetails( getViewPositionDefinition( selection.anchor ) ),
			focus: getPositionDetails( getViewPositionDefinition( selection.focus ) ),
			ranges: {}
		};

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

function getPositionDetails( { offset, isAtEnd, isAtStart, parent } ) {
	return {
		offset: {
			value: offset
		},
		isAtEnd: {
			value: isAtEnd
		},
		isAtStart: {
			value: isAtStart
		},
		parent: {
			value: parent
		},
	};
}

export default editorEventObserver( ViewSelectionInspector );
