/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';

import Tree from '../components/tree/tree';
import Select from '../components/select';
import NavBox from '../components/navbox';
import Checkbox from '../components/checkbox';

export default class ViewTree extends Component {
	render() {
		return <NavBox>
			{[
				<div className="ck-inspector-tree__config" key="root-cfg">
					<Select
						id="view-root-select"
						label="Root"
						value={this.props.currentRootName}
						options={this.props.editorRoots.map( root => root.rootName )}
						onChange={evt => this.props.onRootChange( evt.target.value )}
					/>
				</div>,
				<div className="ck-inspector-tree__config" key="types-cfg">
					<Checkbox
						label="Show element types"
						id="view-show-types"
						isChecked={this.props.showTypes}
						onChange={this.props.onShowTypesChange}
					/>
				</div>
			]}
			<Tree
				definition={this.props.definition}
				textDirection={this.props.editor.locale.contentLanguageDirection}
				onClick={this.props.onClick}
				showCompactText="true"
				activeNode={this.props.currentEditorNode}
			/>
		</NavBox>;
	}
}
