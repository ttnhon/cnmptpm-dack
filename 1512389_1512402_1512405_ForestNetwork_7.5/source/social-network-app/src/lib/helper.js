import { encode, decode, verify, sign, hash } from './index';
import server from './server';
const base32 = require('base32.js');
const axios = require('axios');
const vstruct = require('varstruct');
const request = require('request');

var sendMoney = async (public_key, secret_key, receiver_account, sequence, amount = 100, memo = '') => {
  var tx = {
    version: 1,
    operation: 'payment',
    params: {
      address: receiver_account,
      amount: amount
    },
    account: new Buffer(35),
    sequence: sequence,
    memo: Buffer.alloc(0), //Buffer.alloc(0),
    signature: new Buffer(64)
  };


  return await tx;
};

var updateName = async (secret_key, sequence, newName, memo = '') => {
  var buff = Buffer.from(newName, 'utf-8');
  var tx = {
    version: 1,
    account: new Buffer(35),
    sequence: sequence,
    memo: Buffer.alloc(0),
    operation: 'update_account',
    params: {
      key: 'name',
      value: buff
    },
    signature: new Buffer(64)
  };
  sign(tx, secret_key);
  const txs = '0x' + encode(tx).toString('hex');
  return await axios('https://' + server + '.forest.network/broadcast_tx_commit?tx=' + txs);
  //return res;
}
var updatePicture = async (secret_key, sequence, str, memo = '') => {
  var buff = Buffer.from(str, "base64");
  console.log(buff);
  var tx = {
    version: 1,
    account: new Buffer(35),
    sequence: sequence,
    memo: Buffer.alloc(0),
    operation: 'update_account',
    params: {
      key: 'picture',
      value: buff
    },
    signature: new Buffer(64)
  };

  sign(tx, secret_key);
  var param = encode(tx).toString('base64');
  var header = {
    'Content-Type': 'application/json-rpc',
  }

  let options = {
    url: "https://" + server + ".forest.network/",
    method: "post",
    headers: header,
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'broadcast_tx_commit',
      params: [param],
      id: 1
    })
  };

  var res = await axios.post('https://komodo.forest.network/', {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "broadcast_tx_commit",
    "params": [`${param}`]
  });
  //var result = await request(options);
  return res;

  // await request(options, (error, response, body) => {
  //     if (error) {
  //         result = {error: 'An error has occurred: ' + error};
  //     } else {
  //         result = {succeed: 'Change avatar success', response: body};
  //     }
  // });
  // return result;
}

var getName = async (account) => {
  var name = 'No Name';
  var result = await axios('https://' + server + '.forest.network/tx_search?query=%22account=%27' + account + '%27%22');
  const res = result.data;

  res.result.txs.slice(0).reverse().map((tx) => {
    let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
    if (one_transaction.operation == 'update_account' && one_transaction.params.key == 'name') {
      return one_transaction.params.value;
    }
  });

  return name;

}

var getTimeBlock = async (height) => {
  var result = await axios('https://' + server + '.forest.network/block?height=' + height);
  return result;
};

var getFollowings = async (account, page = 1, arr_following = []) => {
  const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
  ]);
  var result = await axios('https://' + server + '.forest.network/tx_search?query="account=\'' + account + '\'"&page="' + page + '"');
  const res = result.data;

  res.result.txs.map((tx) => {
    let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
    if (one_transaction.operation == 'update_account' && one_transaction.params.key == 'followings') {
      arr_following = Followings.decode(one_transaction.params.value).addresses;
    }
  });

  if (page * 30 >= res.result.total_count) {
    if (arr_following.length > 0) {
      arr_following = arr_following.map(value => (base32.encode(value)));
    }
    return arr_following;
  }
  return getFollowings(account, ++page, arr_following);

};

var getFullInfo = async (account, page = 1, info = []) => {
  var result = await axios('https://' + server + '.forest.network/tx_search?query="account=\'' + account + '\'"&page="' + page + '"');
  const res = result.data;

  res.result.txs.map((tx) => {
    let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
    if (one_transaction.operation == 'update_account') {
      switch (one_transaction.params.key) {
        case 'name':
          info['name'] = one_transaction.params.value.toString('utf-8');
          break;

        case 'picture':
          info['img_url'] = one_transaction.params.value;
          break;

        default:
          break;
      }
    }
  });

  if (page * 30 >= res.result.total_count) {
    info['account'] = account;
    info['name'] = info['name'] ? info['name'] : 'No Name';
    info['img_url'] = info['img_url'] ?
      Buffer.from(info['img_url']).toString('base64')
      : 'Not Set';

    return info;
  }

  return getFullInfo(account, ++page, info);
};

var getInfoFollowings = async (account) => {
  const followings = await getFollowings(account);
  if (followings.height <= 0)
    return [];

  var all_infos_followings = [];
  await Promise.all(followings.map(async (one_account) => {
    let one_info_followings = await getFullInfo(one_account);
    all_infos_followings.push(one_info_followings);
  }));

  all_infos_followings.reverse();
  return all_infos_followings;
};

var getPosts = async (account, info, get_page = 1, page = null, list_post = [], max_page = null) => {
  const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
  ]);
  //console.log('get post');
  if (max_page === null) {
    var result = await axios('https://' + server + '.forest.network/tx_search?query="account=\'' + account + '\'"&page="' + 1 + '"');
    const total_count = result.data.result.total_count;
    max_page = Math.floor(total_count / 30);
    page = max_page;
    return getPosts(account, info, get_page, page, list_post, max_page);
  }
  //console.log(get_page);
  //console.log(max_page);
  if (page == 0 || get_page > max_page) return [];
  //console.log('get post ko return');
  if (get_page === (max_page - page + 1)) {
    var result = await axios('https://' + server + '.forest.network/tx_search?query="account=\'' + account + '\'"&page="' + page + '"');
    const res = result.data;
    res.result.txs.map((tx) => {
      let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
      let content = null;
      if (account !== one_transaction.account) return content;
      switch (one_transaction.operation) {
        case 'post':
          content = {
            key: 'post',
            value: PlainTextContent.decode(one_transaction.params.content)
          };
          break;
        case 'payment':
          content = {
            key: 'payment',
            value: {
              address: one_transaction.params.address,
              amount: one_transaction.params.amount
            }
          };
          break;
        case 'update_account':
          switch (one_transaction.params.key) {
            case 'name':
              content = {
                key: 'update_account',
                value: {
                  key: 'name',
                  value: one_transaction.params.value.toString('utf-8')
                }
              };
              break;

            case 'picture':
              content = {
                key: 'update_account',
                value: {
                  key: 'image',
                  value: Buffer.from(one_transaction.params.value).toString('base64')
                }
              };
              break;

            default:
              break;
          }
          break;

        default:
          break;
      }

      if (content) {
        let one_post = [];
        one_post['name'] = info['name'];
        one_post['img_url'] = info['img_url'];
        one_post['account'] = account;
        one_post['content'] = content;
        one_post['height'] = tx.height;
        one_post['hash'] = tx.hash;
        list_post.push(one_post);
      }
    });
    //console.log(list_post);
    return list_post;
  }
  return getPosts(account, info, get_page, page - 1, list_post, max_page);
};

var getPaymentHistory = async (account, page = 1, list_payment = []) => {

  var result = await axios('https://' + server + '.forest.network/tx_search?query="account=\'' + account + '\'"&page="' + page + '"');
  const res = result.data;
  res.result.txs.map((tx) => {
    let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
    if (one_transaction.operation == 'payment') {
      let one_payment = [];
      one_payment['sender'] = one_transaction.account;
      one_payment['receiver'] = one_transaction.params.address;
      one_payment['amount'] = one_transaction.params.amount;

      list_payment.push(one_payment);
    }
  });

  if (page * 30 >= res.result.total_count)
    return list_payment;
  return getPaymentHistory(account, ++page, list_payment);
};

var findUser = (user, users_info) => {

  for (let index = 0; index < users_info.length; index++) {
    const element = users_info[index];
    if (user === element['account']) {
      return index;
    }
  }
  return -1;
}
var getPaymentHistoryAndInfo = async (account) => {
  //get payments
  var payments = await getPaymentHistory(account);
  var users_account = [];
  //get account to get info
  payments.map((one_payment) => {
    if (users_account.indexOf(one_payment['sender']) === -1) {
      users_account.push(one_payment['sender']);
    }
    if (users_account.indexOf(one_payment['receiver']) === -1) {
      users_account.push(one_payment['receiver']);
    }
  });

  //get full account's info to show
  let users_info = [];
  await Promise.all(users_account.map(async (one_account) => {
    let info = await getFullInfo(one_account);
    users_info.push(info);
  }));

  //console.log(users_info);
  let payment_and_info = []
  //merge array to show
  payments.map((one_payment) => {
    let sender = one_payment['sender'];
    let sender_pos = findUser(sender, users_info);
    let receiver = one_payment['receiver'];
    let receiver_pos = findUser(receiver, users_info);

    let _one = [];
    _one['amount'] = one_payment['amount'];
    _one['sender'] = users_info[sender_pos];
    _one['receiver'] = users_info[receiver_pos];

    if (_one['sender']['account'] === account) {
      _one['sender']['name'] = 'You'
    }
    if (_one['receiver']['account'] === account) {
      _one['receiver']['name'] = 'You'
    }

    payment_and_info.push(_one);
  })
  //console.log(payment_and_info)
  return payment_and_info;
}

var getNewFeed = async (account, get_page = 1) => {
  const followings = await getFollowings(account);
  if (followings.height <= 0)
    return false;
  var all_posts = [];
  var list_info_users = [];
  await Promise.all(followings.map(async (one_account) => {
    let info = null;
    if (list_info_users.length < 1 || findUser(one_account, list_info_users) === -1) {
      info = await getFullInfo(one_account);
      list_info_users.push(info);
    }
    else {
      info = list_info_users[findUser(one_account, list_info_users)];
    }
    let posts = await getPosts(one_account, info, get_page);
    if (posts.length > 0) {
      posts.map(one_post => {
        all_posts.push(one_post);
      })
    }
  }));
  //get user post
  let info_user = null;
  if (list_info_users.length < 1 || findUser(account, list_info_users) === -1) {
    info_user = await getFullInfo(account);
  }
  else {
    info_user = list_info_users[findUser(account, list_info_users)];
  }
  let User_posts = await getPosts(account, info_user, get_page);
  if (User_posts.length > 0) {
    User_posts.map(one_post => {
      all_posts.push(one_post);
    })
  }
  all_posts.sort(function (a, b) { return b.height - a.height });
  return all_posts;
};

/* Update account FOLLOWINGS Transaction */
var follow = async (my_account, add_account, sequence) => {
  const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
  ]);
  var arr_following = await getFollowings(my_account);

  if (arr_following.indexOf(add_account) != -1)
    return false;

  arr_following = arr_following.concat(add_account);
  arr_following = arr_following.map(one_following => (Buffer.from(base32.decode(one_following))));

  var val = Followings.encode({ addresses: arr_following });
  //tao transaction
  var tx = {
    version: 1,
    account: my_account,
    sequence: sequence,
    memo: Buffer.alloc(0),
    operation: 'update_account',
    params: {
      key: 'followings',
      value: val
    },
    signature: new Buffer(64)
  };
  return tx;
}

var unFollow = async (my_account, remove_account, sequence) => {
  const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
  ]);
  var arr_following = await getFollowings(my_account);
  //cap nhat danh sach following
  let index_account = arr_following.indexOf(remove_account);
  if (index_account === -1)
    return false;
  arr_following.splice(index_account, 1);
  arr_following = arr_following.map(one_following => (Buffer.from(base32.decode(one_following))));
  var val = Followings.encode({ addresses: arr_following });
  //tao transaction
  var tx = {
    version: 1,
    account: my_account,
    sequence: sequence,
    memo: Buffer.alloc(0),
    operation: 'update_account',
    params: {
      key: 'followings',
      value: val
    },
    signature: new Buffer(64)
  };
  return tx;
};

var calcBalance = async (account) => {
  var result = await axios('https://' + server + '.forest.network/tx_search?query=%22account=%27' + account + '%27%22');
  const res = result.data;
  var balance = 0;    //so du ban dau
  res.result.txs.map((tx) => {
    let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
    if (one_transaction['operation'] == 'payment') {
      //neu la account duoc nhan thi cong tien
      if (one_transaction.params.address == account) {
        balance += one_transaction.params.amount;
      }
      else {
        balance -= one_transaction.params.amount;
      }
    }
  });
  return balance;
}

var postPlainText = async (text, sequence, keys = []) => {
  const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
  ]);
  var ct = PlainTextContent.encode({ type: 1, text: text });
  var tx = {
    version: 1,
    account: new Buffer(35),
    sequence: sequence,
    memo: Buffer.alloc(0),
    operation: 'post',
    params: {
      content: ct,
      keys: keys
    },
    signature: new Buffer(64)
  };
  return tx;
}

var doReact = async (reaction, object, sequence) => {
  const ReactContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'reaction', type: vstruct.UInt8 },
  ]);
  var ct = ReactContent.encode({ type: 2, reaction: reaction });
  var tx = {
    version: 1,
    account: new Buffer(35),
    sequence: sequence,
    memo: Buffer.alloc(0),
    operation: 'interact',
    params: {
      object: object,
      content: ct
    },
    signature: new Buffer(64)
  };
  return tx;
}
var doComment = async (text, object, sequence) => {
  const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
  ]);
  var ct = PlainTextContent.encode({ type: 1, text: text });
  var tx = {
    version: 1,
    account: new Buffer(35),
    sequence: sequence,
    memo: Buffer.alloc(0),
    operation: 'interact',
    params: {
      object: object,
      content: ct
    },
    signature: new Buffer(64)
  };
  return tx;
}

var doTransaction = async (tx, secret_key) => {
  console.log('do transaction');
  if (tx === false)
    return false;

  sign(tx, secret_key);

  const txs = '0x' + encode(tx).toString('hex');
  const res = await axios('https://' + server + '.forest.network/broadcast_tx_commit?tx=' + txs);
  return res;
};

export { sendMoney, updateName, updatePicture, getFollowings, getPosts, getNewFeed, follow, unFollow, calcBalance, doTransaction, getInfoFollowings, postPlainText, getFullInfo, doComment, doReact, getPaymentHistoryAndInfo, getTimeBlock };