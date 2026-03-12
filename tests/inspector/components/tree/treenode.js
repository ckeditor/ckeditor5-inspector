/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

import TreeNode from '../../../../src/components/tree/treenode';
import { renderTreeNodeFromDefinition } from '../../../../src/components/tree/utils';

vi.mock( '../../../../src/components/tree/utils', () => ( {
	renderTreeNodeFromDefinition: vi.fn( ( definition, index, globalTreeProps ) => ( {
		definition,
		index,
		globalTreeProps
	} ) )
} ) );

describe( 'TreeNode', () => {
	beforeEach( () => {
		vi.clearAllMocks();
	} );

	function createTreeNode( props = {} ) {
		return new TreeNode( {
			...props,
			definition: {
				node: 'node',
				children: [],
				...( props.definition || {} )
			}
		} );
	}

	it( 'delegates click handling to global tree props', () => {
		const onClick = vi.fn();
		const treeNode = createTreeNode( {
			globalTreeProps: { onClick },
			definition: { node: 'active-node' }
		} );

		const event = { type: 'click' };

		treeNode.handleClick( event );

		expect( onClick ).toHaveBeenCalledWith( event, 'active-node' );
	} );

	it( 'renders children via renderTreeNodeFromDefinition()', () => {
		const globalTreeProps = { activeNode: 'node' };
		const childDefinitions = [
			{ type: 'text', text: 'a' },
			{ type: 'text', text: 'b' }
		];

		const treeNode = createTreeNode( {
			globalTreeProps,
			definition: {
				children: childDefinitions
			}
		} );

		const children = treeNode.getChildren();

		expect( renderTreeNodeFromDefinition ).toHaveBeenNthCalledWith( 1, childDefinitions[ 0 ], 0, globalTreeProps );
		expect( renderTreeNodeFromDefinition ).toHaveBeenNthCalledWith( 2, childDefinitions[ 1 ], 1, globalTreeProps );
		expect( children ).toEqual( [
			{ definition: childDefinitions[ 0 ], index: 0, globalTreeProps },
			{ definition: childDefinitions[ 1 ], index: 1, globalTreeProps }
		] );
	} );

	it( 'resolves global tree props and active state', () => {
		const activeTreeNode = createTreeNode( {
			globalTreeProps: { activeNode: 'node' }
		} );

		expect( activeTreeNode.definition.node ).toBe( 'node' );
		expect( activeTreeNode.globalTreeProps ).toEqual( { activeNode: 'node' } );
		expect( activeTreeNode.isActive ).toBe( true );

		const inactiveTreeNode = createTreeNode();

		expect( inactiveTreeNode.globalTreeProps ).toEqual( {} );
		expect( inactiveTreeNode.isActive ).toBe( false );
	} );

	it( 'updates only when props differ', () => {
		const treeNode = createTreeNode( {
			globalTreeProps: {
				activeNode: 'node'
			}
		} );

		expect( treeNode.shouldComponentUpdate( {
			definition: {
				node: 'node',
				children: []
			},
			globalTreeProps: {
				activeNode: 'node'
			}
		} ) ).toBe( false );

		expect( treeNode.shouldComponentUpdate( {
			definition: {
				node: 'other-node',
				children: []
			},
			globalTreeProps: {
				activeNode: 'node'
			}
		} ) ).toBe( true );
	} );
} );
