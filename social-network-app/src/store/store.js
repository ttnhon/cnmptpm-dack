import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import Reducers from './reducers/index';
import thunk from 'redux-thunk';

export default () => {
    //combine all reducers
    const rootReducer = combineReducers({
        firebase: firebaseReducer,
        firestore: firestoreReducer,
        reducers: Reducers
      })

    // Create store with reducers and initial state
    const initialState = {}
    const store = createStore(rootReducer, initialState, createStoreWithFirebase);

    return store;
};