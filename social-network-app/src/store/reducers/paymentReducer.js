import * as types from "../actions/types";
const initState = {
	histories: null
};

const paymentReducer = (state = initState, action) => {
	switch (action.type) {
        case types.GET_PAYMENT_HISTORY:
        console.log(action.payload)
            return {
                histories: action.payload
            };
        
        default:
            return state;
    }
};

export default paymentReducer;