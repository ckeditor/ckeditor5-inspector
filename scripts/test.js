#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

const getKarmaConfig = require( './utils/getkarmaconfig' );
const { Server: KarmaServer } = require( 'karma' );

const config = getKarmaConfig();

const server = new KarmaServer( config );

server.start();
