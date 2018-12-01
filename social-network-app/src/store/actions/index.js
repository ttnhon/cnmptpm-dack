import * as types from "./types";

export const LogOut = () => (dispatch, getState) => {
  return dispatch({ type: types.LOGOUT });
};
