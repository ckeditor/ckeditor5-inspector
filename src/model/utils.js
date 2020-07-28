/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export function isModelElement( node ) {
	return node && node.is( 'element' );
}

export function isModelRoot( node ) {
	return node && node.is( 'rootElement' );
}

export function getModelNodePathString( node ) {
	return node.getPath ? node.getPath() : node.path;
}

export function getModelPositionDefinition( position ) {
	return {
		path: getModelNodePathString( position ),
		stickiness: position.stickiness,
		index: position.index,
		isAtEnd: position.isAtEnd,
		isAtStart: position.isAtStart,
		offset: position.offset,
		textNode: position.textNode && position.textNode.data
	};
}

export function getEditorModelNodeByRootAndPath( editor, rootName, nodePath ) {
	try {
		return editor.model.document
			.getRoot( rootName )
			.getNodeByPath( nodePath );
	} catch {
		return null;
	}
}
