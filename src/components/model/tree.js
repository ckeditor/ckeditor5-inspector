/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { Tree } from '../tree';
import Select from '../select';
import Checkbox from '../checkbox';
import StorageManager from '../../storagemanager';
import editorEventObserver from '../editorobserver';
import { isModelElement, isModelText } from './utils';

const LOCAL_STORAGE_COMPACT_TEXT = 'ck5-inspector-model-compact-text';
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

		return <div className="ck-inspector__document-tree">
			<div className="ck-inspector-panes">
				<div className="ck-inspector-panes__navigation">
					<div className="ck-inspector__document-tree__config">
						<Select
							id="view-root-select"
							label="Root"
							value={this.props.currentRootName}
							options={this.props.editorRoots.map( root => root.rootName )}
							onChange={( evt ) => this.props.onRootChange( evt.target.value )}
						/>
					</div>
					<div className="ck-inspector__document-tree__config">
						<Checkbox
							label="Compact text"
							id="model-compact-text"
							isChecked={this.state.showCompactText}
							onChange={this.handleCompactTextChange}
						/>
					</div>
				</div>
				<div className="ck-inspector-panes__content">
					<Tree
						items={tree}
						onClick={this.props.onClick}
						showCompactText={this.state.showCompactText}
						activeNode={this.props.currentEditorNode}
					/>
				</div>
			</div>
		</div>
	}

	getEditorModelTree() {
		if( !this.props.currentRootName ) {
			return null;
		}

		const editor = this.props.editor;
		const model = editor.model;
		const root = model.document.getRoot( this.props.currentRootName );
		const selectionRange = editor.model.document.selection.getFirstRange();

		return [
			getNodeTree( root, selectionRange.start, selectionRange.end )
		];
	}
}

function getNodeTree( node, rangeStart, rangeEnd ) {
	if ( isModelElement( node ) ) {
		return getElementTree( node, rangeStart, rangeEnd );
	} else if ( isModelText( node ) ) {
		return getTextTree( node, rangeStart, rangeEnd );
	}
}

function getElementTree( element, rangeStart, rangeEnd ) {
	const elementTree = {};

	Object.assign( elementTree, {
		type: 'element',
		name: element.name,
		children: [],
		node: element
	} );

	if ( element.childCount ) {
		let isSelectionStartAdded = false;
		let isSelectionEndAdded = false;

		for ( const child of element.getChildren() ) {
			const childTree = getNodeTree( child, rangeStart, rangeEnd );

			// Non–empty element case - start: <paragraph>...[<someNode />...</paragraph>
			if ( !isSelectionStartAdded && !rangeStart.textNode && rangeStart.nodeAfter === child ) {
				elementTree.children.push( { type: 'selection', isEnd: false } );

				isSelectionStartAdded = true;
			}

			// Non–empty element case - end: <paragraph>...]<someNode />...</paragraph>
			if ( !isSelectionEndAdded && !rangeEnd.textNode && rangeEnd.nodeAfter === child ) {
				elementTree.children.push( { type: 'selection', isEnd: true } );

				isSelectionEndAdded = true;
			}

			elementTree.children.push( childTree );

			// Non–empty element case - start: <paragraph>...<someNode />[...</paragraph>
			if ( !isSelectionStartAdded && !rangeStart.textNode && rangeStart.nodeBefore === child ) {
				elementTree.children.push( { type: 'selection', isEnd: false } );

				isSelectionStartAdded = true;
			}

			// Non–empty element case - end: <paragraph>...<someNode />]...</paragraph>
			if ( !isSelectionEndAdded && !rangeEnd.textNode && rangeEnd.nodeBefore === child ) {
				elementTree.children.push( { type: 'selection', isEnd: true } );

				isSelectionEndAdded = true;
			}
		}
	} else {
		// Empty element case - start: <paragraph>[</paragraph>
		if ( !rangeStart.textNode && rangeStart.parent === element && !rangeStart.nodeBefore && !rangeStart.nodeAfter ) {
			elementTree.children.push( { type: 'selection', isEnd: false } );
		}

		// Empty element case - end: <paragraph>]</paragraph>
		if ( !rangeEnd.textNode && rangeEnd.parent === element && !rangeEnd.nodeBefore && !rangeEnd.nodeAfter ) {
			elementTree.children.push( { type: 'selection', isEnd: true } );
		}
	}

	elementTree.attributes = getNodeAttrs( element );

	return elementTree;
}

function getTextTree( textNode, rangeStart, rangeEnd ) {
	const textNodeTree = {};
	let startSliceIndex;

	Object.assign( textNodeTree, {
		type: 'text',
		children: [ textNode.data ],
		node: textNode,
		presentation: {
			dontRenderAttributeValue: true
		}
	} );

	// <$text>f[oobar</$text>
	if ( rangeStart.textNode === textNode ) {
		startSliceIndex = rangeStart.offset - textNode.startOffset;

		textNodeTree.children = [
			textNode.data.slice( 0, startSliceIndex ),
			{ type: 'selection' },
			textNode.data.slice( startSliceIndex, textNode.data.length )
		]
	}

	// <$text>fooba]r</$text>
	if ( rangeEnd.textNode === textNode ) {
		let endSliceIndex = rangeEnd.offset - textNode.startOffset;

		// <$text>fooba[]r</$text>
		if ( rangeStart.textNode === rangeEnd.textNode ) {
			endSliceIndex -= startSliceIndex;
		}

		const lastChild = textNodeTree.children.pop();

		textNodeTree.children.push(
			lastChild.slice( 0, endSliceIndex ),
			{ type: 'selection', isEnd: true },
			lastChild.slice( endSliceIndex, lastChild.length ) );
	}

	textNodeTree.attributes = getNodeAttrs( textNode );

	return textNodeTree;
}

function getNodeAttrs( node ) {
	return new Map( node.getAttributes() );
}

export default editorEventObserver( ModelTree );
