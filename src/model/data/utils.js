/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	isModelElement,
	getModelPositionDefinition
} from '../utils';

import { compareArrays } from '../../utils';
import { stringify } from '../../components/utils';

const MARKER_COLORS = [
	'#03a9f4', '#fb8c00', '#009688', '#e91e63', '#4caf50', '#00bcd4',
	'#607d8b', '#cddc39', '#9c27b0', '#f44336', '#6d4c41', '#8bc34a', '#3f51b5', '#2196f3',
	'#f4511e', '#673ab7', '#ffb300'
];

export function getEditorModelRoots( editor ) {
	if ( !editor ) {
		return null;
	}

	const roots = [ ...editor.model.document.roots ];

	// Put $graveyard at the end.
	return roots
		.filter( ( { rootName } ) => rootName !== '$graveyard' )
		.concat( roots.filter( ( { rootName } ) => rootName === '$graveyard' ) );
}

export function getEditorModelRanges( editor ) {
	const ranges = [];
	const model = editor.model;

	for ( const range of model.document.selection.getRanges() ) {
		ranges.push( {
			type: 'selection',
			start: getModelPositionDefinition( range.start ),
			end: getModelPositionDefinition( range.end )
		} );
	}

	return ranges;
}

export function getEditorModelMarkers( editor ) {
	const markers = [];
	const model = editor.model;
	let markerCount = 0;

	for ( const marker of model.markers ) {
		const { name, affectsData, managedUsingOperations } = marker;

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
			start: getModelPositionDefinition( marker.getStart() ),
			end: getModelPositionDefinition( marker.getEnd() )
		} );
	}

	return markers;
}

export function getEditorModelTreeDefinition( { currentEditor, currentRootName, ranges, markers } ) {
	if ( !currentRootName ) {
		return null;
	}

	const model = currentEditor.model;
	const modelRoot = model.document.getRoot( currentRootName );

	return [
		getModelNodeDefinition( modelRoot, [ ...ranges, ...markers ] )
	];
}

function getModelNodeDefinition( node, ranges ) {
	const nodeDefinition = {};
	const { startOffset, endOffset } = node;

	Object.assign( nodeDefinition, {
		startOffset,
		endOffset,
		node,
		path: node.getPath(),
		positionsBefore: [],
		positionsAfter: []
	} );

	if ( isModelElement( node ) ) {
		fillElementDefinition( nodeDefinition, ranges );
	} else {
		fillTextNodeDefinition( nodeDefinition );
	}

	return nodeDefinition;
}

function fillElementDefinition( elementDefinition, ranges ) {
	const element = elementDefinition.node;

	Object.assign( elementDefinition, {
		type: 'element',
		name: element.name,
		children: [],
		maxOffset: element.maxOffset,
		positions: []
	} );

	for ( const child of element.getChildren() ) {
		elementDefinition.children.push( getModelNodeDefinition( child, ranges ) );
	}

	fillElementPositions( elementDefinition, ranges );

	elementDefinition.attributes = getNodeAttributes( element );
}

function fillElementPositions( elementDefinition, ranges ) {
	for ( const range of ranges ) {
		const positions = getRangePositionsInElement( elementDefinition, range );

		for ( const position of positions ) {
			const offset = position.offset;

			if ( offset === 0 ) {
				const firstChild = elementDefinition.children[ 0 ];

				if ( firstChild ) {
					firstChild.positionsBefore.push( position );
				} else {
					elementDefinition.positions.push( position );
				}
			} else if ( offset === elementDefinition.maxOffset ) {
				const lastChild = elementDefinition.children[ elementDefinition.children.length - 1 ];

				if ( lastChild ) {
					lastChild.positionsAfter.push( position );
				} else {
					elementDefinition.positions.push( position );
				}
			} else {
				// Go backward when looking for a child that will host the end position.
				// Go forward when looking for a child that will host the start position.
				//
				//		<foo></foo>
				//		[<bar></bar>]
				//		<baz></baz>
				//
				// instead of
				//
				//		<foo></foo>[
				//		<bar></bar>
				//		]<baz></baz>
				//
				let childIndex = position.isEnd ? 0 : elementDefinition.children.length - 1;
				let child = elementDefinition.children[ childIndex ];

				while ( child ) {
					if ( child.startOffset === offset ) {
						child.positionsBefore.push( position );
						break;
					}

					if ( child.endOffset === offset ) {
						const nextChild = elementDefinition.children[ childIndex + 1 ];

						// Avoid the situation where the order of positions could weird around text nodes.
						//
						//		do           <element><$text>foo<$/text><$text>[]bar<$/text></element>
						//		instead of   <element><$text>foo]<$/text><$text>[bar<$/text></element>
						//
						if ( position.isEnd && nextChild && nextChild.type === 'text' ) {
							nextChild.positionsBefore.push( position );
						} else {
							child.positionsAfter.push( position );
						}

						break;
					}

					if ( child.startOffset < offset && child.endOffset > offset ) {
						child.positions.push( position );
						break;
					}

					childIndex += position.isEnd ? 1 : -1;
					child = elementDefinition.children[ childIndex ];
				}
			}
		}
	}
}

function fillTextNodeDefinition( textNodeDefinition ) {
	const textNode = textNodeDefinition.node;

	Object.assign( textNodeDefinition, {
		type: 'text',
		text: textNode.data,
		positions: [],
		presentation: {
			dontRenderAttributeValue: true
		}
	} );

	textNodeDefinition.attributes = getNodeAttributes( textNode );
}

function getNodeAttributes( node ) {
	const attrs = [ ...node.getAttributes() ].map( ( [ name, value ] ) => {
		return [ name, stringify( value, false ) ];
	} );

	return new Map( attrs );
}

function getRangePositionsInElement( node, range ) {
	const nodePath = node.path;
	const startPath = range.start.path;
	const endPath = range.end.path;
	const positions = [];

	if ( isPathPrefixingAnother( nodePath, startPath ) ) {
		positions.push( {
			offset: startPath[ startPath.length - 1 ],
			isEnd: false,
			presentation: range.presentation,
			type: range.type,
			name: range.name
		} );
	}

	if ( isPathPrefixingAnother( nodePath, endPath ) ) {
		positions.push( {
			offset: endPath[ endPath.length - 1 ],
			isEnd: true,
			presentation: range.presentation,
			type: range.type,
			name: range.name
		} );
	}

	return positions;
}

function isPathPrefixingAnother( pathA, pathB ) {
	if ( pathA.length === pathB.length - 1 ) {
		const comparison = compareArrays( pathA, pathB );

		if ( comparison === 'prefix' ) {
			return true;
		}
	}

	return false;
}
