/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { defineConfig, mergeConfig } from 'vite';
import { getLastFromChangelog } from '@ckeditor/ckeditor5-dev-release-tools';
import { playwright } from '@vitest/browser-playwright';
import upath from 'upath';
import vitejsPluginReact from '@vitejs/plugin-react';
import vitePluginCssInjectedByJs from 'vite-plugin-css-injected-by-js';
import vitePluginSvgr from 'vite-plugin-svgr';

const OUT_DIR = 'build';

// `umd` is not supported for multiple entry points in Vite. Thus, we need to split the build into two separate runs.
// See: https://github.com/vitejs/vite/issues/14703
const MODES = {
	fullInspector: { name: 'CKEditorInspector', output: 'inspector.js', entry: 'ckeditorinspector.jsx' },
	miniInspector: { name: 'MiniCKEditorInspector', output: 'miniinspector.js', entry: 'minickeditorinspector.jsx' }
};

export default defineConfig( ( { mode: modeName } ) => {
	const commonConfig = {
		plugins: [
			vitejsPluginReact( {
				jsxRuntime: 'classic'
			} ),
			vitePluginSvgr( {
				include: '**/*.svg',
				exportAsDefault: true
			} )
		],
		define: {
			'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV ),
			CKEDITOR_INSPECTOR_VERSION: JSON.stringify( getLastFromChangelog() )
		},
		css: {
			transformer: 'lightningcss'
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
				provider: 'istanbul',
				reporter: [ 'text-summary', 'html', 'lcov', 'json' ],
				reportsDirectory: 'coverage',
				include: [
					'src/**/*.{js,jsx}'
				]
			}
		}
	};

	const mode = MODES[ modeName ];

	if ( !mode ) {
		return commonConfig;
	}

	const productionConfig = {
		plugins: [
			vitePluginCssInjectedByJs( {
				injectCodeFunction: ( cssCode, options = {} ) => {
					if ( typeof document === 'undefined' ) {
						return;
					}

					const elementStyle = document.createElement( 'style' );

					if ( options.styleId ) {
						elementStyle.id = options.styleId;
					}

					for ( const attribute of Object.keys( options.attributes || {} ) ) {
						elementStyle.setAttribute( attribute, options.attributes[ attribute ] );
					}

					elementStyle.setAttribute( 'data-cke-inspector', 'true' );

					elementStyle.appendChild( document.createTextNode( cssCode ) );
					document.head.appendChild( elementStyle );
				}
			} )
		],
		build: {
			emptyOutDir: false,
			outDir: OUT_DIR,
			lib: {
				formats: [ 'umd' ],
				name: mode.name,
				entry: upath.resolve( import.meta.dirname, 'src', mode.entry )
			},
			rolldownOptions: {
				output: {
					entryFileNames: mode.output
				}
			}
		}
	};

	return mergeConfig( commonConfig, productionConfig );
} );
