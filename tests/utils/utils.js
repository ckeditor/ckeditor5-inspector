/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import CKEditorInspector from '../../src/ckeditorinspector';

export function assertTreeItems( items, expected ) {
	if ( expected.length != items.length ) {
		expect.fail( items, expected, 'number of items should match' );
	}

	for ( let expectedItemIndex = 0; expectedItemIndex < expected.length; expectedItemIndex++ ) {
		const expectedItem = expected[ expectedItemIndex ];
		const assertedItem = items[ expectedItemIndex ];

		if ( assertedItem === undefined ) {
			expect.fail( JSON.stringify( assertedItem ), JSON.stringify( expectedItem ), 'should be' );
		}

		if ( typeof expectedItem === 'string' ) {
			// Child is ia text.
			return expect( assertedItem ).to.equal( expectedItem );
		}

		for ( const property in expectedItem ) {
			if ( property === 'text' && expectedItem[ property ] instanceof RegExp ) {
				expect( assertedItem[ property ] ).to.match( expectedItem[ property ], property + ' must match' );
			} else if ( property !== 'attributes' && property !== 'children' ) {
				expect( assertedItem[ property ] ).to.deep.equal( expectedItem[ property ], property + ' must match' );
			}
		}

		if ( expectedItem.attributes ) {
			expect( Array.from( assertedItem.attributes ) ).to.have.deep.members( expectedItem.attributes, 'attributes must match' );
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
