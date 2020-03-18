/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

const initialState = {
};

export default function reducer( state = initialState, action ) {
	console.log( action );
	// switch (action.type) {
	//   case SET_VISIBILITY_FILTER:
	// 	return Object.assign({}, state, {
	// 	  visibilityFilter: action.filter
	// 	})
	//   case ADD_TODO:
	// 	return Object.assign({}, state, {
	// 	  todos: todos(state.todos, action)
	// 	})
	//   case TOGGLE_TODO:
	// 	return Object.assign({}, state, {
	// 	  todos: todos(state.todos, action)
	// 	})
	//   default:
	// 	return state
	// }
	return state;
}
