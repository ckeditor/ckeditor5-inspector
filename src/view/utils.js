/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

export function isViewElement( node ) {
	return node && node.name;
}

export function isViewAttributeElement( node ) {
	return node && isViewElement( node ) && node.is( 'attributeElement' );
}

export function isViewEmptyElement( node ) {
	return node && isViewElement( node ) && node.is( 'emptyElement' );
}

export function isViewUiElement( node ) {
	return node && isViewElement( node ) && node.is( 'uiElement' );
}

export function isViewRawElement( node ) {
	return node && isViewElement( node ) && node.is( 'rawElement' );
}

export function isViewEditableElement( node ) {
	return node && isViewElement( node ) && node.is( 'editableElement' );
}

export function isViewRoot( node ) {
	return node && node.is( 'rootElement' );
}

export function getViewPositionDefinition( position ) {
	return {
		path: [ ...position.parent.getPath(), position.offset ],
		offset: position.offset,
		isAtEnd: position.isAtEnd,
		isAtStart: position.isAtStart,
		parent: nodeToString( position.parent )
	};
}

export function nodeToString( node ) {
	if ( isViewElement( node ) ) {
		if ( isViewAttributeElement( node ) ) {
			return 'attribute:' + node.name;
		} else if ( isViewRoot( node ) ) {
			return 'root:' + node.name;
		} else {
			return 'container:' + node.name;
		}
	} else {
		return node.data;
	}
}
