/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Tree from '../tree';
import Select from '../select';
import Checkbox from '../checkbox';
import StorageManager from '../../storagemanager';
import editorEventObserver from '../editorobserver';
import {
	isViewElement,
	isViewAttributeElement,
	isViewContainerElement,
	isViewEmptyElement,
	isViewUiElement,
	isViewRoot,
	isViewText
} from './utils';

const LOCAL_STORAGE_ELEMENT_TYPES = 'ck5-inspector-view-element-types';
class ViewTree extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			showTypes: StorageManager.get( LOCAL_STORAGE_ELEMENT_TYPES ) === 'true'
		};

		this.handleShowTypesChange = this.handleShowTypesChange.bind( this );
	}

	editorEventObserverConfig( props ) {
		return {
			target: props.editor.editing.view,
			event: 'render'
		};
	}

	handleShowTypesChange( evt ) {
		this.setState( { showTypes: evt.target.checked }, () => {
			StorageManager.set( LOCAL_STORAGE_ELEMENT_TYPES, this.state.showTypes );
		} );
	}

	render() {
		const tree = this.getEditorViewTree();

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
							label="Show element types"
							id="view-show-types"
							isChecked={this.state.showTypes}
							onChange={this.handleShowTypesChange}
						/>
					</div>
				</div>
				<div className="ck-inspector-panes__content">
					<Tree
						items={tree}
						onClick={this.props.onClick}
						showCompactText="true"
						activeNode={this.props.currentEditorNode}
					/>
				</div>
			</div>
		</div>
	}

	getEditorViewTree() {
		if( !this.props.currentRootName ) {
			return;
		}

		const editor = this.props.editor;
		const document = editor.editing.view.document;
		const root = document.getRoot( this.props.currentRootName );
		const selectionRange = document.selection.getFirstRange();

		return [
			getNodeTree( root, selectionRange.start, selectionRange.end, this.state.showTypes )
		];
	}

}

function getNodeTree( node, rangeStart, rangeEnd, showTypes ) {
	if ( isViewElement( node ) ) {
		return getElementTree( node, rangeStart, rangeEnd, showTypes );
	} else if ( isViewText( node ) ) {
		return getTextTree( node, rangeStart, rangeEnd, showTypes );
	}
}

function getElementTree( element, rangeStart, rangeEnd, showTypes ) {
	const elementTree = {};

	Object.assign( elementTree, {
		type: 'element',
		children: [],
		node: element
	} );

	if ( showTypes ) {
		if ( isViewAttributeElement( element ) ) {
			elementTree.name = 'attribute:' + element.name;
		} else if ( isViewRoot( element ) ) {
			elementTree.name = 'root:' + element.name;
		} else if ( isViewEmptyElement( element ) ) {
			elementTree.name = 'empty:' + element.name;
		} else if ( isViewUiElement( element ) ) {
			elementTree.name = 'ui:' + element.name;
		} else if ( isViewContainerElement( element ) ) {
			elementTree.name = 'container:' + element.name;
		} else {
			elementTree.name = element.name;
		}
	} else {
		elementTree.name = element.name;
	}

	// Regardless of other rendering options, empty elements need no closing tags. They will never
	// host any children or selection.
	if ( isViewEmptyElement( element) ) {
		elementTree.presentation = {
			dontClose: true
		};
	}

	if ( element.childCount ) {
		let isSelectionStartAdded = false;
		let isSelectionEndAdded = false;

		for ( const child of element.getChildren() ) {
			const childTree = getNodeTree( child, rangeStart, rangeEnd, showTypes );

			// Non–empty element case - start: <p>...[<someNode />...</p>
			if ( !isSelectionStartAdded && rangeStart.nodeAfter === child ) {
				elementTree.children.push( { type: 'selection', isEnd: false } );

				isSelectionStartAdded = true;
			}

			// Non–empty element case - end: <p>...]<someNode />...</p>
			if ( !isSelectionEndAdded && rangeEnd.nodeAfter === child ) {
				elementTree.children.push( { type: 'selection', isEnd: true } );

				isSelectionEndAdded = true;
			}

			elementTree.children.push( childTree );

			// Non–empty element case - start: <p>...<someNode />[...</p>
			if ( !isSelectionStartAdded && rangeStart.nodeBefore === child ) {
				elementTree.children.push( { type: 'selection', isEnd: false } );

				isSelectionStartAdded = true;
			}

			// Non–empty element case - end: <p>...<someNode />]...</p>
			if ( !isSelectionEndAdded && rangeEnd.nodeBefore === child ) {
				elementTree.children.push( { type: 'selection', isEnd: true } );

				isSelectionEndAdded = true;
			}
		}
	} else {
		// Empty element case - start: <p>[</p>
		if ( rangeStart.parent === element && !rangeStart.nodeBefore && !rangeStart.nodeAfter ) {
			elementTree.children.push( { type: 'selection', isEnd: false } );
		}

		// Empty element case - end: <p>]</p>
		if ( rangeEnd.parent === element && !rangeEnd.nodeBefore && !rangeEnd.nodeAfter ) {
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
		node: textNode
	} );

	// "f[oobar"
	if ( rangeStart.parent === textNode ) {
		startSliceIndex = rangeStart.offset;

		textNodeTree.children = [
			textNode.data.slice( 0, startSliceIndex ),
			{ type: 'selection' },
			textNode.data.slice( startSliceIndex, textNode.data.length )
		]
	}

	// "fooba]r"
	if ( rangeEnd.parent === textNode ) {
		let endSliceIndex = rangeEnd.offset;

		// "fooba[]r"
		if ( rangeStart.parent === rangeEnd.parent ) {
			endSliceIndex -= startSliceIndex;
		}

		const lastChild = textNodeTree.children.pop();

		textNodeTree.children.push(
			lastChild.slice( 0, endSliceIndex ),
			{ type: 'selection', isEnd: true },
			lastChild.slice( endSliceIndex, lastChild.length ) );
	}

	return textNodeTree;
}

function getNodeAttrs( node ) {
	return new Map( node.getAttributes() );
}

export default editorEventObserver( ViewTree );
