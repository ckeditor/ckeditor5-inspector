/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Pane from '../components/pane';
import Tabs from '../components/tabs';
import SidePane from '../components/sidepane';

import SchemaTree from './tree';
import SchemaDefinitionInspector from './schemadefinitioninspector';

class SchemaPane extends Component {
	render() {
		if ( !this.props.currentEditorName ) {
			return <Pane isEmpty="true">
				<p>Nothing to show. Attach another editor instance to start inspecting.</p>
			</Pane>;
		}

		return <Pane splitVertically="true">
			<SchemaTree />
			<SidePane>
				<Tabs activeTab="Inspect">
					<SchemaDefinitionInspector label="Inspect" />
				</Tabs>
			</SidePane>
		</Pane>;
	}
}

const mapStateToProps = ( { currentEditorName } ) => {
	return { currentEditorName };
};

export default connect( mapStateToProps )( SchemaPane );
