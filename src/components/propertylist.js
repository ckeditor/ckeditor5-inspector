/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { uid, truncateString } from './utils';
import './propertylist.css';

const MAX_PROPERTY_VALUE_LENGTH = 2000;

export default class PropertyList extends Component {
	render() {
		const listUid = uid();
		const expandCollapsibles = this.props.presentation && this.props.presentation.expandCollapsibles;
		const children = [];

		for ( const name in this.props.itemDefinitions ) {
			const definition = this.props.itemDefinitions[ name ];
			const { subProperties, presentation = {} } = definition;
			const hasSubProperties = subProperties && Object.keys( subProperties ).length;
			const value = truncateString( String( definition.value ), MAX_PROPERTY_VALUE_LENGTH );

			const itemChildren = [
				<PropertyTitle
					key={`${ this.props.name }-name`}
					name={name}
					listUid={listUid}
					canCollapse={hasSubProperties}
					colorBox={presentation.colorBox}
					expandCollapsibles={expandCollapsibles}
				/>,
				<dd key={`${ name }-value`}>
					<input
						id={`${ listUid }-${ name }-input`}
						type="text"
						value={value}
						readOnly={true}
					/>
				</dd>
			];

			if ( hasSubProperties ) {
				itemChildren.push(
					<PropertyList
						key={`${ name }-subProperties`}
						itemDefinitions={subProperties}
						presentation={this.props.presentation}
					/>
				);
			}

			children.push( itemChildren );
		}

		return <dl className="ck-inspector-property-list ck-inspector-code">
			{children}
		</dl>;
	}
}

class PropertyTitle extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isCollapsed: !this.props.expandCollapsibles
		};

		this.handleCollapsedChange = this.handleCollapsedChange.bind( this );
	}

	handleCollapsedChange() {
		this.setState( {
			isCollapsed: !this.state.isCollapsed
		} );
	}

	render() {
		const classNames = [ 'ck-inspector-property-list__title' ];
		let collapseButton, colorBox;

		if ( this.props.canCollapse ) {
			classNames.push( 'ck-inspector-property-list__title_collapsible' );
			classNames.push( 'ck-inspector-property-list__title_' + ( this.state.isCollapsed ? 'collapsed' : 'expanded' ) );
			collapseButton = <button type="button" onClick={this.handleCollapsedChange}>Toggle</button>;
		}

		if ( this.props.colorBox ) {
			colorBox = <span className="ck-inspector-property-list__title__color-box" style={{ background: this.props.colorBox }}></span>;
		}

		return <dt className={classNames.join( ' ' ).trim()}>
			{collapseButton}
			{colorBox}
			<label htmlFor={`${ this.props.listUid }-${ this.props.name }-input`}>
				{this.props.name}
			</label>:
		</dt>;
	}
}
