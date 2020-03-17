/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Pane from '../pane';
import Logger from '../../logger';
import Button from './../button';
import ObjectInspector from './../objectinspector';
import { stringifyPropertyList } from '../utils';

const API_DOCS_PREFIX = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_markercollection-Marker.html';

export default class ModelMarkerInspector extends Component {
	render() {
		const markerTree = getMarkerTree( this.props.markers );
		const markerListDefinitions = markerTreeToPropertyListDefinition( markerTree );

		if ( !Object.keys( markerTree ).length ) {
			return <Pane isEmpty="true">
				<p>No markers in the document.</p>
			</Pane>;
		}

		return <ObjectInspector
			header={[
				<span key="link">
					<a href={API_DOCS_PREFIX}
						target="_blank" rel="noopener noreferrer">
						<b>Markers</b>
					</a>
				</span>,
				<Button
					key="log"
					type="log"
					text="Log in console"
					onClick={() => Logger.log( [ ...this.props.editor.model.markers ] )}
				/>
			]}
			lists={[
				{
					name: 'Markers tree',
					itemDefinitions: markerListDefinitions,
					presentation: {
						expandCollapsibles: true
					}
				},
			]}
		/>;
	}
}

function getMarkerTree( markers ) {
	const markerTree = {};

	for ( const marker of markers ) {
		const nameSegments = marker.name.split( ':' );
		let currentNode = markerTree;

		for ( const segment of nameSegments ) {
			const isLastSegment = segment === nameSegments[ nameSegments.length - 1 ];

			if ( !currentNode[ segment ] ) {
				currentNode = currentNode[ segment ] = isLastSegment ? marker : {};
			} else {
				currentNode = currentNode[ segment ];
			}
		}
	}

	return markerTree;
}

function markerTreeToPropertyListDefinition( markerTree ) {
	const list = {};

	for ( const nodeName in markerTree ) {
		const nodeValue = markerTree[ nodeName ];
		const isMarkerNode = !!nodeValue.name;

		if ( isMarkerNode ) {
			const markerDetails = stringifyPropertyList( getMarkerdetails( nodeValue ) );

			list[ nodeName ] = {
				value: '',
				presentation: {
					colorBox: nodeValue.presentation.color
				},
				subProperties: markerDetails,
			};
		} else {
			const nodeCount = Object.keys( nodeValue ).length;

			list[ nodeName ] = {
				value: nodeCount + ' marker' + ( nodeCount > 1 ? 's' : '' ),
				subProperties: markerTreeToPropertyListDefinition( nodeValue )
			};
		}
	}

	return list;
}

function getMarkerdetails( { name, start, end, affectsData, managedUsingOperations } ) {
	return {
		name: {
			value: name
		},
		start: {
			value: start.path
		},
		end: {
			value: end.path
		},
		affectsData: {
			value: affectsData
		},
		managedUsingOperations: {
			value: managedUsingOperations
		}
	};
}
