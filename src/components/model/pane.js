/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import ModelTree from './tree';
import ModelInspector from './inspector';
export default class ModelPane extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			editor: null,
			editorRoots: null,
			currentRootName: null,
			currentEditorNode: null
		};

		this.treeRef = React.createRef();
		this.inspectorRef = React.createRef();

		this.handleTreeClick = this.handleTreeClick.bind( this );
		this.handleRootChange = this.handleRootChange.bind( this );
		this.syncPaneWithEditor = this.syncPaneWithEditor.bind( this );
	}

	componentDidUpdate( prevProps ) {
		if ( prevProps && prevProps.editor ) {
			prevProps.editor.model.document.off( 'change', this.syncPaneWithEditor );
		}

		this.startListeningToEditor();
	}

	componentDidMount() {
		this.startListeningToEditor();
	}

	startListeningToEditor() {
		if ( this.props.editor ) {
			this.props.editor.model.document.on( 'change', this.syncPaneWithEditor );
			this.syncPaneWithEditor();
		}
	}

	handleTreeClick( evt, currentEditorNode ) {
		evt.persist();
		evt.stopPropagation();

		this.setState( { currentEditorNode }, () => {
			this.syncPaneWithEditor();

			// Double click on a tree element should open the inspector.
			if ( evt.detail == 2 ) {
				this.inspectorRef.current.setActivePane( 'inspect' );
			}
		} );
	}

	handleRootChange( currentRootName ) {
		this.setState( { currentRootName }, () => {
			this.syncPaneWithEditor();
		} );
	}

	syncPaneWithEditor() {
		this.treeRef.current.update();
		this.inspectorRef.current.update();
	}

	componentWillUnmount() {
		if ( this.props.editor ) {
			this.props.editor.model.document.off( 'change', this.syncPaneWithEditor );
		}
	}

	render() {
		if ( !this.props.editor ) {
			return <div className="ck-inspector-panes__content__empty-wrapper">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</div>;
		}

		return [
			<ModelTree
				currentEditorNode={this.state.currentEditorNode}
				currentRootName={this.state.currentRootName}
				editor={this.props.editor}
				editorRoots={this.state.editorRoots}
				key="tree"
				onClick={this.handleTreeClick}
				onRootChange={this.handleRootChange}
				ref={this.treeRef}
			/>,
			<ModelInspector
				currentRootName={this.state.currentRootName}
				editor={this.props.editor}
				inspectedNode={this.state.currentEditorNode}
				key="explorer"
				ref={this.inspectorRef}
			/>
		];
	}

	static getDerivedStateFromProps( props, state ) {
		if ( props.editor !== state.editor ) {
			return {
				editor: props.editor,
				editorRoots: getEditorRoots( props.editor ),
				currentRootName: getCurrentRootName( props.editor ),
				currentEditorNode: null
			};
		} else {
			return null;
		}
	}
}

function getEditorRoots( editor ) {
	if ( !editor ) {
		return null;
	}

	return [ ...editor.model.document.roots ];
}

function getCurrentRootName( editor ) {
	if ( !editor ) {
		return null;
	}

	if ( editor.model.document.roots.has( 'main' ) ) {
		return 'main';
	} else {
		return getEditorRoots( editor )[ 0 ].rootName;
	}
}
