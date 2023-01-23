/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setSchemaCurrentDefinitionName } from './data/actions';

import Tree from '../components/tree/tree';
import NavBox from '../components/navbox';

class SchemaTree extends Component {
	constructor( props ) {
		super( props );

		this.handleTreeClick = this.handleTreeClick.bind( this );
	}

	handleTreeClick( evt, currentSchemaDefinitionName ) {
		evt.persist();
		evt.stopPropagation();

		this.props.setSchemaCurrentDefinitionName( currentSchemaDefinitionName );
	}

	render() {
		return <NavBox>
			<Tree
				definition={this.props.treeDefinition}
				onClick={this.handleTreeClick}
				activeNode={this.props.currentSchemaDefinitionName}
			/>
		</NavBox>;
	}
}

const mapStateToProps = ( { schema: { treeDefinition, currentSchemaDefinitionName } } ) => {
	return { treeDefinition, currentSchemaDefinitionName };
};

const mapDispatchToProps = { setSchemaCurrentDefinitionName };

export default connect( mapStateToProps, mapDispatchToProps )( SchemaTree );
