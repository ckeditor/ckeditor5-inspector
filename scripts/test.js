#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

const getKarmaConfig = require( './utils/getkarmaconfig' );
const { Server, config } = require( 'karma' );

const parsedConfig = config.parseConfig( null, getKarmaConfig() );
const server = new Server( parsedConfig );

server.start();
