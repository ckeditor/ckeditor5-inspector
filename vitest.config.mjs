/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import react from '@vitejs/plugin-react';
import { getLastFromChangelog } from '@ckeditor/ckeditor5-dev-release-tools';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import svgr from 'vite-plugin-svgr';

export default defineConfig( {
	esbuild: {
		loader: 'jsx',
		include: /\.jsx?(\?.*)?$/
	},
	plugins: [
		react( {
			babel: {
				presets: [ '@babel/preset-react' ]
			},
			include: /\.[jt]sx?(\?.*)?$/,
			jsxRuntime: 'classic'
		} ),
		svgr( {
			include: '**/*.svg',
			exportAsDefault: true
		} )
	],
	optimizeDeps: {
		esbuildOptions: {
			loader: {
				'.js': 'jsx'
			}
		}
	},
	define: {
		CKEDITOR_INSPECTOR_VERSION: JSON.stringify( getLastFromChangelog() )
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
		globals: true,
		include: [
			'tests/**/*.js'
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
				'src/**/*.js'
			]
		}
	}
} );
