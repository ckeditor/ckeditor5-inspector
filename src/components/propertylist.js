/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import { stringify } from './utils';
import './propertylist.css';

export class PropertyList extends Component {
	constructor( props ) {
		super( props );
	}

	render() {
		const listUid = Math.random().toString(36).substring(7);

		return <dl className="ck-inspector-property-list ck-inspector-code">
			{this.props.items.map( ( [ name, value ] ) => {
				value = stringify( value );

				let valueClass = '';
				if ( value === 'true' ) {
					valueClass = 'ck-inspector-property-list__value_true';
				} else if ( value === 'false' ) {
					valueClass = 'ck-inspector-property-list__value_false';
				} else if ( value === 'undefined' ) {
					valueClass = 'ck-inspector-property-list__value_undefined';
				}

				return [
					<dt key={name + '-name'}>
						<label htmlFor={listUid + '-' + name + '-input'}>{name}</label>:
					</dt>,
					<dd key={name + '-value'}>
						<input
							id={listUid + '-' + name + '-input'}
							type="text"
							className={valueClass}
							value={value}
							readOnly={true}
						/>
					</dd>
				];
			})}
		</dl>;
	}
}
