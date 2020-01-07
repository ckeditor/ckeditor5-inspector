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

		return <dl className="ck-inspector-property-list ck-inspector-code">
			{this.props.items.map( ( [ name, value, subProperties ] ) => {
				const hasSubProperties = subProperties && subProperties.length;

				value = truncateString( String( value ), MAX_PROPERTY_VALUE_LENGTH );

				const rendered = [
					<PropertyTitle
						key={`${ this.props.name }-name`}
						name={name}
						listUid={listUid}
						canCollapse={hasSubProperties}
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
					rendered.push(
						<PropertyList key={`${ name }-subProperties`} items={subProperties} />
					);
				}

				return rendered;
			} )}
		</dl>;
	}
}

class PropertyTitle extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			isCollapsed: true
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

		if ( this.props.canCollapse ) {
			classNames.push( 'ck-inspector-property-list__title_collapsible' );
			classNames.push( 'ck-inspector-property-list__title_' + ( this.state.isCollapsed ? 'collapsed' : 'expanded' ) );
		}

		return <dt className={classNames.join( ' ' ).trim()}>
			{ this.props.canCollapse ? <button type="button" onClick={this.handleCollapsedChange}>Toggle</button> : false }
			<label htmlFor={`${ this.props.listUid }-${ this.props.name }-input`}>
				{this.props.name}
			</label>:
		</dt>;
	}
}
