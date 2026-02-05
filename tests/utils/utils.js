/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import CKEditorInspector from '../../src/ckeditorinspector';

export function assertTreeItems( items, expected ) {
	if ( expected.length !== items.length ) {
		throw new Error( 'number of items should match' );
	}

	for ( let expectedItemIndex = 0; expectedItemIndex < expected.length; expectedItemIndex++ ) {
		const expectedItem = expected[ expectedItemIndex ];
		const assertedItem = items[ expectedItemIndex ];

		if ( assertedItem === undefined ) {
			throw new Error( 'should be' );
		}

		if ( typeof expectedItem === 'string' ) {
			// Child is ia text.
			return expect( assertedItem ).toBe( expectedItem );
		}

		for ( const property in expectedItem ) {
			if ( property === 'text' && expectedItem[ property ] instanceof RegExp ) {
				expect( assertedItem[ property ] ).toMatch( expectedItem[ property ] );
			} else if ( property !== 'attributes' && property !== 'children' ) {
				expect( assertedItem[ property ] ).toEqual( expectedItem[ property ] );
			}
		}

		if ( expectedItem.attributes ) {
			const attributes = Array.from( assertedItem.attributes );
			expect( attributes ).toHaveLength( expectedItem.attributes.length );
			expect( attributes ).toEqual( expect.arrayContaining( expectedItem.attributes ) );
		}

		if ( expectedItem.children ) {
			assertTreeItems( assertedItem.children, expectedItem.children );
		}
	}
}

export function getStoreState() {
	return CKEditorInspector._store.getState();
}

export function dispatchStoreAction( action ) {
	return CKEditorInspector._store.dispatch( action );
}
