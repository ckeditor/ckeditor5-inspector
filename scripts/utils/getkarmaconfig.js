/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

'use strict';

const path = require( 'path' );
const options = parseArguments( process.argv.slice( 2 ) );

module.exports = async function getKarmaConfig() {
	const basePath = process.cwd();
	const coverageDir = path.join( basePath, 'coverage' );

	const webpackConfig = ( await import( '../../webpack.config.mjs' ) ).default( {}, {
		mode: 'development'
	} );

	delete webpackConfig.entry;
	delete webpackConfig.output;

	const karmaConfig = {
		basePath,

		frameworks: [ 'mocha', 'sinon', 'webpack' ],

		files: [
			'tests/index.js'
		],

		preprocessors: {
			'tests/index.js': [ 'webpack' ]
		},

		webpack: webpackConfig,

		webpackMiddleware: {
			noInfo: true,
			stats: 'minimal'
		},

		reporters: [ options.reporter ],

		port: 9876,

		colors: true,

		logLevel: 'INFO',

		browsers: getBrowsers( options.browsers ),

		customLaunchers: {
			CHROME_CI: {
				base: 'Chrome',
				flags: [ '--no-sandbox', '--disable-background-timer-throttling' ]
			},
			CHROME_LOCAL: {
				base: 'Chrome',
				flags: [ '--disable-background-timer-throttling' ]
			}
		},

		singleRun: true,

		concurrency: Infinity,

		browserNoActivityTimeout: 0,

		mochaReporter: {
			showDiff: true
		}
	};

	if ( options.watch ) {
		karmaConfig.autoWatch = true;
		karmaConfig.singleRun = false;
	}

	if ( options.coverage ) {
		karmaConfig.reporters.push( 'coverage' );

		karmaConfig.coverageReporter = {
			reporters: [
				// Prints a table after tests result.
				{
					type: 'text-summary'
				},
				// Generates HTML tables with the results.
				{
					type: 'html',
					dir: coverageDir,
					subdir: '.'
				},
				// Generates "lcov.info" file. It's used by external code coverage services.
				{
					type: 'lcovonly',
					dir: coverageDir,
					subdir: '.'
				},
				{
					type: 'json',
					dir: coverageDir,
					subdir: '.'
				}
			]
		};

		const jsRule = webpackConfig.module.rules.find( ( { test } ) => test.test( '.js' ) );
		jsRule.options.plugins.push( [
			'babel-plugin-istanbul', {
				include: [
					'src'
				],
				exclude: [
					'node_modules'
				]
			}
		] );
	}

	if ( options.sourceMap ) {
		karmaConfig.preprocessors[ 'tests/**/*.js' ].push( 'sourcemap' );
		karmaConfig.preprocessors[ 'tests/**/*.jsx' ].push( 'sourcemap' );

		webpackConfig.devtool = 'inline-source-map';
	}

	return karmaConfig;
};

/**
 * Returns the value of Karma's browser option.
 *
 * @param {Array.<String>} browsers
 * @returns {Array.<String>|null}
 */
function getBrowsers( browsers ) {
	if ( !browsers ) {
		return null;
	}

	return browsers.map( browser => {
		if ( browser !== 'Chrome' ) {
			return browser;
		}

		return process.env.CI ? 'CHROME_CI' : 'CHROME_LOCAL';
	} );
}

/**
 * @param {Array.<String>} args CLI arguments and options.
 * @returns {Object} options
 * @returns {Array.<String>} options.browsers Browsers that will be used to run tests.
 * @returns {String} options.reporter A reporter that will presents tests results.
 * @returns {Boolean} options.watch Whether to watch the files.
 * @returns {Boolean} options.coverage Whether to generate code coverage.
 * @returns {Boolean} options.sourceMap Whether to add source maps.
 */
function parseArguments( args ) {
	const minimist = require( 'minimist' );

	const config = {
		string: [
			'browsers',
			'reporter'
		],

		boolean: [
			'watch',
			'coverage',
			'source-map'
		],

		alias: {
			b: 'browsers',
			c: 'coverage',
			r: 'reporter',
			s: 'source-map',
			w: 'watch'
		},

		default: {
			browsers: 'Chrome',
			reporter: 'mocha',
			watch: false,
			coverage: false,
			'source-map': false
		}
	};

	const options = minimist( args, config );

	options.sourceMap = options[ 'source-map' ];
	options.browsers = options.browsers.split( ',' );

	// Delete all aliases because we don't want to use them in the code.
	// They are useful when calling command but useless after that.
	for ( const alias of Object.keys( config.alias ) ) {
		delete options[ alias ];
	}

	return options;
}
