/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Tree from '../tree';
import NavBox from '../navbox';
import Select from '../select';
import Checkbox from '../checkbox';
import StorageManager from '../../storagemanager';
import editorEventObserver from '../editorobserver';
import { isModelElement } from './utils';
import { stringify } from '../utils';

const LOCAL_STORAGE_COMPACT_TEXT = 'model-compact-text';
class ModelTree extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showCompactText: StorageManager.get( LOCAL_STORAGE_COMPACT_TEXT ) === 'true'
		};

		this.handleCompactTextChange = this.handleCompactTextChange.bind( this );
	}

	editorEventObserverConfig( props ) {
		return {
			target: props.editor.model.document,
			event: 'change'
		};
	}

	handleCompactTextChange( evt ) {
		this.setState( { showCompactText: evt.target.checked }, () => {
			StorageManager.set( LOCAL_STORAGE_COMPACT_TEXT, this.state.showCompactText );
		} );
	}

	render() {
		const tree = this.getEditorModelTree();

		return <NavBox>
			{[
				<div className="ck-inspector-tree__config" key="root-cfg">
					<Select
						id="view-root-select"
						label="Root"
						value={this.props.currentRootName}
						options={this.props.editorRoots.map( root => root.rootName )}
						onChange={evt => this.props.onRootChange( evt.target.value )}
					/>
				</div>,
				<div className="ck-inspector-tree__config" key="text-cfg">
					<Checkbox
						label="Compact text"
						id="model-compact-text"
						isChecked={this.state.showCompactText}
						onChange={this.handleCompactTextChange}
					/>
				</div>
			]}
			<Tree
				items={tree}
				textDirection={this.props.editor.locale.contentLanguageDirection}
				onClick={this.props.onClick}
				showCompactText={this.state.showCompactText}
				activeNode={this.props.currentEditorNode}
			/>
		</NavBox>;
	}

	getEditorModelTree() {
		if ( !this.props.currentRootName ) {
			return null;
		}

		const editor = this.props.editor;
		const model = editor.model;
		const root = model.document.getRoot( this.props.currentRootName );
		const ranges = this.getEditorModelRanges();

		return [
			getNodeTree( root, ranges )
		];
	}

	getEditorModelRanges() {
		if ( !this.props.currentRootName ) {
			return null;
		}

		const ranges = [];
		const editor = this.props.editor;
		const model = editor.model;

		for ( const range of model.document.selection.getRanges() ) {
			ranges.push( {
				startPath: range.start.path,
				endPath: range.end.path
			} );
		}

		return ranges;
	}
}

function getNodeTree( node, ranges ) {
	const nodeTree = {};
	const { startOffset, endOffset } = node;

	Object.assign( nodeTree, {
		startOffset, endOffset,
		path: node.getPath(),
		positionsBefore: [],
		positionsAfter: []
	} );

	if ( isModelElement( node ) ) {
		fillElementTree( nodeTree, node, ranges );
	} else {
		fillTextTree( nodeTree, node );
	}

	return nodeTree;
}

function fillElementTree( elementTree, element, ranges ) {
	Object.assign( elementTree, {
		type: 'element',
		name: element.name,
		children: [],
		node: element,
		maxOffset: element.maxOffset,
		positionsInside: []
	} );

	for ( const child of element.getChildren() ) {
		elementTree.children.push( getNodeTree( child, ranges ) );
	}

	for ( const range of ranges ) {
		const rangePositions = getRangePositionsInsideNode( elementTree, range );

		for ( const position of rangePositions ) {
			const offset = position.offset;

			if ( offset === 0 ) {
				const firstChild = elementTree.children[ 0 ];

				if ( firstChild ) {
					firstChild.positionsBefore.push( position );
				} else {
					elementTree.positionsInside.push( position );
				}
			} else if ( offset === elementTree.maxOffset ) {
				const lastChild = elementTree.children[ elementTree.children.length - 1 ];

				if ( lastChild ) {
					lastChild.positionsAfter.push( position );
				} else {
					elementTree.positionsInside.push( position );
				}
			} else {
				let childIndex = position.isEnd ? 0 : elementTree.children.length - 1;
				let child = elementTree.children[ childIndex ];

				while ( child ) {
					if ( child.startOffset === offset ) {
						child.positionsBefore.push( position );
						break;
					}

					if ( child.endOffset === offset ) {
						child.positionsAfter.push( position );
						break;
					}

					if ( child.startOffset < offset && child.endOffset > offset ) {
						child.positions.push( position );
						break;
					}

					childIndex += position.isEnd ? 1 : -1;
					child = elementTree.children[ childIndex ];
				}
			}
		}
	}

	elementTree.attributes = getNodeAttrs( element );
}

function fillTextTree( textTree, textNode ) {
	Object.assign( textTree, {
		type: 'text',
		text: textNode.data,
		node: textNode,
		positions: [],
		presentation: {
			dontRenderAttributeValue: true
		}
	} );

	textTree.attributes = getNodeAttrs( textNode );
}

function getNodeAttrs( node ) {
	const attrs = [ ...node.getAttributes() ].map( ( [ name, value ] ) => {
		return [ name, stringify( value, false ) ];
	} );

	return new Map( attrs );
}

function getRangePositionsInsideNode( node, range ) {
	const nodePath = node.path;
	const rangeStartPath = range.startPath;
	const rangeEndPath = range.endPath;
	const positions = [];

	if ( isPathPrefixingAnother( nodePath, rangeStartPath ) ) {
		positions.push( {
			offset: rangeStartPath[ rangeStartPath.length - 1 ],
			isEnd: false
		} );
	}

	if ( isPathPrefixingAnother( nodePath, rangeEndPath ) ) {
		positions.push( {
			offset: rangeEndPath[ rangeEndPath.length - 1 ],
			isEnd: true
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

function compareArrays( a, b ) {
	const minLen = Math.min( a.length, b.length );

	for ( let i = 0; i < minLen; i++ ) {
		if ( a[ i ] != b[ i ] ) {
			// The arrays are different.
			return i;
		}
	}

	// Both arrays were same at all points.
	if ( a.length == b.length ) {
		// If their length is also same, they are the same.
		return 'same';
	} else if ( a.length < b.length ) {
		// Compared array is shorter so it is a prefix of the other array.
		return 'prefix';
	} else {
		// Compared array is longer so it is an extension of the other array.
		return 'extension';
	}
}

export default editorEventObserver( ModelTree );
