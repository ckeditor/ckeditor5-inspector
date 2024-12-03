#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/* eslint-env node */

const getKarmaConfig = require( './utils/getkarmaconfig' );
const { Server, config } = require( 'karma' );

( async () => {
	const parsedConfig = config.parseConfig( null, await getKarmaConfig() );
	const server = new Server( parsedConfig );

	server.start();
} )();

