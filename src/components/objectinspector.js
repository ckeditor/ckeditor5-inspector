/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React, { PureComponent } from 'react';
import PropertyList from './propertylist';
import Button from './button';
import './objectinspector.css';

export default class ObjectInspector extends PureComponent {
	render() {
		const content = [];

		for ( const list of this.props.lists ) {
			if ( !Object.keys( list.itemDefinitions ).length ) {
				continue;
			}

			content.push(
				<hr key={`${ list.name }-separator`} />,
				<h3 key={`${ list.name }-header`}>
					<a href={list.url} target="_blank" rel="noopener noreferrer">{list.name}</a>
					{list.buttons && list.buttons.map( ( button, index ) => {
						return <Button key={'button' + index} {...button} />;
					} )}
				</h3>,
				<PropertyList
					key={`${ list.name }-list`}
					name={list.name}
					itemDefinitions={list.itemDefinitions}
					presentation={list.presentation}
					onPropertyTitleClick={list.onPropertyTitleClick}
				/>
			);
		}

		return <div className="ck-inspector__object-inspector">
			<h2 className="ck-inspector-code">
				{this.props.header}
			</h2>
			{content}
		</div>;
	}
}
