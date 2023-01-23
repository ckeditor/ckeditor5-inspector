/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setCommandsCurrentCommandName } from './data/actions';

import Tree from '../components/tree/tree';
import NavBox from '../components/navbox';

class CommandTree extends Component {
	constructor( props ) {
		super( props );

		this.handleTreeClick = this.handleTreeClick.bind( this );
	}

	handleTreeClick( evt, currentCommandName ) {
		evt.persist();
		evt.stopPropagation();

		this.props.setCommandsCurrentCommandName( currentCommandName );
	}

	render() {
		return <NavBox>
			<Tree
				definition={this.props.treeDefinition}
				onClick={this.handleTreeClick}
				activeNode={this.props.currentCommandName}
			/>
		</NavBox>;
	}
}

const mapStateToProps = ( { commands: { treeDefinition, currentCommandName } } ) => {
	return { treeDefinition, currentCommandName };
};

const mapDispatchToProps = { setCommandsCurrentCommandName };

export default connect( mapStateToProps, mapDispatchToProps )( CommandTree );
