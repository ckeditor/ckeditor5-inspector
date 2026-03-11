#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { validateLicenseFiles } from '@ckeditor/ckeditor5-dev-license-checker';
import { parseArgs } from 'node:util';
import upath from 'upath';

const { fix, verbose } = parseArgs( {
	options: {
		'fix': { type: 'boolean', default: false },
		'verbose': { type: 'boolean', default: false }
	}
} ).values;

validateLicenseFiles( {
	fix,
	verbose,
	isPublic: true,
	shouldProcessRoot: true,
	projectName: 'CKEditor&nbsp;5 Inspector',
	rootDir: upath.resolve( import.meta.dirname, '..', '..' ),
	copyrightOverrides: [
		{
			packageName: '@ckeditor/ckeditor5-inspector',
			dependencies: [
				{
					name: 'copy-to-clipboard',
					license: 'MIT',
					copyright: 'Copyright (c) 2017 sudodoki <smd.deluzion@gmail.com>.'
				},
				{
					name: 'es-toolkit',
					license: 'MIT',
					copyright: 'Copyright (c) 2024 Viva Republica, Inc and Copyright OpenJS Foundation and other contributors.'
				},
				{
					name: 'javascript-stringify',
					license: 'MIT',
					copyright: 'Copyright (c) 2013 Blake Embrey (hello@blakeembrey.com).'
				},
				{
					name: 'react',
					license: 'MIT',
					copyright: 'Copyright (c) Facebook, Inc. and its affiliates.'
				},
				{
					name: 'react-dom',
					license: 'MIT',
					copyright: 'Copyright (c) Facebook, Inc. and its affiliates.'
				},
				{
					name: 'react-modal',
					license: 'MIT',
					copyright: 'Copyright (c) 2017 Ryan Florence.'
				},
				{
					name: 'react-redux',
					license: 'MIT',
					copyright: 'Copyright (c) 2015-present Dan Abramov.'
				},
				{
					name: 'react-rnd',
					license: 'MIT',
					copyright: 'Copyright (c) 2017 @bokuweb.'
				},
				{
					name: 'redux',
					license: 'MIT',
					copyright: 'Copyright (c) 2015-present Dan Abramov.'
				}
			]
		}
	]
} ).then( exitCode => process.exit( exitCode ) );
