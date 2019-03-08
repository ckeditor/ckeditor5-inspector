/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import Panes from '../../../src/components/panes';

describe( '<Panes />', () => {
	it( 'renders panes', () => {
		const wrapper = shallow( <Panes /> );

		expect( wrapper.first() ).to.have.className( 'ck-inspector-panes' );
		expect( wrapper.first().first() ).to.have.className( 'ck-inspector-panes__navigation' );
		expect( wrapper.first().last() ).to.have.className( 'ck-inspector-panes__content' );
	} );
} );
