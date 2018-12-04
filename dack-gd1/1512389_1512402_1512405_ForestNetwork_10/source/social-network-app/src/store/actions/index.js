import * as types from "./types";

export const LogOut = () => (dispatch, getState) => {
  return dispatch({ type: types.LOGOUT });
};

export const EditProfile = (profile) => (dispatch, getState) => {
  return dispatch({ type: types.EDIT_PROFILE, payload: profile });
};
