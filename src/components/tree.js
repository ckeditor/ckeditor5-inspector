/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { stringifyAttributeValue } from './utils';
import './tree.css';

export default class Tree extends Component {
	constructor( props ) {
		super( props );
	}

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

		return <div className={`ck-inspector-tree${ this.props.showCompactText ? ' ck-inspector-tree_compact-text' : ''}`}>
			{treeContent}
		</div>;
	}
}

class TreeNode extends Component {
	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick( evt ) {
		this.props.config.onClick( evt, this.props.item.node );
	}

	render() {
		const item = this.props.item;
		const presentation = item.presentation;
		const dontClose = presentation && presentation.dontClose;
		const nodeClasses = [
			'ck-inspector-code',
			'ck-inspector-tree-node',
			( this.isActive ? 'ck-inspector-tree-node_active' : '' ),
			presentation && presentation.cssClass
		];

		return <div className={nodeClasses.join( ' ' )} onClick={this.handleClick}>
			<span className="ck-inspector-tree-node__name">
				{item.name}
				{this.getAttributes()}
			</span>
			<div className="ck-inspector-tree-node__content">
				{this.getChildren()}
			</div>
			{dontClose ? '' : <span className="ck-inspector-tree-node__name">/{item.name}</span>}
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

	getChildren() {
		return this.props.item.children.map( ( child, index ) => renderTreeItem( child, index, this.props.config ) );
	}

	get isActive() {
		return this.props.item.node === this.props.config.activeNode;
	}
}

class TreeText extends TreeNode {
	render() {
		const activeNodeClass = ( this.isActive ? 'ck-inspector-tree-node_active' : '' );

		if ( this.props.config.showCompactText ) {
			return <span className={'ck-inspector-tree-text ' + activeNodeClass} onClick={this.handleClick}>
				<span className="ck-inspector-tree-node__content">
					{this.getChildren()}
				</span>
			</span>;
		} else {
			return <span className={'ck-inspector-tree-text ' + activeNodeClass} onClick={this.handleClick}>
				<span className="ck-inspector-tree-node__content">
					{this.getAttributes()}
					&quot;{this.getChildren()}&quot;
				</span>
			</span>;
		}
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

class TreeNodeAttribute extends Component {
	render() {
		const value = stringifyAttributeValue( this.props.value );
		let valueElement;

		if ( !this.props.dontRenderValue ) {
			valueElement = <span className="ck-inspector-tree-node__attribute__value">{value}</span>;
		}

		return <span className="ck-inspector-tree-node__attribute">
			<span className="ck-inspector-tree-node__attribute__name" title={value}>{this.props.name}</span>
			{valueElement}
		</span>;
	}
}

function renderTreeItem( item, index, config ) {
	if ( typeof item === 'string' ) {
		return <span key={index}>{item}</span>
	} else if ( item.type === 'element' ) {
		return <TreeNode key={index} item={item} config={config} />;
	} else if ( item.type === 'text' ) {
		return <TreeText key={index} item={item} config={config} />;
	} else if ( item.type === 'selection' ) {
		return <span
			className="ck-inspector-tree__selection" key={index}>
				{item.isEnd ? ']' : '['}
		</span>;
	}
}
