#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

const getKarmaConfig = require( './utils/getkarmaconfig' );
const { Server, config } = require( 'karma' );

( async () => {
	const parsedConfig = config.parseConfig( null, await getKarmaConfig() );
	const server = new Server( parsedConfig );

	server.start();
} )();

