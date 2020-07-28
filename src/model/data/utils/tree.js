/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	getModelNodePathString,
	isModelElement
} from '../../utils';

import { compareArrays } from '../../../utils';
import { stringify } from '../../../components/utils';

/**
 * Returns a definition for the model tree.
 *
 * @param {options}
 * @param {options.currentEditor}
 * @param {options.currentRootName}
 * @param {options.ranges}
 * @param {options.markers}
 *
 * @returns {Object}
 */
export function getEditorModelTreeDefinition( { currentEditor, currentRootName, ranges, markers } ) {
	if ( !currentEditor ) {
		return [];
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
		path: getModelNodePathString( node ),
		positionsBefore: [],
		positionsAfter: []
	} );

	if ( isModelElement( node ) ) {
		fillElementDefinition( node, nodeDefinition, ranges );
	} else {
		fillTextNodeDefinition( node, nodeDefinition );
	}

	return nodeDefinition;
}

function fillElementDefinition( element, elementDefinition, ranges ) {
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
						const isBetweenTextAndElement = child.type === 'text' && nextChild && nextChild.type === 'element';
						const isBetweenElementAndText = child.type === 'element' && nextChild && nextChild.type === 'text';
						const isBetweenTwoTexts = child.type === 'text' && nextChild && nextChild.type === 'text';

						// Avoid the situation where the order of positions could weird around text nodes.
						//
						//		do           <element><$text>foo<$/text><$text>[]bar<$/text></element>
						//		instead of   <element><$text>foo]<$/text><$text>[bar<$/text></element>
						//
						//		do           <element><br />[]bar<$/text></element>
						//		instead of   <element><br />[<$text>]bar<$/text></element>
						//
						//		do           <element>bar<$/text>[]<br /></element>
						//		instead of   <element><$text>bar[<$/text>]<br /></element>
						//
						if ( position.isEnd && ( isBetweenTextAndElement || isBetweenElementAndText || isBetweenTwoTexts ) ) {
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

function fillTextNodeDefinition( textNode, textNodeDefinition ) {
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
			presentation: range.presentation || null,
			type: range.type,
			name: range.name || null
		} );
	}

	if ( isPathPrefixingAnother( nodePath, endPath ) ) {
		positions.push( {
			offset: endPath[ endPath.length - 1 ],
			isEnd: true,
			presentation: range.presentation || null,
			type: range.type,
			name: range.name || null
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
