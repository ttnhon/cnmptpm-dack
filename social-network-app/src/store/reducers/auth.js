import * as types from "../actions/types";
const initState = {};
export default (state = initState, action) => {
    switch (action.type) {
        case types.EDIT_PROFILE:
            return {
                ...state,
                ...action.payload
            };
        case types.SET_PUBLIC_KEY:
            return {
                ...state,
                publicKey: action.payload
            };
        case types.SET_SECRET_KEY:
            return {
                ...state,
                secretKey: action.payload
            };
        case types.SET_USER_PROFILE:
            return {
                ...state,
                user: action.payload
            };
        case types.ADD_SEQUENCE:
            return {
                ...state,
                user: {...state.user,
                    sequence: state.user.sequence + 1
                }
            };
        case types.ADD_NEWFEED:
            return {
                ...state,
                newfeed: [action.payload].concat(state.newfeed)
            };
        case types.ADD_USER_FOLLOW:
            return {
                ...state,
                user: {...state.user,
                    followings: state.user.followings ? state.user.followings.concat(action.payload) : undefined
                }
            };
        case types.DELETE_USER_FOLLOW:
        var list = state.user.followings;
        list.splice(action.payload, 1);
            return {
                ...state,
                user: {...state.user,
                    followings: list
                }
            };
        case types.GET_POST:
            return {
                ...state,
                tweets: action.payload
            };
        case types.ADD_POST:
            return {
                ...state,
                tweets: state.tweets ? action.payload.concat(state.tweets) : action.payload
            };
        case types.GET_NEWFEED:
        return {
            ...state,
            newfeed: action.payload
        };
        case types.GET_INTERACT:
        return {
            ...state,
            interact: action.payload
        };
        case types.ADD_INTERACT:
        return {
            ...state,
            interact: state.interact ? state.interact.concat(action.payload) : action.payload
        };
        case types.SEND_MONEY:
            //console.log(action.payload);
            return {
                ...state,
                user: {...state.user,
                    sequence: state.user.sequence + 1,
                    balance: state.user.balance - action.payload
                }
            };
        case types.SET_DEFAULT:
            return initState;
        case types.LOGOUT:
            return initState;
        default:
            return state;
    }
};
