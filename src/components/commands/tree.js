/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { Tree } from '../tree';
import editorEventObserver from '../editorobserver';
import { stringify } from '../utils';
class CommandsTree extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.model.document,
			event: 'change'
		};
	}

	render() {
		const states = this.getCommandStates();

		return <div className="ck-inspector__document-tree">
			<div className="ck-inspector-panes">
				<div className="ck-inspector-panes__content">
					<Tree
						items={states}
						onClick={this.props.onClick}
						activeNode={this.props.currentCommandName}
					/>
				</div>
			</div>
		</div>
	}

	getCommandStates() {
		const editor = this.props.editor;
		const list = [];

		for ( const [ name, command ] of editor.commands ) {
			const attributes = [];

			if ( command.value !== undefined ) {
				attributes.push( [ 'value', stringify( command.value, false ) ] )
			}

			list.push( {
				name,
				type: 'element',
				children: [],
				node: name,
				attributes: attributes,

				presentation: {
					isEmpty: true,
					cssClass: [
						'ck-inspector-tree-node_tagless',
						command.isEnabled ? '' : 'ck-inspector-tree-node_disabled'
					].join( ' ' )
				}
			} );
		}

		return list.sort( ( a, b ) => 	a.name > b.name ? 1 : -1 );
	}
}

export default editorEventObserver( CommandsTree );
