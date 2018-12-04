import { createStore, applyMiddleware, combineReducers } from "redux";
import auth from './reducers/auth';
import followingReducer from './reducers/followingReducer';
import followersReducer from './reducers/followersReducer';
import thunk from 'redux-thunk';

export default () => {
    //combine all reducers
    const rootReducer = combineReducers({
        auth: auth,
        following: followingReducer,
        followers: followersReducer
      })

    // Create store with reducers and initial state
    //const initialState = {}
    const store = createStore(rootReducer, applyMiddleware(thunk));

    return store;
};