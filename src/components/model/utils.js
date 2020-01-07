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

export function getNodePathString( node ) {
	return node.getPath ? node.getPath() : node.path;
}
