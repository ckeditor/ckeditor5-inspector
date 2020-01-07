/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import Tree from '../tree';
import NavBox from '../navbox';
import editorEventObserver from '../editorobserver';
import { stringify } from '../utils';
class CommandTree extends Component {
	editorEventObserverConfig( props ) {
		return {
			target: props.editor.model.document,
			event: 'change'
		};
	}

	render() {
		return <NavBox>
			<Tree
				items={this.getCommandStates()}
				onClick={this.props.onClick}
				activeNode={this.props.currentCommandName}
			/>
		</NavBox>;
	}

	getCommandStates() {
		const editor = this.props.editor;
		const list = [];

		for ( const [ name, command ] of editor.commands ) {
			const attributes = [];

			if ( command.value !== undefined ) {
				attributes.push( [ 'value', stringify( command.value, false ) ] );
			}

			list.push( {
				name,
				type: 'element',
				children: [],
				node: name,
				attributes,

				presentation: {
					isEmpty: true,
					cssClass: [
						'ck-inspector-tree-node_tagless',
						command.isEnabled ? '' : 'ck-inspector-tree-node_disabled'
					].join( ' ' )
				}
			} );
		}

		return list.sort( ( a, b ) => a.name > b.name ? 1 : -1 );
	}
}

export default editorEventObserver( CommandTree );
