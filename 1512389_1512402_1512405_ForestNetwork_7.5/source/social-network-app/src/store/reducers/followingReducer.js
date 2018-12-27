import * as types from "../actions/types";
const initState = {
	users: null
};

const followingReducer = (state = initState, action) => {
	switch (action.type) {
        case types.GET_FOLLOWING:
            return {
                users: action.payload
            };
        case types.DELETE_FOLLOWING:
        var list = state.users;
        //console.log(state);
        list.splice(action.payload, 1);
            return {
                ...state,
                users: list
            };
        case types.SET_DEFAULT:
            return initState;
        default:
            return state;
    }
};

export default followingReducer;