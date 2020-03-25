/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	stringify,
	stringifyPropertyList
} from '../../components/utils';

export function getEditorCommandDefinition( { currentEditor }, currentCommandName ) {
	if ( !currentCommandName ) {
		return null;
	}

	const command = currentEditor.commands.get( currentCommandName );

	return {
		currentCommandName,
		type: 'Command',
		url: 'https://ckeditor.com/docs/ckeditor5/latest/api/module_core_command-Command.html',
		properties: stringifyPropertyList( {
			isEnabled: {
				value: command.isEnabled
			},
			value: {
				value: command.value
			}
		} ),
		command
	};
}

export function getCommandsTreeDefinition( { currentEditor } ) {
	const list = [];

	for ( const [ name, command ] of currentEditor.commands ) {
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
