/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import globals from 'globals';
import { defineConfig } from 'eslint/config';
import ckeditor5Rules from 'eslint-plugin-ckeditor5-rules';
import ckeditor5Config from 'eslint-config-ckeditor5';
import eslintPluginReact from 'eslint-plugin-react';

export default defineConfig( [
	{
		ignores: [
			'build/**',
			'coverage/**',
			'release/**'
		]
	},
	{
		files: [
			'./*.{js,mjs}',
			'scripts/**/*.{js,mjs}',
			'scripts-tests/**/*.{js,mjs}',
			'src/**/*.{js,jsx,mjs}',
			'tests/**/*.{js,jsx,mjs}',
			'sample/**/*.{js,mjs}'
		],

		extends: [
			eslintPluginReact.configs.flat.recommended,
			ckeditor5Config
		],

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				CKEDITOR_INSPECTOR_VERSION: true
			}
		},

		linterOptions: {
			reportUnusedDisableDirectives: 'warn',
			reportUnusedInlineConfigs: 'warn'
		},

		plugins: {
			'ckeditor5-rules': ckeditor5Rules,
			'react': eslintPluginReact
		},

		settings: {
			react: {
				version: 'detect'
			}
		},

		rules: {
			'react/prop-types': 'off',
			'no-console': 'off',
			'ckeditor5-rules/license-header': [ 'error', {
				'headerLines': [
					'/**',
					' * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.',
					' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options',
					' */'
				]
			} ]
		}
	},
	{
		files: [ 'tests/**/*.{js,jsx,mjs}' ],

		languageOptions: {
			globals: {
				...globals.node
			}
		}
	},
	{
		files: [
			'*.{js,mjs}',
			'scripts/**/*.{js,mjs}'
		],

		languageOptions: {
			globals: {
				...globals.node
			}
		}
	}
] );
