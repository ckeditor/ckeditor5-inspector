/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

'use strict';

import path from 'upath';
import fs from 'fs';
import { ROOT_DIRECTORY } from './utils/constants.mjs';

// When installing a repository as a dependency, the `.git` directory does not exist.
// In such a case, husky should not attach its hooks as npm treats it as a package, not a git repository.
if ( fs.existsSync( path.join( ROOT_DIRECTORY, '.git' ) ) ) {
	const { default: husky } = await import( 'husky' );

	husky();
}
