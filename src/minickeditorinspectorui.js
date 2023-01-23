/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';

import Tree from './components/tree/tree';
import {
	getEditorModelRanges,
	getEditorModelMarkers,
	getEditorModelTreeDefinition
} from './model/data/utils';
import {
	getEditorViewRanges,
	getEditorViewTreeDefinition
} from './view/data/utils';

import './ckeditorinspectorui.css';
import './minickeditorinspectorui.css';

export default class MiniCKEditorInspectorUI extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			...getTreeDefinitions( this.props.editor )
		};
	}

	render() {
		return <div className="ck-inspector ck-mini-inspector">
			<Tree
				definition={this.state.modelTreeDefinition}
				textDirection="ltr"
				onClick={() => {}}
				showCompactText={false}
				activeNode={null}
			/>
			<Tree
				definition={this.state.viewTreeDefinition}
				textDirection="ltr"
				onClick={() => {}}
				showCompactText="true"
				showElementTypes={false}
				activeNode={null}
			/>
		</div>;
	}

	componentDidMount() {
		const updateTreeDefinitions = () => {
			this.setState( {
				...getTreeDefinitions( this.props.editor )
			} );
		};

		this.props.editor.model.document.on( 'change', updateTreeDefinitions, {
			priority: 'lowest'
		} );

		this.props.editor.editing.view.on( 'render', updateTreeDefinitions, {
			priority: 'lowest'
		} );
	}
}

function getTreeDefinitions( editor ) {
	const currentRootName = 'main';
	const modelRanges = getEditorModelRanges( editor, currentRootName );
	const modelMarkers = getEditorModelMarkers( editor, currentRootName );
	const modelTreeDefinition = getEditorModelTreeDefinition( {
		currentEditor: editor,
		currentRootName,
		ranges: modelRanges,
		markers: modelMarkers
	} );

	const viewRanges = getEditorViewRanges( editor, currentRootName );
	const viewTreeDefinition = getEditorViewTreeDefinition( {
		currentEditor: editor,
		currentRootName,
		ranges: viewRanges
	} );

	return {
		modelTreeDefinition,
		viewTreeDefinition
	};
}
