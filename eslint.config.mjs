/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
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
		extends: [
			eslintPluginReact.configs.flat.recommended,
			ckeditor5Config
		],

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
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
			'@stylistic/max-len': [ 'error', 140 ],
			'@stylistic/no-trailing-spaces': 'error',
			'ckeditor5-rules/license-header': [ 'error', {
				'headerLines': [
					'/**',
					' * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
					' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options',
					' */'
				]
			} ]
		}
	},
	{
		files: [
			'src/**/*.{js,mjs}',
			'tests/**/*.{js,mjs}'
		],

		languageOptions: {
			globals: {
				...globals.browser,
				CKEDITOR_INSPECTOR_VERSION: true
			}
		}
	},
	{
		files: [ 'tests/**/*.{js,mjs}' ],

		languageOptions: {
			globals: {
				...globals.node,
				mount: true,
				shallow: true
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
