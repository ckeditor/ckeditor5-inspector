/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import React from 'react';
import {
	TreeSelection
} from '../../../src/components/tree';

describe( '<TreeSelection />', () => {
	let wrapper;

	afterEach( () => {
		wrapper.unmount();
	} );

	it( 'is rendered (start)', () => {
		wrapper = mount( <TreeSelection /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree__selection' );
		expect( wrapper.text() ).to.equal( '[' );
	} );

	it( 'is rendered (end)', () => {
		wrapper = mount( <TreeSelection isEnd={true} /> );

		expect( wrapper ).to.have.className( 'ck-inspector-tree__selection' );
		expect( wrapper.text() ).to.equal( ']' );
	} );
} );
