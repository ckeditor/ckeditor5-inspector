/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Tree from '../tree';
import Select from '../select';
import NavBox from '../navbox';
import Checkbox from '../checkbox';
import StorageManager from '../../storagemanager';
import editorEventObserver from '../editorobserver';
import {
	isViewElement,
	isViewAttributeElement,
	isViewEmptyElement,
	isViewUiElement,
	isViewRoot
} from './utils';
import { stringify } from '../utils';

const LOCAL_STORAGE_ELEMENT_TYPES = 'view-element-types';
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
				<div className="ck-inspector-tree__config" key="types-cfg">
					<Checkbox
						label="Show element types"
						id="view-show-types"
						isChecked={this.state.showTypes}
						onChange={this.handleShowTypesChange}
					/>
				</div>
			]}
			<Tree
				items={tree}
				textDirection={this.props.editor.locale.contentLanguageDirection}
				onClick={this.props.onClick}
				showCompactText="true"
				activeNode={this.props.currentEditorNode}
			/>
		</NavBox>;
	}

	getEditorViewTree() {
		if ( !this.props.currentRootName ) {
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
	} else {
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
		} else {
			elementTree.name = 'container:' + element.name;
		}
	} else {
		elementTree.name = element.name;
	}

	// Regardless of other rendering options, empty elements need no closing tags. They will never
	// host any children or selection.
	if ( isViewEmptyElement( element ) ) {
		elementTree.presentation = {
			isEmpty: true
		};
	}

	if ( isViewUiElement( element ) ) {
		elementTree.children.push( {
			type: 'comment',
			text: [
				'&lt;!--',
				'The View UI element content has been skipped. ',
				'<a href="https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_uielement-UIElement.html" target="_blank">',
				'Find out why',
				'</a>.',
				' --&gt;'
			].join( '' ),
		} );
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
		];
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

	// Filter out empty strings, a leftover after slice().
	textNodeTree.children = textNodeTree.children.filter( child => child );

	return textNodeTree;
}

function getNodeAttrs( node ) {
	const attrs = [ ...node.getAttributes() ].map( ( [ name, value ] ) => {
		return [ name, stringify( value, false ) ];
	} );

	return new Map( attrs );
}

export default editorEventObserver( ViewTree );
