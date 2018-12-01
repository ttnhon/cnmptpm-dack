import * as types from "../actions/types";

const INITIAL_STATE = {
    auth: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.LOGOUT:
            return INITIAL_STATE;
        default:
            return state;
    }
};
