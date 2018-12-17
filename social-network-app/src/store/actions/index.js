import * as types from "./types";

export const LogOut = () => (dispatch, getState) => {
  return dispatch({ type: types.LOGOUT });
};

export const EditProfile = (profile) => (dispatch, getState) => {
  return dispatch({ type: types.EDIT_PROFILE, payload: profile });
};

export const LogIn = (key) => (dispatch, getState) => {
  return dispatch({ type: types.SET_KEY, payload: key });
};
