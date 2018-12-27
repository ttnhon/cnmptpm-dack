import { createStore, applyMiddleware, combineReducers } from "redux";
import auth from './reducers/auth';
import followingReducer from './reducers/followingReducer';
import followersReducer from './reducers/followersReducer';
import paymentReducer from './reducers/paymentReducer'
import thunk from 'redux-thunk';

export default () => {
    //combine all reducers
    const rootReducer = combineReducers({
        auth: auth,
        following: followingReducer,
        followers: followersReducer,
        payments: paymentReducer
      })

    // Create store with reducers and initial state
    //const initialState = {}
    const store = createStore(rootReducer, applyMiddleware(thunk));

    return store;
};