/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import http from 'node:http';
import handler from 'serve-handler';
import { styleText } from 'node:util';

const DEFAULT_PORT = 3000;
const ROOT_DIRECTORY = '.';
const SAMPLE_DIRECTORY = '/sample';

const server = http.createServer( ( request, response ) => {
	return handler( request, response, {
		public: ROOT_DIRECTORY
	} );
} );

const port = await listenOnFirstFreePort( server, DEFAULT_PORT );
const sampleUrl = `http://localhost:${ port }${ SAMPLE_DIRECTORY }`;
const label = styleText( [ 'bold', 'green' ], 'Visit samples at' );
const highlightedUrl = styleText( [ 'underline', 'cyan' ], sampleUrl );

console.log( `${ label } ${ highlightedUrl }` );

setupGracefulShutdown( server );

/**
 * @param {http.Server} server
 * @param {number} initialPort
 * @returns {Promise<number>}
 */
function listenOnFirstFreePort( server, initialPort ) {
	let port = initialPort;

	return new Promise( ( resolve, reject ) => {
		server.on( 'error', onListenError );
		tryListen();

		function tryListen() {
			server.listen( port, () => {
				server.off( 'error', onListenError );
				resolve( port );
			} );
		}

		function onListenError( error ) {
			if ( error?.code === 'EADDRINUSE' ) {
				port++;
				tryListen();

				return;
			}

			reject( error );
		}
	} );
}

/**
 * @param {http.Server} server
 */
function setupGracefulShutdown( server ) {
	const shutdown = () => {
		server.close( () => {
			process.exit( 0 );
		} );
	};

	process.on( 'SIGINT', shutdown );
	process.on( 'SIGTERM', shutdown );
}
