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
        default:
            return state;
    }
};

export default followingReducer;