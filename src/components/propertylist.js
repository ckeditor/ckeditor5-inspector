/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { uid } from './utils';
import './propertylist.css';

export default class PropertyList extends Component {
	render() {
		const listUid = uid();

		return <dl className="ck-inspector-property-list ck-inspector-code">
			{this.props.items.map( ( [ name, value ] ) => {
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
							value={String( value )}
							readOnly={true}
						/>
					</dd>
				];
			})}
		</dl>;
	}
}
