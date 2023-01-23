/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';

import TreeElement from './treeelement';
import TreeTextNode from './treetextnode';
import TreeComment from './treecomment';

export function renderTreeNodeFromDefinition( definition, index, globalTreeProps ) {
	if ( definition.type === 'element' ) {
		return <TreeElement key={index} definition={definition} globalTreeProps={globalTreeProps} />;
	} else if ( definition.type === 'text' ) {
		return <TreeTextNode key={index} definition={definition} globalTreeProps={globalTreeProps} />;
	} else if ( definition.type === 'comment' ) {
		return <TreeComment key={index} definition={definition} />;
	}
}
