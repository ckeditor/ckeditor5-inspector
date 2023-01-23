/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

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
		textNode: position.textNode && position.textNode.data
	};
}
