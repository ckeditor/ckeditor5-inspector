/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	stringify,
	compareArrays
} from '../utils';

export function isModelElement( node ) {
	return node && node.is( 'element' );
}

export function isModelRoot( node ) {
	return node && node.is( 'rootElement' );
}

export function getNodePathString( node ) {
	return node.getPath ? node.getPath() : node.path;
}

export function getModelPositionDefinition( position ) {
	return {
		path: getNodePathString( position ),
		stickiness: position.stickiness,
		index: position.index,
		isAtEnd: position.isAtEnd,
		isAtStart: position.isAtStart,
		offset: position.offset,
		textNode: position.textNode && position.textNode.data,
	};
}

export function getModelNodeDefinition( node, ranges ) {
	const nodeDefinition = {};
	const { startOffset, endOffset } = node;

	Object.assign( nodeDefinition, {
		startOffset,
		endOffset,
		path: node.getPath(),
		positionsBefore: [],
		positionsAfter: []
	} );

	if ( isModelElement( node ) ) {
		fillElementDefinition( nodeDefinition, node, ranges );
	} else {
		fillTextNodeDefinition( nodeDefinition, node );
	}

	return nodeDefinition;
}

export function fillElementDefinition( elementDefinition, element, ranges ) {
	Object.assign( elementDefinition, {
		type: 'element',
		name: element.name,
		children: [],
		node: element,
		maxOffset: element.maxOffset,
		positionsInside: []
	} );

	for ( const child of element.getChildren() ) {
		elementDefinition.children.push( getModelNodeDefinition( child, ranges ) );
	}

	fillElementPositions( elementDefinition, ranges );

	elementDefinition.attributes = getNodeAttributes( element );
}

export function fillElementPositions( elementDefinition, ranges ) {
	for ( const range of ranges ) {
		const positions = getRangePositionsInsideElement( elementDefinition, range );

		for ( const position of positions ) {
			const offset = position.offset;

			if ( offset === 0 ) {
				const firstChild = elementDefinition.children[ 0 ];

				if ( firstChild ) {
					firstChild.positionsBefore.push( position );
				} else {
					elementDefinition.positionsInside.push( position );
				}
			} else if ( offset === elementDefinition.maxOffset ) {
				const lastChild = elementDefinition.children[ elementDefinition.children.length - 1 ];

				if ( lastChild ) {
					lastChild.positionsAfter.push( position );
				} else {
					elementDefinition.positionsInside.push( position );
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

function fillTextNodeDefinition( textNodeDefinition, textNode ) {
	Object.assign( textNodeDefinition, {
		type: 'text',
		text: textNode.data,
		node: textNode,
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

function getRangePositionsInsideElement( node, range ) {
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
			name: range.name,
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
