import * as types from "./types";
import { decode } from '../../lib/index';
import axios from 'axios';
import { getNewFeed, getInfoFollowings, doTransaction, unFollow, follow } from '../../lib/helper';
import * as account from '../../lib/account';
const vstruct = require('varstruct');

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
      console.log(txs);
      var auth = { sequence: 0 };
      for (let i = 0; i < txs.length; i++) {
        if (key === txs[i].account) {
          console.log(i);
          auth.sequence++;}
        if (txs[i].operation === "update_account") {
          if (txs[i].params.key === "name") {
            auth.name = txs[i].params.value.toString('utf-8');
          };
          if (txs[i].params.key === "followings") {
            const Followings = vstruct([
              { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
            ]);
            auth.followings = Followings.decode(txs[i].params.value).addresses;
          };
          if (txs[i].params.key === "picture") {
            auth.picture = txs[i].params.value;
          };
        }
      }
      
      if (auth.followings) {
        const base32 = require('base32.js');
        auth.followings = auth.followings.map(value => (base32.encode(value)));
      }
      if(auth.picture){
        auth.picture = Buffer.from(auth.picture).toString('base64');
      }
      //console.log(auth);
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
        //console.log(txs[i]);
        if (key === txs[i].account) auth.sequence++;
        switch (txs[i].operation) {
          case "update_account":
            switch (txs[i].params.key) {
              case "name":
                auth[txs[i].params.key] = txs[i].params.value.toString('utf-8');
                break;
              case "followings":
                break;
              case "picture":
                auth.picture = txs[i].params.value;
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
            //console.log(txs[i].params);
            const PlainTextContent = vstruct([
              { name: 'type', type: vstruct.UInt8 },
              { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
            ]);
            let one_post = {};
            one_post = { content: PlainTextContent.decode(txs[i].params.content) };
            //console.log(one_post);
            auth.tweets = [...auth.tweets, one_post];
            break;
          default:
            break;
        }
      }
      if(auth.picture){
        auth.picture = Buffer.from(auth.picture).toString('base64');
      }
      //console.log(auth);
      //var posts = getPosts(key);
      dispatch({ type: types.GET_POST, payload: auth.tweets });
      dispatch({ type: types.SET_PUBLIC_KEY, payload: key });
      dispatch(GetFollowing(key));
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
  getNewFeed(key).then(res => {
    //console.log(res);
    return dispatch({ type: types.GET_NEWFEED, payload: res });
  });
};

export const GetFollowing = (key) => (dispatch, getState) => {
  getInfoFollowings(key).then(res => {
    //console.log(res);
    return dispatch({ type: types.GET_FOLLOWING, payload: res });
  });
};

export const Follow = (key, isFollow) => (dispatch, getState) => {
  var acc = account.checkLogged();
  if (isFollow) {
    unFollow(acc.publicKey(), key, getState().auth.user.sequence + 1).then(res => {
      doTransaction(res, acc.secret()).then(res => {
        if (res) {
          dispatch(AddSequence());
          return dispatch({ type: types.DELETE_USER_FOLLOW, payload: key });
        }
      })
    })
  } else {
    follow(acc.publicKey(), key, getState().auth.user.sequence + 1).then(res => {
      doTransaction(res, acc.secret()).then(res => {
        if (res) {
          dispatch(AddSequence());
          return dispatch({ type: types.ADD_USER_FOLLOW, payload: key });
        }
      })
    })
  }
};

export const AddSequence = () => (dispatch, getState) => {
  return dispatch({ type: types.ADD_SEQUENCE });
}

export const AddNewfeed = (post) => (dispatch, getState) => {
  console.log(post);
  return dispatch({ type: types.ADD_NEWFEED, payload: post });
}