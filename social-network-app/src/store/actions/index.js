import * as types from "./types";
import { sign, encode, decode } from '../../lib/index';
import axios from 'axios';
import { getNewFeed } from '../../lib/helper';

export const LogOut = () => (dispatch, getState) => {
  return dispatch({ type: types.LOGOUT });
};

export const SetUserProfile = (key) => (dispatch, getState) => {
  axios.get('https://komodo.forest.network/tx_search?query="account=\'' + key + '\'"')
    .then(res => {
      //console.log(res);
      const txs = res.data.result.txs.map((tx, index) => {
        return decode(Buffer.from(tx.tx, 'base64'));
      });
      //console.log(txs);
      var auth = {};
      for (let i = txs.length - 1; i >= 0 ; i--) {
        if(txs[i].operation === "update_account"){
          if(txs[i].params.key === "name") {
            auth.name = txs[i].params.value.toString('utf-8');
            break;
          };
        }
      }
      return dispatch({ type: types.SET_USER_PROFILE, payload: auth });
    });
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
      var auth = { balance: 0, sequence: 0, tweets: [] };
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
          case "post":
            //console.log(txs[i].params.content.toString('utf-8'));
            const vstruct = require('varstruct');
            const PlainTextContent = vstruct([
              { name: 'type', type: vstruct.UInt8 },
              { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
            ]);
            let one_post = {};
            one_post = {content: PlainTextContent.decode(txs[i].params.content)};
            console.log(one_post);
            auth.tweets = [...auth.tweets, one_post];
            break;
          default:
            break;
        }
      }
      //console.log(auth);
      //var posts = getPosts(key);
      dispatch({ type: types.GET_POST, payload: auth.tweets });
      dispatch({ type: types.SET_PUBLIC_KEY, payload: key });
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
  //dispatch(GetProfile(key.publicKey));
  dispatch(SetUserProfile(key.publicKey));
  return dispatch({ type: types.SET_SECRET_KEY, payload: key.secretKey });
};

export const GetNewfeed = (key) => (dispatch, getState) => {
  getNewFeed(key).then(res=>{
    //console.log(res);
    return dispatch({ type: types.GET_NEWFEED, payload: res });
  });
};