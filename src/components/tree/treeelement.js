/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import isEqual from 'lodash.isequal';
import TreeNode from './treenode';
import TreeNodeAttribute from './treenodeattribute';
import TreePosition from './treeposition';

/**
 * A class which instances represent elements in the tree.
 */
export default class TreeElement extends TreeNode {
	render() {
		const definition = this.definition;
		const presentation = definition.presentation;
		const isEmpty = presentation && presentation.isEmpty;
		const cssClass = presentation && presentation.cssClass;
		const children = this.getChildren();
		const nodeClasses = [
			'ck-inspector-code',
			'ck-inspector-tree-node',
			( this.isActive ? 'ck-inspector-tree-node_active' : '' ),
			( isEmpty ? 'ck-inspector-tree-node_empty' : '' ),
			cssClass
		];

		const beforeNodeName = [];
		const afterNodeName = [];

		if ( definition.positionsBefore ) {
			definition.positionsBefore.forEach( ( position, index ) => {
				beforeNodeName.push( <TreePosition key={'position-before:' + index} definition={position} /> );
			} );
		}

		if ( definition.positionsAfter ) {
			definition.positionsAfter.forEach( ( position, index ) => {
				afterNodeName.push( <TreePosition key={'position-after:' + index} definition={position} /> );
			} );
		}

		if ( definition.positions ) {
			definition.positions.forEach( ( position, index ) => {
				children.push( <TreePosition key={'position' + index} definition={position} /> );
			} );
		}

		let nameToDisplay = definition.name;

		if ( this.globalTreeProps.showElementTypes ) {
			nameToDisplay = definition.elementType + ':' + nameToDisplay;
		}

		return <div className={nodeClasses.join( ' ' )} onClick={this.handleClick}>
			{beforeNodeName}
			<span className="ck-inspector-tree-node__name">
				<span className="ck-inspector-tree-node__name__bracket ck-inspector-tree-node__name__bracket_open" />
				{nameToDisplay}
				{this.getAttributes()}
				{isEmpty ? '' : <span className="ck-inspector-tree-node__name__bracket ck-inspector-tree-node__name__bracket_close" />}
			</span>
			<div className="ck-inspector-tree-node__content">
				{children}
			</div>
			{isEmpty ? '' :
				<span className="ck-inspector-tree-node__name ck-inspector-tree-node__name_close">
					<span className="ck-inspector-tree-node__name__bracket ck-inspector-tree-node__name__bracket_open" />
					/{nameToDisplay}
					<span className="ck-inspector-tree-node__name__bracket ck-inspector-tree-node__name__bracket_close" />
					{afterNodeName}
				</span>
			}
		</div>;
	}

	getAttributes() {
		const attributes = [];
		const definition = this.definition;

		for ( const [ key, value ] of definition.attributes ) {
			attributes.push( <TreeNodeAttribute key={key} name={key} value={value} /> );
		}

		return attributes;
	}

	shouldComponentUpdate( nextProps ) {
		return !isEqual( this.props, nextProps );
	}
}
