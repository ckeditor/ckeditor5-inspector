/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { getModelPositionDefinition } from '../../utils';

const MARKER_COLORS = [
	'#03a9f4', '#fb8c00', '#009688', '#e91e63', '#4caf50', '#00bcd4',
	'#607d8b', '#cddc39', '#9c27b0', '#f44336', '#6d4c41', '#8bc34a', '#3f51b5', '#2196f3',
	'#f4511e', '#673ab7', '#ffb300'
];

export function getEditorModelRoots( editor ) {
	if ( !editor ) {
		return [];
	}

	const roots = [ ...editor.model.document.roots ];

	// Put $graveyard at the end.
	return roots
		.filter( ( { rootName } ) => rootName !== '$graveyard' )
		.concat( roots.filter( ( { rootName } ) => rootName === '$graveyard' ) );
}

export function getEditorModelRanges( editor, currentRootName ) {
	if ( !editor ) {
		return [];
	}

	const ranges = [];
	const model = editor.model;

	for ( const range of model.document.selection.getRanges() ) {
		if ( range.root.rootName !== currentRootName ) {
			continue;
		}

		ranges.push( {
			type: 'selection',
			start: getModelPositionDefinition( range.start ),
			end: getModelPositionDefinition( range.end )
		} );
	}

	return ranges;
}

export function getEditorModelMarkers( editor, currentRootName ) {
	if ( !editor ) {
		return [];
	}

	const markers = [];
	const model = editor.model;
	let markerCount = 0;

	for ( const marker of model.markers ) {
		const { name, affectsData, managedUsingOperations } = marker;
		const start = marker.getStart();
		const end = marker.getEnd();

		if ( start.root.rootName !== currentRootName ) {
			continue;
		}

		markers.push( {
			type: 'marker',
			marker,
			name,
			affectsData,
			managedUsingOperations,
			presentation: {
				// When there are more markers than colors, let's start over and reuse
				// the colors.
				color: MARKER_COLORS[ markerCount++ % ( MARKER_COLORS.length - 1 ) ]
			},
			start: getModelPositionDefinition( start ),
			end: getModelPositionDefinition( end )
		} );
	}

	return markers;
}
