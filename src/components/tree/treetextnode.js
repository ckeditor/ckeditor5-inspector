/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';

import TreeNode from './treenode';
import TreeNodeAttribute from './treenodeattribute';
import TreePosition from './treeposition';

/**
 * A class which instances represent text in the tree.
 */
export default class TreeTextNode extends TreeNode {
	render() {
		const definition = this.definition;
		const classes = [
			'ck-inspector-tree-text',
			this.isActive ? 'ck-inspector-tree-node_active' : ''
		].join( ' ' );

		let nodeText = this.definition.text.replace( /\s/g, '·' );

		if ( definition.positions.length ) {
			nodeText = nodeText.split( '' );

			definition.positions
				.sort( ( posA, posB ) => {
					if ( posA.offset < posB.offset ) {
						return -1;
					} else if ( posA.offset === posB.offset ) {
						return 0;
					} else {
						return 1;
					}
				} )
				.reverse()
				.forEach( ( position, index ) => {
					nodeText.splice(
						position.offset - definition.startOffset,
						0,
						<TreePosition key={'position' + index} definition={position} />
					);
				} );
		}

		const children = [ nodeText ];

		definition.positionsBefore.forEach( ( position, index ) => {
			children.unshift( <TreePosition key={'position-before:' + index} definition={position} /> );
		} );

		definition.positionsAfter.forEach( ( position, index ) => {
			children.push( <TreePosition key={'position-after:' + index} definition={position} /> );
		} );

		return <span className={classes} onClick={this.handleClick}>
			<span className="ck-inspector-tree-node__content">
				{this.globalTreeProps.showCompactText ? '' : this.getAttributes()}
				{this.globalTreeProps.showCompactText ? '' : '"' }
				{children}
				{this.globalTreeProps.showCompactText ? '' : '"' }
			</span>
		</span>;
	}

	getAttributes() {
		const attributes = [];
		const definition = this.definition;
		const presentation = definition.presentation;
		const dontRenderAttributeValue = presentation && presentation.dontRenderAttributeValue;

		for ( const [ key, value ] of definition.attributes ) {
			attributes.push( <TreeNodeAttribute key={key} name={key} value={value} dontRenderValue={dontRenderAttributeValue} /> );
		}

		return <span className="ck-inspector-tree-text__attributes">
			{attributes}
		</span>;
	}
}
