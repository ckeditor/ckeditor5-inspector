/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { PureComponent, Component } from 'react';
import isEqual from 'lodash.isequal';
import { truncateString } from './utils';
import './propertylist.css';

const MAX_PROPERTY_VALUE_LENGTH = 2000;

export default class PropertyList extends Component {
	render() {
		const expandCollapsibles = this.props.presentation && this.props.presentation.expandCollapsibles;
		const children = [];

		for ( const name in this.props.itemDefinitions ) {
			const definition = this.props.itemDefinitions[ name ];
			const { subProperties, presentation = {} } = definition;
			const hasSubProperties = subProperties && Object.keys( subProperties ).length;
			const value = truncateString( String( definition.value ), MAX_PROPERTY_VALUE_LENGTH );

			const itemChildren = [
				<PropertyTitle
					key={`${ this.props.name }-${ name }-name`}
					name={name}
					listUid={this.props.name}
					canCollapse={hasSubProperties}
					colorBox={presentation.colorBox}
					expandCollapsibles={expandCollapsibles}
					onClick={this.props.onPropertyTitleClick}
					title={definition.title}
				/>,
				<dd key={`${ this.props.name }-${ name }-value`}>
					<input
						id={`${ this.props.name }-${ name }-value-input`}
						type="text"
						value={value}
						readOnly={true}
					/>
				</dd>
			];

			if ( hasSubProperties ) {
				itemChildren.push(
					<PropertyList
						name={`${ this.props.name }-${ name }`}
						key={`${ this.props.name }-${ name }`}
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

	shouldComponentUpdate( nextProps ) {
		return !isEqual( this.props, nextProps );
	}
}

class PropertyTitle extends PureComponent {
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

		if ( this.props.onClick ) {
			classNames.push( 'ck-inspector-property-list__title_clickable' );
		}

		return <dt className={classNames.join( ' ' ).trim()}>
			{collapseButton}
			{colorBox}
			<label
				htmlFor={`${ this.props.listUid }-${ this.props.name }-value-input`}
				onClick={this.props.onClick ? () => this.props.onClick( this.props.name ) : null}
				title={this.props.title}
			>
				{this.props.name}
			</label>:
		</dt>;
	}
}
