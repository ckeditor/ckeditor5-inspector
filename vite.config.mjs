/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { defineConfig } from 'vite';
import { getLastFromChangelog } from '@ckeditor/ckeditor5-dev-release-tools';
import { parseArgs } from 'node:util';
import { playwright } from '@vitest/browser-playwright';
import rollupPluginLicense from 'rollup-plugin-license';
import upath from 'upath';
import vitejsPluginReact from '@vitejs/plugin-react';
import vitePluginCssInjectedByJs from 'vite-plugin-css-injected-by-js';
import vitePluginSvgr from 'vite-plugin-svgr';

const OUT_DIR = 'build';
const DEFAULT_VARIANT = 'inspector';

// We need a separate build for each inspector variant.
// See: https://github.com/vitejs/vite/issues/14703
const VARIANTS = {
	inspector: { name: 'CKEditorInspector', output: 'inspector.js', entry: 'ckeditorinspector.jsx' },
	mini: { name: 'MiniCKEditorInspector', output: 'miniinspector.js', entry: 'minickeditorinspector.jsx' }
};

const variant = getVariant();

export default defineConfig( {
	plugins: [
		vitejsPluginReact( {
			babel: {
				presets: [ '@babel/preset-react' ]
			},
			include: /\.[jt]sx(\?.*)?$/,
			jsxRuntime: 'classic'
		} ),
		vitePluginSvgr( {
			include: '**/*.svg',
			exportAsDefault: true
		} ),
		vitePluginCssInjectedByJs()
	],
	define: {
		'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV ),
		CKEDITOR_INSPECTOR_VERSION: JSON.stringify( getLastFromChangelog() )
	},
	css: {
		transformer: 'lightningcss'
	},
	build: {
		outDir: OUT_DIR,
		emptyOutDir: false,
		lib: {
			formats: [ 'umd' ],
			name: variant.name,
			fileName: variant.fileName,
			entry: upath.resolve( import.meta.dirname, 'src', variant.entry )
		},
		rollupOptions: {
			output: {
				entryFileNames: variant.output
			},
			plugins: [
				rollupPluginLicense( {
					thirdParty: {
						includePrivate: false,
						output: upath.join( OUT_DIR, `${ variant.output }.LICENSE.txt` )
					}
				} )
			]
		}
	},
	test: {
		browser: {
			provider: playwright(),
			enabled: true,
			headless: true,
			fileParallelism: false,
			screenshotFailures: false,
			instances: [
				{ browser: 'chromium' }
			]
		},
		include: [
			'tests/**/*.{js,jsx}'
		],
		exclude: [
			'tests/setup.js',
			'tests/utils/**'
		],
		mockReset: true,
		restoreMocks: true,
		setupFiles: [
			'tests/setup.js'
		],
		testTimeout: 15000,
		coverage: {
			provider: 'v8',
			reporter: [ 'text-summary', 'html', 'lcov', 'json' ],
			reportsDirectory: 'coverage',
			include: [
				'src/**/*.{js,jsx}'
			]
		}
	}
} );

function getVariant() {
	const args = [];
	const separatorIndex = process.argv.indexOf( '--' );

	if ( separatorIndex !== -1 ) {
		args.push( ...process.argv.slice( separatorIndex + 1 ) );
	}

	const parsedArgs = parseArgs( {
		args,
		options: {
			variant: {
				type: 'string',
				default: DEFAULT_VARIANT
			}
		}
	} );

	const variantName = parsedArgs.values.variant;

	if ( !( variantName in VARIANTS ) ) {
		throw new Error( `Unknown variant "${ variantName }". Available variants: ${ Object.keys( VARIANTS ).join( ', ' ) }.` );
	}

	return VARIANTS[ variantName ];
}
