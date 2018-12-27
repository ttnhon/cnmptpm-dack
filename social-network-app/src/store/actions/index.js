import * as types from "./types";
import { decode } from '../../lib/index';
import axios from 'axios';
import { sendMoney, getNewFeed, getInfoFollowings, doTransaction, unFollow, follow, getFullInfo, getPaymentHistoryAndInfo, getTimeBlock } from '../../lib/helper';
import * as account from '../../lib/account';
import server from '../../lib/server';
import {getBandwidthLimit, BANDWIDTH_PERIOD, getBlockInfo} from '../../lib/energy'
const vstruct = require('varstruct');

export const LogOut = () => (dispatch, getState) => {
  return dispatch({ type: types.LOGOUT });
};

export const SetUserProfile = (key, page, result) => (dispatch, getState) => {
  axios.get('https://' + server + '.forest.network/tx_search?query="account=\'' + key + '\'"&page="' + page + '"')
    .then(res => {
      //console.log(page);
      //console.log(res);
      let end = false;
      if (page * 30 >= res.data.result.total_count) end = true;
      const txs = res.data.result.txs.map((tx, index) => {
        return decode(Buffer.from(tx.tx, 'base64'));
      });
      //console.log(txs);
      var auth = result;
      if (res.data.result.total_count == 0) auth.isRedirect = true;
      else auth.isRedirect = false;
      //auth.balance = 0;
      for (let i = 0; i < txs.length; i++) {
        if (key === txs[i].account) {
          //console.log(i);
          auth.sequence++;

        }
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
        if (txs[i].operation === "payment") {
          //console.log(txs[i].params);
          auth.numberReceive++;
          if (key === txs[i].account) {
            auth.balance = auth.balance - txs[i].params.amount;
          } else {
            auth.balance = auth.balance + txs[i].params.amount;
          }
          //console.log(auth.balance);
        }
      }
      if (end) {
        if (auth.followings) {
          const base32 = require('base32.js');
          auth.followings = auth.followings.map(value => (base32.encode(value)));
        }
        if (auth.picture) {
          auth.picture = Buffer.from(auth.picture).toString('base64');
        } else {
          auth.picture = "Not Set";
        }
        if (auth.name === undefined) {
          auth.name = "No name";
        }
        auth.publicKey = key;
        
        let isFirst = account.getItemLocal('isLoadNotification');
        if(isFirst === 'false'){
          console.log(auth.numberReceive);
          account.setItemLocal("numberReceive", auth.numberReceive);
          account.setItemLocal('isLoadNotification', true);
        }

        // let number = account.getItemLocal("numberReceive");
        // if(number !== auth.numberReceive.toString()){
        //   if(auth.Notification){
        //     auth.Notification = {...auth.Notification,
        //       payment: true
        //     };
        //   }else{
        //     auth.Notification = {};
        //     auth.Notification.payment = true;
        //   }
        // }
        // console.log(auth.numberReceive);
        // console.log(number);
        return dispatch({ type: types.SET_USER_PROFILE, payload: auth });
      } else {
        return dispatch(SetUserProfile(key, page + 1, auth))
      }
    });
};

export const EditProfile = (profile) => (dispatch, getState) => {
  return dispatch({ type: types.EDIT_PROFILE, payload: profile });
};

export const GetProfile = (acc, page, result) => (dispatch, getState) => {
  axios.get('https://' + server + '.forest.network/tx_search?query="account=\'' + acc.key + '\'"&page="' + page + '"')
    .then(async res => {
      //console.log(res);
      let end = false;
      //console.log(page);
      //console.log(res.data.result.total_count);
      if (page * 30 >= res.data.result.total_count) end = true;
      //console.log(end);
      const txs = res.data.result.txs.map((tx, index) => {
        return decode(Buffer.from(tx.tx, 'base64'));
      });
      //console.log(txs);
      var auth = result;
      if (res.data.result.total_count == 0) auth["name"] = "Account not register";
      //console.log(auth);
      for (let i = 0; i < txs.length; i++) {
        //console.log(txs[i]);
        if (acc.key === txs[i].account) {
          auth.sequence++;
          //tính diff cho acc
          // let blockInfo = await getTimeBlock(res.data.result.txs[i].height);
          // console.log(blockInfo);
          // const moment = require('moment');
          // let blockTime = moment(blockInfo.data.result.block.header.time).unix();
          // if(auth.diff){
          //   auth.diff = blockTime;
          //   auth.bandwidth = res.data.result.txs[i].tx.length;
          // }else{
          //   let diff = blockTime - auth.diff;
          //   if(diff >= BANDWIDTH_PERIOD){
          //     auth.diff = BANDWIDTH_PERIOD;
          //     auth.bandwidth = Math.ceil(Math.max(0, (BANDWIDTH_PERIOD - diff) / BANDWIDTH_PERIOD) * account.bandwidth + txSize);
          //   }
          //   auth.diff =  diff >= BANDWIDTH_PERIOD ? BANDWIDTH_PERIOD : blockTime;
          // }
        }
        switch (txs[i].operation) {
          case "update_account":
            switch (txs[i].params.key) {
              case "name":
                auth[txs[i].params.key] = txs[i].params.value.toString('utf-8');
                break;
              case "followings":
                const Followings = vstruct([
                  { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
                ]);
                auth.followings = Followings.decode(txs[i].params.value).addresses;
                break;
              case "picture":
                auth.picture = txs[i].params.value;
                break;
              default:
                break;
            }
            break;
          case "payment":
            if (acc.key === txs[i].account) {
              auth.balance = auth.balance - txs[i].params.amount;
            } else {
              auth.balance = auth.balance + txs[i].params.amount;
            }
            break;
          case "post":
            try {
              //console.log(txs[i].params);
              if (acc.hash) {
                if (!(res.data.result.txs[i].hash === acc.hash)) {
                  continue;
                }
              }
              const PlainTextContent = vstruct([
                { name: 'type', type: vstruct.UInt8 },
                { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
              ]);
              let one_post = {};
              let content = PlainTextContent.decode(txs[i].params.content);
              one_post = { content: content, height: res.data.result.txs[i].height, hash: res.data.result.txs[i].hash };
              //console.log(one_post);
              auth.tweets = [one_post].concat(auth.tweets);
            } catch (error) {
              console.log(error);
            }
            break;
          default:
            break;
        }
      }
      //var posts = getPosts(key);
      dispatch({ type: types.SET_PUBLIC_KEY, payload: acc.key });
      if (end) {
        if (auth.picture) {
          auth.picture = Buffer.from(auth.picture).toString('base64');
        } else {
          auth.picture = "Not Set";
        }
        if (auth.followings) {
          const base32 = require('base32.js');
          auth.followings = auth.followings.map(value => (base32.encode(value)));
        }
        if (auth.name === undefined) {
          auth.name = "No name";
        }
        //auth.bandwitdh = Math.ceil(Math.max(0, (BANDWIDTH_PERIOD - diff) / BANDWIDTH_PERIOD) * account.bandwidth + txSize);
        //console.log(auth);
        dispatch(EditProfile({ name: auth.name, balance: auth.balance, sequence: auth.sequence, picture: auth.picture, followings: auth.followings }));
        //dispatch(GetFollowing(key));
        await dispatch(GetTimePost(acc.key, auth.tweets));
        return dispatch({ type: types.GET_POST, payload: auth.tweets });
      }
      return dispatch(GetProfile(acc, page + 1, auth));
    });
};

// export const GetTimeNewfeed = (page) => async (dispatch, getState) => {
//   if (tweets) {
//     if (tweets.length > 0) {
//       for (let i = 0; i < tweets.length; i++) {
//         let height = tweets[i].height;
//         if(height){
//           await getTimeBlock(height).then(res => {
//             //console.log(res.data.result.block.data.txs[0].length);
//             const moment = require('moment-timezone');
//             let time = res.data.result.block.header.time;
//             let date = new Date(time);
//             var format = 'YYYY/MM/DD HH:mm:ss ZZ';
//             //date.setTime(date.getTime() + (7 * 60 * 60 * 1000));
//             tweets[i].time = moment(date, format).tz("Asia/Saigon").format(format);
//           });
//         }
//       }
//     }
//   }
// }

export const GetTimePost = (acc, tweets) => async (dispatch, getState) => {
  if (tweets) {
    if (tweets.length > 0) {
      for (let i = 0; i < tweets.length; i++) {
        let height = tweets[i].height;
        if(height){
          await getTimeBlock(height).then(res => {
            //console.log(res.data.result.block.data.txs[0].length);
            const moment = require('moment-timezone');
            let time = res.data.result.block.header.time;
            let date = new Date(time);
            var format = 'YYYY/MM/DD HH:mm:ss ZZ';
            //date.setTime(date.getTime() + (7 * 60 * 60 * 1000));
            tweets[i].time = moment(date, format).tz("Asia/Saigon").format(format);
          });
        }
      }
    }
  }
}

export const GetInteract = (acc, page, result) => (dispatch, getState) => {
  axios.get('https://' + server + '.forest.network/tx_search?query="account=\'' + acc.key + '\'"&page="' + page + '"')
    .then(async res => {
      //console.log(res);
      let end = false;
      if (page * 30 >= res.data.result.total_count) end = true;
      //console.log(end);
      const txs = res.data.result.txs.map((tx, index) => {
        return decode(Buffer.from(tx.tx, 'base64'));
      });
      //console.log(txs);
      var interact = result;
      //if (res.data.result.total_count == 0) interact["name"] = "Account not register";
      //console.log(interact);
      for (let i = 0; i < txs.length; i++) {
        switch (txs[i].operation) {
          case "interact":
            const Type = vstruct([
              { name: 'type', type: vstruct.UInt8 }
            ]);
            const ReactContent = vstruct([
              { name: 'type', type: vstruct.UInt8 },
              { name: 'reaction', type: vstruct.UInt8 },
            ]);
            const PlainTextContent = vstruct([
              { name: 'type', type: vstruct.UInt8 },
              { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
            ]);
            let one_interact = {};
            let type = Type.decode(txs[i].params.content);
            let content;
            if (type.type === 1) {
              content = PlainTextContent.decode(txs[i].params.content);
            } else {
              content = ReactContent.decode(txs[i].params.content);
            }
            one_interact = { object: txs[i].params.object, content: content, account: txs[i].account, hash: res.data.result.txs[i].hash, height: res.data.result.txs[i].height };
            interact = interact.concat([one_interact]);
            break;
          default:
            break;
        }
      }
      if (end) {
        //console.log(interact);
        //console.log(acc.hash);
        let res = [];
        for (let i = 0; i < interact.length; i++) {
          if (interact[i].skip) continue;
          let leng;
          if (interact[i].object === acc.hash) {
            leng = res.push(interact[i]);
          }
          if (leng) {
            for (let j = 0; j < interact.length; j++) {
              if (interact[j].skip) continue;
              if (interact[j].object === res[leng - 1].hash) {
                if (res[leng - 1].interact) {
                  res[leng - 1].interact.push(interact[j]);
                } else {
                  res[leng - 1].interact = [].concat(interact[j]);
                }
                interact[j].skip = true;
              }
            }
          }
        }
        await dispatch(GetTimePost(acc.key, res));
        //console.log(res);
        dispatch({ type: types.GET_INTERACT, payload: res });
        return dispatch(AddInteractInfo());
      }
      return dispatch(GetInteract(acc, page + 1, interact));
    });
};

export const LogIn = (key) => (dispatch, getState) => {
  dispatch(SetUserProfile(key.publicKey, 1, { sequence: 0 }));
  return dispatch({ type: types.SET_SECRET_KEY, payload: key.secretKey });
};

export const GetNewfeed = (key, get_page) => async (dispatch, getState) => {
  var newfeed = await getNewFeed(key, get_page);
  //console.log(res);
  if (newfeed) {
    await dispatch(GetTimePost(key, newfeed));
  }
  return dispatch({ type: types.GET_NEWFEED, payload: newfeed });
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
  for (let i = 0; i < list.length; i++) {
    if (list[i].account === acc) {
      index = i;
      break;
    }
  }
  //console.log(index);
  if (index) {
    return dispatch({ type: types.DELETE_FOLLOWING, payload: index });
  }
}

export const AddTweet = (post) => (dispatch, getState) => {
  //console.log(post);
  return dispatch({ type: types.ADD_POST, payload: [post] });
}

export const AddInteractInfo = () => async (dispatch, getState) => {
  let list = getState().auth.interact;
  if (list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].interact) {
        for (let j = 0; j < list[i].interact.length; j++) {
          await getFullInfo(list[i].interact[j].account).then(res => {
            list[i].interact[j].account = res;
          })
        }
      }
      await getFullInfo(list[i].account).then(res => {
        list[i].account = res;
      })
    }
    return dispatch({ type: types.GET_INTERACT, payload: list });
  }
}

export const SetDefaultState = () => (dispatch, getState) => {
  return dispatch({ type: types.SET_DEFAULT });
}

export const AddInteract = (interact) => (dispatch, getState) => {
  //console.log(interact);
  return dispatch({ type: types.ADD_INTERACT, payload: interact });
}

export const SendMoney = (public_key, secret_key, receiver_account, sequence, amount, memo = '') => async (dispatch, getState) => {
  var send_money = await sendMoney(public_key, secret_key, receiver_account, sequence, amount, memo);
  var doTrans = await doTransaction(send_money, secret_key);
  if (doTrans.data.result.check_tx.log) {
    alert('Gửi không thành công');
    return;
  } else {
    dispatch({ type: types.SEND_MONEY, payload: amount });
    alert('Gửi thành công');
    return;
  }
}

export const GetPaymentHistory = (key) => async (dispatch, getState) => {
  var payments = await getPaymentHistoryAndInfo(key);
  return dispatch({ type: types.GET_PAYMENT_HISTORY, payload: payments ? payments : 'That bai roi nhe' });
}

export const SetDefaultHomeState = () => (dispatch, getState) => {
  return dispatch({ type: types.SET_DEFAULT_HOME });
}