/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { stringifyAttributeValue } from '../utils';
import Tree from '../tree';

export default class CommandsTree extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			commandStates: null,
		};
	}

	update() {
		const editor = this.props.editor;

		this.setState( {
			commandStates: getCommandStates( editor )
		} );
	}

	render() {
		return <div className="ck-inspector__document-tree">
			<div className="ck-inspector-panes">
				<div className="ck-inspector-panes__content">
					<Tree
						items={this.state.commandStates}
						onClick={this.props.onClick}
						showCompactText={this.state.showCompactText}
						activeNode={this.props.currentCommandName}
					/>
				</div>
			</div>
		</div>
	}
}

function getCommandStates( editor ) {
	const list = [];

	for ( const [ name, command ] of editor.commands ) {
		const attributes = [];

		if ( command.value ) {
			attributes.push( [ 'value', command.value ] )
		}

		list.push( {
			name,
			type: 'element',
			children: [],
			node: name,
			attributes: attributes,

			presentation: {
				dontClose: true,
				cssClass: [
					'ck-inspector-tree-node_tagless',
					command.isEnabled ? '' : 'ck-inspector-tree-node_disabled'
				].join( ' ' )
			}
		} );
	}

	return list.sort( ( a, b ) => 	a.name > b.name ? 1 : -1 );
}
