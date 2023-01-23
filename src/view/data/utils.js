/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	isViewElement,
	isViewAttributeElement,
	isViewEditableElement,
	isViewRoot,
	isViewEmptyElement,
	isViewUiElement,
	isViewRawElement,
	getViewPositionDefinition
} from '../utils';

import { compareArrays } from '../../utils';

import {
	stringify,
	stringifyPropertyList
} from '../../components/utils';

export const DOCS_URL_PREFIX = 'https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view';

const UI_ELEMENT_CONTENT_COMMENT = '&lt;!--' +
	'The View UI element content has been skipped. ' +
	`<a href="${ DOCS_URL_PREFIX }_uielement-UIElement.html" target="_blank">Find out why</a>.` +
' --&gt;';

const RAW_ELEMENT_CONTENT_COMMENT = '&lt;!--' +
	'The View raw element content has been skipped. ' +
	`<a href="${ DOCS_URL_PREFIX }_rawelement-RawElement.html" target="_blank">Find out why</a>.` +
' --&gt;';

export function getEditorViewRoots( editor ) {
	if ( !editor ) {
		return [];
	}

	return [ ...editor.editing.view.document.roots ];
}

export function getEditorViewRanges( editor, currentRootName ) {
	if ( !editor ) {
		return [];
	}

	const ranges = [];
	const selection = editor.editing.view.document.selection;

	for ( const range of selection.getRanges() ) {
		if ( range.root.rootName !== currentRootName ) {
			continue;
		}

		ranges.push( {
			type: 'selection',
			start: getViewPositionDefinition( range.start ),
			end: getViewPositionDefinition( range.end )
		} );
	}

	return ranges;
}

export function getEditorViewTreeDefinition( { currentEditor, currentRootName, ranges } ) {
	if ( !currentEditor || !currentRootName ) {
		return null;
	}

	const document = currentEditor.editing.view.document;
	const root = document.getRoot( currentRootName );

	return [
		getViewNodeDefinition( root, [ ...ranges ] )
	];
}

export function getEditorViewNodeDefinition( node ) {
	const info = {
		editorNode: node,
		properties: {},
		attributes: {},
		customProperties: {}
	};

	if ( isViewElement( node ) ) {
		if ( isViewRoot( node ) ) {
			info.type = 'RootEditableElement';
			info.name = node.rootName;
			info.url = `${ DOCS_URL_PREFIX }_rooteditableelement-RootEditableElement.html`;
		} else {
			info.name = node.name;

			if ( isViewAttributeElement( node ) ) {
				info.type = 'AttributeElement';
				info.url = `${ DOCS_URL_PREFIX }_attributeelement-AttributeElement.html`;
			} else if ( isViewEmptyElement( node ) ) {
				info.type = 'EmptyElement';
				info.url = `${ DOCS_URL_PREFIX }_emptyelement-EmptyElement.html`;
			} else if ( isViewUiElement( node ) ) {
				info.type = 'UIElement';
				info.url = `${ DOCS_URL_PREFIX }_uielement-UIElement.html`;
			} else if ( isViewRawElement( node ) ) {
				info.type = 'RawElement';
				info.url = `${ DOCS_URL_PREFIX }_rawelement-RawElement.html`;
			} else if ( isViewEditableElement( node ) ) {
				info.type = 'EditableElement';
				info.url = `${ DOCS_URL_PREFIX }_editableelement-EditableElement.html`;
			} else {
				info.type = 'ContainerElement';
				info.url = `${ DOCS_URL_PREFIX }_containerelement-ContainerElement.html`;
			}
		}

		getSortedNodeAttributes( node )
			.forEach( ( [ name, value ] ) => {
				info.attributes[ name ] = { value };
			} );

		info.properties = {
			index: {
				value: node.index
			},
			isEmpty: {
				value: node.isEmpty
			},
			childCount: {
				value: node.childCount
			}
		};

		for ( let [ name, value ] of node.getCustomProperties() ) {
			if ( typeof name === 'symbol' ) {
				name = name.toString();
			}

			info.customProperties[ name ] = { value };
		}
	} else {
		info.name = node.data;
		info.type = 'Text';
		info.url = `${ DOCS_URL_PREFIX }_text-Text.html`;

		info.properties = {
			index: {
				value: node.index
			}
		};
	}

	info.properties = stringifyPropertyList( info.properties );
	info.customProperties = stringifyPropertyList( info.customProperties );
	info.attributes = stringifyPropertyList( info.attributes );

	return info;
}

function getViewNodeDefinition( node, ranges ) {
	const nodeDefinition = {};

	Object.assign( nodeDefinition, {
		index: node.index,
		path: node.getPath(),
		node,
		positionsBefore: [],
		positionsAfter: []
	} );

	if ( isViewElement( node ) ) {
		fillElementDefinition( nodeDefinition, ranges );
	} else {
		fillViewTextNodeDefinition( nodeDefinition, ranges );
	}

	return nodeDefinition;
}

function fillElementDefinition( elementDefinition, ranges ) {
	const element = elementDefinition.node;

	Object.assign( elementDefinition, {
		type: 'element',
		children: [],
		positions: []
	} );

	elementDefinition.name = element.name;

	if ( isViewAttributeElement( element ) ) {
		elementDefinition.elementType = 'attribute';
	} else if ( isViewRoot( element ) ) {
		elementDefinition.elementType = 'root';
	} else if ( isViewEmptyElement( element ) ) {
		elementDefinition.elementType = 'empty';
	} else if ( isViewUiElement( element ) ) {
		elementDefinition.elementType = 'ui';
	} else if ( isViewRawElement( element ) ) {
		elementDefinition.elementType = 'raw';
	} else {
		elementDefinition.elementType = 'container';
	}

	// Regardless of other rendering options, empty elements need no closing tags. They will never
	// host any children or selection.
	if ( isViewEmptyElement( element ) ) {
		elementDefinition.presentation = {
			isEmpty: true
		};
	} else if ( isViewUiElement( element ) ) {
		elementDefinition.children.push( {
			type: 'comment',
			text: UI_ELEMENT_CONTENT_COMMENT
		} );
	} else if ( isViewRawElement( element ) ) {
		elementDefinition.children.push( {
			type: 'comment',
			text: RAW_ELEMENT_CONTENT_COMMENT
		} );
	}

	for ( const child of element.getChildren() ) {
		elementDefinition.children.push( getViewNodeDefinition( child, ranges ) );
	}

	fillViewElementDefinitionPositions( elementDefinition, ranges );

	elementDefinition.attributes = getNodeAttributesForDefinition( element );
}

function fillViewTextNodeDefinition( textNodeDefinition, ranges ) {
	Object.assign( textNodeDefinition, {
		type: 'text',
		startOffset: 0,
		text: textNodeDefinition.node.data,
		positions: []
	} );

	for ( const range of ranges ) {
		const positions = getRangePositionsInViewNode( textNodeDefinition, range );

		textNodeDefinition.positions.push( ...positions );
	}
}

function fillViewElementDefinitionPositions( elementDefinition, ranges ) {
	for ( const range of ranges ) {
		const positions = getRangePositionsInViewNode( elementDefinition, range );

		for ( const position of positions ) {
			const offset = position.offset;

			if ( offset === 0 ) {
				const firstChild = elementDefinition.children[ 0 ];

				if ( firstChild ) {
					firstChild.positionsBefore.push( position );
				} else {
					elementDefinition.positions.push( position );
				}
			} else if ( offset === elementDefinition.children.length ) {
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
				//		<p></p>
				//		[<p></p>]
				//		<p></p>
				//
				// instead of
				//
				//		<p></p>[
				//		<p></p>
				//		]<p></p>
				//
				let childIndex = position.isEnd ? 0 : elementDefinition.children.length - 1;
				let child = elementDefinition.children[ childIndex ];

				while ( child ) {
					if ( child.index === offset ) {
						child.positionsBefore.push( position );
						break;
					}

					if ( child.index + 1 === offset ) {
						child.positionsAfter.push( position );

						break;
					}

					childIndex += position.isEnd ? 1 : -1;
					child = elementDefinition.children[ childIndex ];
				}
			}
		}
	}
}

function getRangePositionsInViewNode( nodeDefinition, range ) {
	const nodePath = nodeDefinition.path;
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

function getNodeAttributesForDefinition( node ) {
	const attrs = getSortedNodeAttributes( node )
		.map( ( [ name, value ] ) => {
			return [ name, stringify( value, false ) ];
		} );

	return new Map( attrs );
}

function getSortedNodeAttributes( node ) {
	return [ ...node.getAttributes() ]
		.sort( ( [ nameA ], [ nameB ] ) => nameA.toUpperCase() < nameB.toUpperCase() ? -1 : 1 );
}
