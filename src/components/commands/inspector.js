/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global console */

import React, { Component } from 'react';
import Panes from '../panes';
import Button from './../button';
import { PropertyList } from './../propertylist';
import '../inspector.css';

export default class Inspector extends Component {
	constructor( props ) {
		super( props );

		this.nodeInspectorRef = React.createRef();
		this.selectionInspectorRef = React.createRef();
	}

	update() {
		this.nodeInspectorRef.current.update();
	}

	render() {
		const panesDefinitions = {
			inspect: {
				label: 'Inspect',
				content: <CommandInspector
					editor={this.props.editor}
					inspectedCommandName={this.props.inspectedCommandName}
					ref={this.nodeInspectorRef}
				/>
			}
		};

		return <div className="ck-inspector__explorer">
			<Panes panesDefinitions={panesDefinitions} />
		</div>;
	}
}

class CommandInspector extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			inspectedCommandInfo: null
		};
	}

	update() {
		this.setState( {
			inspectedCommandInfo: getCommandInfo( this.props.editor, this.props.inspectedCommandName )
		} );
	}

	componentDidMount() {
		// When a node is selected in the tree and switching back from the selection tab.
		this.update();
	}

	render() {
		const info = this.state.inspectedCommandInfo;

		if ( !info ) {
			return <div className="ck-inspector-panes__content__empty-wrapper">
				<p>Select a command to inspect</p>
			</div>;
		}

		const content = [
			<h2 key="node-name" className="ck-inspector-code">
				<span>
					<a href={info.url} target="_blank" rel="noopener noreferrer"><b>{info.type}</b></a>:{info.name}
				</span>
				<Button type="exec" text="Execute command" onClick={() => this.props.editor.execute( info.name )} />
				<Button type="log" text="Log in console" onClick={() => console.log( info.command )} />
			</h2>,
			<hr key="props-separator" />,
			<h3 key="props-header">Properties</h3>,
			<PropertyList key="props-list" items={info.properties} />
		];

		return <div className="ck-inspector__object-inspector">{content}</div>;
	}
}

function getCommandInfo( editor, name ) {
	if ( !name ) {
		return null;
	}

	const command = editor.commands.get( name );

	return {
		type: 'Command',
		name: name,
		url: 'https://ckeditor.com/docs/ckeditor5/latest/api/module_core_command-Command.html',
		properties: [
			[ 'isEnabled', command.isEnabled ],
			[ 'value', command.value ]
		],
		command,
	};
}
