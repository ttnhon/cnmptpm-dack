import * as types from "./types";
import { decode } from '../../lib/index';
import axios from 'axios';
import { getNewFeed, getInfoFollowings, doTransaction, unFollow, follow } from '../../lib/helper';
import * as account from '../../lib/account';
const vstruct = require('varstruct');

export const LogOut = () => (dispatch, getState) => {
  return dispatch({ type: types.LOGOUT });
};

export const SetUserProfile = (key, page, result) => (dispatch, getState) => {
  axios.get('https://komodo.forest.network/tx_search?query="account=\'' + key + '\'"&page="'+page+'"')
    .then(res => {
      //console.log(res);
      let end = false;
      if(page * 30 >= res.data.result.total_count) end = true;
      const txs = res.data.result.txs.map((tx, index) => {
        return decode(Buffer.from(tx.tx, 'base64'));
      });
      //console.log(txs);
      var auth = result;
      for (let i = 0; i < txs.length; i++) {
        if (key === txs[i].account) {
          //console.log(i);
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
      if(end){
        if (auth.followings) {
          const base32 = require('base32.js');
          auth.followings = auth.followings.map(value => (base32.encode(value)));
        }
        if(auth.picture){
          auth.picture = Buffer.from(auth.picture).toString('base64');
        }
        //console.log(auth);
        return dispatch({ type: types.SET_USER_PROFILE, payload: auth });
      }else{
        return dispatch(SetUserProfile(key, page + 1, auth))
      }
    });
};

export const EditProfile = (profile) => (dispatch, getState) => {
  return dispatch({ type: types.EDIT_PROFILE, payload: profile });
};

export const GetProfile = (key, page, result) => (dispatch, getState) => {
  axios.get('https://komodo.forest.network/tx_search?query="account=\'' + key + '\'"&page="'+page+'"')
    .then(res => {
      //console.log(page);
      let end = false;
      //console.log(page);
      //console.log(res.data.result.total_count);
      if(page * 30 >= res.data.result.total_count) end = true;
      //console.log(end);
      const txs = res.data.result.txs.map((tx, index) => {
        return decode(Buffer.from(tx.tx, 'base64'));
      });
      //console.log(txs);
      var auth = result;
      if(res.data.result.total_count == 0) auth["name"] = "Account not register";
      //console.log(auth);
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
            one_post = { content: PlainTextContent.decode(txs[i].params.content), height: res.data.result.txs[i].height };
            //console.log(one_post);
            auth.tweets = [one_post].concat(auth.tweets);
            break;
          default:
            break;
        }
      }
      //var posts = getPosts(key);
      dispatch({ type: types.SET_PUBLIC_KEY, payload: key });
      if(end) {
        if(auth.picture){
          auth.picture = Buffer.from(auth.picture).toString('base64');
        }
        //console.log(auth);
        dispatch({ type: types.GET_POST, payload: auth.tweets });
        dispatch(GetFollowing(key));
        return dispatch(EditProfile(auth));
      }
      return dispatch(GetProfile(key, page + 1, auth));
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
  dispatch(SetUserProfile(key.publicKey, 1, { sequence: 0 }));
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
  //console.log(post);
  return dispatch({ type: types.ADD_NEWFEED, payload: post });
}

export const DeleteFollowing = (acc) => (dispatch, getState) => {
  const list = getState().following.users;
  var index;
  for(let i = 0; i < list.length; i++){
    if(list[i].account === acc) {
      index = i;
      break;
    }
  }
  //console.log(index);
  if(index){
    return dispatch({ type: types.DELETE_FOLLOWING, payload: index });
  }
}