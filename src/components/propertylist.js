/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
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
			{this.props.items.map( ( [ name, value ] ) => {
				value = truncateString( String( value ), MAX_PROPERTY_VALUE_LENGTH );

				return [
					<dt key={`${ name }-name`}>
						<label htmlFor={`${ listUid }-${ name }-input`}>
							{name}
						</label>:
					</dt>,
					<dd key={`${ name }-value`}>
						<input
							id={`${ listUid }-${ name }-input`}
							type="text"
							value={value}
							readOnly={true}
						/>
					</dd>
				];
			} )}
		</dl>;
	}
}
