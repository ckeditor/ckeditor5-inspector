/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { Component } from 'react';
import PropertyList from './propertylist';
import Button from './button';
import './objectinspector.css';

export default class ObjectInspector extends Component {
	render() {
		const content = [];

		for ( const list of this.props.lists ) {
			if ( list.items.length ) {
				content.push(
					<hr key={`${ list.name }-separator`} />,
					<h3 key={`${ list.name }-header`}>
						<a href={list.url} target="_blank" rel="noopener noreferrer">{list.name}</a>
						{list.buttons && list.buttons.map( ( button, index ) => {
							return <Button key={'button' + index} {...button} />;
						} )}
					</h3>,
					<PropertyList key={`${ list.name }-list`} items={list.items} />
				);
			}
		}

		return <div className="ck-inspector__object-inspector">
			<h2 className="ck-inspector-code">
				{this.props.header}
			</h2>
			{content}
		</div>;
	}
}
