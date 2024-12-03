/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import React, { Component } from 'react';
import './navbox.css';

export default class NavBox extends Component {
	render() {
		const children = Array.isArray( this.props.children ) ? this.props.children : [ this.props.children ];

		return <div className="ck-inspector-navbox">
			{ children.length > 1 ?
				<div className="ck-inspector-navbox__navigation">
					{children[ 0 ]}
				</div> :
				''
			}
			<div className="ck-inspector-navbox__content">
				{children[ children.length - 1 ]}
			</div>
		</div>;
	}
}
