/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global document, window, console */

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Button from '../../../src/components/button';

describe( '<Button />', () => {
	it( 'renders a button', () => {
		const wrapper = shallow( <Button /> );

		expect( wrapper.find( '.ck-inspector-button' ) ).to.have.length( 1 );
	} );
} );
