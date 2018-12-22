import * as types from "./types";
import { sign, encode, decode } from '../../lib/index';
import axios from 'axios';

export const LogOut = () => (dispatch, getState) => {
  return dispatch({ type: types.LOGOUT });
};

export const EditProfile = (profile) => (dispatch, getState) => {
  return dispatch({ type: types.EDIT_PROFILE, payload: profile });
};

export const GetProfile = (key) => (dispatch, getState) => {
  axios.get('https://komodo.forest.network/tx_search?query="account=\'' + key + '\'"')
    .then(res => {
      //console.log(res);
      const txs = res.data.result.txs.map((tx, index) => {
        return decode(Buffer.from(tx.tx, 'base64'));
      });
      //console.log(txs);
      var auth = { balance: 0, sequence: 0 };
      for (let i = 0; i < txs.length; i++) {
        //console.log(txs[i].operation);
        if(key === txs[i].account) auth.sequence++;
        switch (txs[i].operation) {
          case "update_account":
            switch (txs[i].params.key) {
              case "name":
                auth[txs[i].params.key] = txs[i].params.value.toString('utf-8');
                break;
              case "followings":
                break;
              default:
                break;
            }
            break;
          case "payment":
            if (key === txs[i].account) {
              auth.balance = auth.balance - txs[i].params.amount;
            } else {
              auth.balance = auth.balance + txs[i].params.amount;
            }
            break;
          default:
            break;
        }
      }
      //console.log(auth);
      dispatch({ type: types.SET_PUBLIC_KEY, payload: key })
      return dispatch(EditProfile(auth));
    });
};

export const LogIn = (key) => (dispatch, getState) => {
  //console.log(key);
  // axios.get('https://komodo.forest.network/tx_search?query="account=\'' + key + '\'"')
  //   .then(res => {
  //     var sequence = 0;
  //     const txs = res.data.result.txs.map((tx, index) => {
  //       let result = decode(Buffer.from(tx.tx, 'base64'));
  //       if(result.account === key.publicKey) sequence++;
  //       return result;
  //     });
  //   });
  dispatch(GetProfile(key.publicKey));
  return dispatch({ type: types.SET_SECRET_KEY, payload: key.secretKey });
};
