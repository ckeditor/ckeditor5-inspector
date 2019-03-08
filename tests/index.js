/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* global require */

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai'
import chaiEnzyme from 'chai-enzyme'

Enzyme.configure( {
	adapter: new Adapter()
} );

chai.use( chaiEnzyme() );

const testsContext = require.context( '.', true, /\.js$/ );
testsContext.keys().forEach( testsContext );
