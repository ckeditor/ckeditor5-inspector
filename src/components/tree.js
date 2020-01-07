/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { truncateString } from './utils';
import './tree.css';

const MAX_ATTRIBUTE_VALUE_LENGTH = 500;

export default class Tree extends Component {
	render() {
		let treeContent;

		if ( this.props.items ) {
			treeContent = this.props.items.map( ( item, index ) => renderTreeItem( item, index, {
				onClick: this.props.onClick,
				showCompactText: this.props.showCompactText,
				activeNode: this.props.activeNode
			} ) );
		} else {
			treeContent = 'Nothing to show.';
		}

		return <div className={[
			'ck-inspector-tree',
			this.props.textDirection ? 'ck-inspector-tree_text-direction_' + this.props.textDirection : '',
			this.props.showCompactText ? 'ck-inspector-tree_compact-text' : ''
		].join( ' ' )}>
			{treeContent}
		</div>;
	}
}

export class TreeNode extends Component {
	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick( evt ) {
		this.props.onClick( evt, this.props.item.node );
	}

	getChildren() {
		return this.props.item.children.map( ( child, index ) => renderTreeItem( child, index, this.treeProps ) );
	}

	get isActive() {
		return this.props.item.node === this.props.activeNode;
	}

	get treeProps() {
		return {
			onClick: this.props.onClick,
			showCompactText: this.props.showCompactText,
			activeNode: this.props.activeNode
		};
	}
}

export class TreeElement extends TreeNode {
	render() {
		const item = this.props.item;
		const presentation = item.presentation;
		const isEmpty = presentation && presentation.isEmpty;
		const cssClass = presentation && presentation.cssClass;
		const nodeClasses = [
			'ck-inspector-code',
			'ck-inspector-tree-node',
			( this.isActive ? 'ck-inspector-tree-node_active' : '' ),
			( isEmpty ? 'ck-inspector-tree-node_empty' : '' ),
			cssClass
		];

		return <div className={nodeClasses.join( ' ' )} onClick={this.handleClick}>
			<span className="ck-inspector-tree-node__name">
				{item.name}
				{this.getAttributes()}
			</span>
			<div className="ck-inspector-tree-node__content">
				{this.getChildren()}
			</div>
			{isEmpty ? '' : <span className="ck-inspector-tree-node__name">/{item.name}</span>}
		</div>;
	}

	getAttributes() {
		const attributes = [];
		const item = this.props.item;

		for ( const [ key, value ] of item.attributes ) {
			attributes.push( <TreeNodeAttribute key={key} name={key} value={value} /> );
		}

		return attributes;
	}
}

export class TreeTextNode extends TreeNode {
	render() {
		const classes = [
			'ck-inspector-tree-text',
			this.isActive ? 'ck-inspector-tree-node_active' : ''
		].join( ' ' );

		return <span className={classes} onClick={this.handleClick}>
			<span className="ck-inspector-tree-node__content">
				{this.props.showCompactText ? '' : this.getAttributes()}
				{this.props.showCompactText ? '' : '"' }
				{this.getChildren()}
				{this.props.showCompactText ? '' : '"' }
			</span>
		</span>;
	}

	getAttributes() {
		const attributes = [];
		const item = this.props.item;
		const presentation = item.presentation;
		const dontRenderAttributeValue = presentation && presentation.dontRenderAttributeValue;

		for ( const [ key, value ] of item.attributes ) {
			attributes.push( <TreeNodeAttribute key={key} name={key} value={value} dontRenderValue={dontRenderAttributeValue} /> );
		}

		return <span className="ck-inspector-tree-text__attributes">
			{attributes}
		</span>;
	}
}

export class TreeNodeAttribute extends Component {
	render() {
		let valueElement;
		const value = truncateString( this.props.value, MAX_ATTRIBUTE_VALUE_LENGTH );

		if ( !this.props.dontRenderValue ) {
			valueElement = <span className="ck-inspector-tree-node__attribute__value">
				{value}
			</span>;
		}

		return <span className="ck-inspector-tree-node__attribute">
			<span className="ck-inspector-tree-node__attribute__name" title={value}>
				{this.props.name}
			</span>
			{valueElement}
		</span>;
	}
}

export class TreeSelection extends Component {
	render() {
		return <span className="ck-inspector-tree__selection">
			{this.props.isEnd ? ']' : '['}
		</span>;
	}
}

export class TreePlainText extends Component {
	render() {
		return <span>{this.props.text}</span>;
	}
}

export class TreeComment extends Component {
	render() {
		return <span
			className="ck-inspector-tree-comment"
			dangerouslySetInnerHTML={{ __html: this.props.item.text }}></span>;
	}
}

function renderTreeItem( item, index, treeProps ) {
	if ( typeof item === 'string' ) {
		return <TreePlainText key={index} text={item} />;
	} else if ( item.type === 'element' ) {
		return <TreeElement key={index} item={item} {...treeProps} />;
	} else if ( item.type === 'text' ) {
		return <TreeTextNode key={index} item={item} {...treeProps} />;
	} else if ( item.type === 'comment' ) {
		return <TreeComment key={index} item={item} />;
	} else {
		return <TreeSelection key={index} isEnd={item.isEnd} />;
	}
}
