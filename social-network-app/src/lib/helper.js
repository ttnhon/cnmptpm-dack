import { encode, decode, verify, sign, hash } from './index';
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
    account: public_key,
    sequence: sequence,
    memo: Buffer.alloc(0), //Buffer.alloc(0),
    signature: new Buffer(64)
  };
  sign(tx, secret_key);
  const txs = '0x' + encode(tx).toString('hex');
  return await txs;
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
  const res = await axios('https://komodo.forest.network/broadcast_tx_commit?tx=' + txs);
  return res;
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

  sign(tx,secret_key);
  var param = encode(tx).toString('base64');
  var header = {
      'Content-Type': 'application/json-rpc',
  }

  let options = {
      url: "https://komodo.forest.network/",
      method: "post",
      headers: header,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'broadcast_tx_commit',
        params: [param],
        id: 1
      })
  };

  await request(options, (error, response, body) => {
      if (error) {
          console.error('An error has occurred: ', error);
      } else {
          console.log('Post successful: response: ', body);
      }
  });

}

var getName = async (account) => {
  var name = 'No Name';
  var result = await axios('https://komodo.forest.network/tx_search?query=%22account=%27' + account + '%27%22');
  const res = result.data;

  res.result.txs.slice(0).reverse().map((tx) => {
    let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
    if (one_transaction.operation == 'update_account' && one_transaction.params.key == 'name') {
      return one_transaction.params.value;
    }
  });

  return name;

}

var getFollowings = async (account, page = 1, arr_following = []) => {
  const Followings = vstruct([
    { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
  ]);
  var result = await axios('https://komodo.forest.network/tx_search?query="account=\'' + account + '\'"&page="'+page+'"');
  const res = result.data;
  console.log('thuc hien get following');

  res.result.txs.map((tx) => {
    let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
    if (one_transaction.operation == 'update_account' && one_transaction.params.key == 'followings') {
      arr_following = Followings.decode(one_transaction.params.value).addresses;
    }
  });
  
  if (arr_following.length > 0) {
    arr_following = arr_following.map(value => (base32.encode(value)));
  }

  if(page * 30 >= res.result.total_count)
      return arr_following;
  return getFollowings(account, ++page, arr_following);
  
};

var getFullInfo = async (account, page = 1, info = []) => {
  var result = await axios('https://komodo.forest.network/tx_search?query="account=\'' + account + '\'"&page="'+page+'"');
  const res = result.data;
  console.log('thuc hien get fullinfo');

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

  if(page * 30 >= res.result.total_count)
  {
    info['account'] = account;
    info['name'] = info['name']? info['name']: 'No Name';
    info['img_url'] = info['img_url']? 
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


var getPosts = async (account, info, page = 1, list_post = []) => {
  const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
  ]);
  var result = await axios('https://komodo.forest.network/tx_search?query="account=\'' + account + '\'"&page="'+page+'"');
  const res = result.data;
  console.log('thuc hien get post');
  // var name = 'No name';
  // res.result.txs.map((tx) => {
  //   let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
  //   if (one_transaction.operation == 'update_account' && one_transaction.params.key == 'name') {
  //     name = one_transaction.params.value.toString('utf-8');
  //   }
  // });
  res.result.txs.map((tx) => {
    let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
    if (one_transaction.operation == 'post') {
      let one_post = [];
      one_post['name'] = info['name'];
      one_post['img_url'] = info['img_url'];
      one_post['account'] = account;
      one_post['content'] = PlainTextContent.decode(one_transaction.params.content);
      one_post['height'] = tx.height;

      list_post.push(one_post);
    }
  });

  if(page * 30 >= res.result.total_count)
      return list_post;
  return getPosts(account, info, ++page, list_post);
};

var getNewFeed = async (account) => {
  const followings = await getFollowings(account);
  if (followings.height <= 0)
    return false;

  var all_posts = [];
  await Promise.all(followings.map(async (one_account) => {
    let info = await getFullInfo(one_account);
    let posts = await getPosts(one_account, info);
    if (posts.length > 0) {
      posts.map(one_post => {
        all_posts.push(one_post);
      })
    }
  }));
  //get user post
  let info_user = await getFullInfo(account);
  let User_posts = await getPosts(account, info_user);
  if (User_posts.length > 0) {
    User_posts.map(one_post => {
      all_posts.push(one_post);
    })
  }
  all_posts.sort(function(a, b){return b.height - a.height});
  return all_posts;
};

/* Update account FOLLOWINGS Transaction */
var follow = async (my_account, add_account, sequence) => {
  console.log('thuc hien follow');
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
  console.log('thuc hien unfollow');
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
  var result = await axios('https://komodo.forest.network/tx_search?query=%22account=%27' + account + '%27%22');
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

var postPlainText = async(text, sequence, keys = []) =>{
  const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
  ]);
  var ct = PlainTextContent.encode({type: 1, text: text});
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

var doReact = async(reaction, object, sequence) => {
  const ReactContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'reaction', type: vstruct.UInt8 },
  ]);
  var ct = ReactContent.encode({type: 2, reaction: reaction});
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
var doComment = async(text, object, sequence) => {
  const PlainTextContent = vstruct([
    { name: 'type', type: vstruct.UInt8 },
    { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
  ]);
  var ct = PlainTextContent.encode({type:1, text: text});
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
  const res = await axios('https://komodo.forest.network/broadcast_tx_commit?tx=' + txs);
  return res;
};

<<<<<<< HEAD

export { sendMoney, updateName, updatePicture, getFollowings, getPosts, getNewFeed, follow, unFollow, calcBalance, doTransaction, getInfoFollowings, postPlainText, getFullInfo, doComment, doReact };
=======
export { sendMoney, updateName, getFollowings, getPosts, getNewFeed, follow, unFollow, calcBalance, doTransaction, getInfoFollowings, postPlainText, getFullInfo, doComment, doReact };
>>>>>>> a0a2b752f328612ed63615d4b9be4dda4d20725f
