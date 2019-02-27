/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export function isViewElement( node ) {
	return node && node.name;
}

export function isViewAttributeElement( node ) {
	return node && isViewElement( node ) && node.is( 'attributeElement' );
}

export function isViewContainerElement( node ) {
	return node && isViewElement( node ) && node.is( 'containerElement' );
}

export function isViewText( node ) {
	return node && node.data;
}

export function isViewRoot( node ) {
	return node && node.is( 'rootElement' );
}

export function nodeToString( node ) {
	if ( isViewElement( node ) ) {
		if ( isViewAttributeElement( node ) ) {
			return 'attribute:' + node.name;
		} else if ( isViewRoot( node ) ) {
			return 'root:' + node.name;
		} else if ( isViewContainerElement( node ) ) {
			return 'container:' + node.name;
		} else {
			return node.name;
		}
	} else if ( isViewText( node ) ) {
		return '"' + node.data + '"';
	}
}
