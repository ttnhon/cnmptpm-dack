const base32 = require('base32.js');
const axios = require('axios');


var sendMoney = async(public_key, secret_key, receiver_account,sequence, amount = 100, memo = '') =>{
  var tx = {
   version:1,
   operation: 'payment',
   params:{
     address: receiver_account,
     amount: amount
   },
   account: public_key,
   sequence: sequence,
   memo:  Buffer.alloc(0), //Buffer.alloc(0),
   signature: new Buffer(64)
 };
 sign(tx,secret_key);
 const txs = '0x' + encode(tx).toString('hex');
 return await txs;
};

//return public_key and name
var getFollowings = async(account) =>{
 var arr_following = [];
 var result = await axios('https://komodo.forest.network/tx_search?query=%22account=%27'+account+'%27%22');
 const res = result.data;
 console.log('thuc hien get following');
   
 res.result.txs.map((tx) => {
   one_transaction = decode(Buffer.from(tx.tx, 'base64'));
   if(one_transaction.operation == 'update_account' && one_transaction.params.name == 'followings')
   {
      let public_key = base32.encode(Followings.decode(one_transaction.params.value).addresses);
      let name = await getName(public_key);
      let one_following = {
        name: name,
        public_key: public_key
      };
       arr_following = arr_following.concat(one_following);
   }
 });

 return arr_following;
};

var getName = async(account) =>{
  var name = 'Unknown Person';
  var result = await axios('https://komodo.forest.network/tx_search?query=%22account=%27'+account+'%27%22');
  const res = result.data;

  res.result.txs.map((tx) => {
    one_transaction = decode(Buffer.from(tx.tx, 'base64'));
    if(one_transaction.operation == 'update_account' && one_transaction.params.key == 'name')
    {
      name = one_transaction.params.value;
    }
  });

  return name;

}

var getPosts = async(account) =>{
  var result = await axios('https://komodo.forest.network/tx_search?query=%22account=%27'+account.public_key+'%27%22');
  const res = result.data;
  console.log('thuc hien get post');
  var list_post = [];
  res.result.txs.map((tx) => {
    one_transaction = decode(Buffer.from(tx.tx, 'base64'));
    if(one_transaction.operation == 'post')
    {
      let one_post = PlainTextContent.decode(one_transaction.params.content);
      one_post['name'] = account.name;
      one_post['height'] = tx.height;
      list_post = list_post.concat(one_post);
    }
  });
  return list_post;
};

var getNewFeed = async(account) => {
   const followings = await getFollowings(account);
   if(followings.height <= 0)
   return false;

   var all_posts = [];
   await followings.map(async(one_account) => {
     let posts = await getPosts(one_account);
     all_posts = all_posts.concat(posts);
   });
   all_posts.sort(function(a, b){return b.height - a.height});
   return all_posts;
};

/* Update account FOLLOWINGS Transaction */
var follow = async(my_account, account, sequence) => {
 console.log('thuc hien follow');
 const Followings = vstruct([
   { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
 ]);
 var arr_following = await getFollowings(my_account);
 var add_account = Buffer.from(base32.decode(account));
 arr_following.map(one_following =>{
   one_following = Buffer.from(base32.decode(one_following))
 });

 //cap nhat danh sach following
 if(arr_following.indexOf(add_account) != -1)
   return false;
 arr_following = arr_following.concat(add_account);

 var val = Followings.encode({addresses: arr_following});

 //tao transaction
 var buff = Followings.decode(val).addresses;
 var tx = {
   version: 1,
   account: new Buffer(35),
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

var unFollow = (my_account, account, sequence) => {
   console.log('thuc hien unfollow');
   const Followings = vstruct([
     { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
   ]);
   var arr_following = await getFollowings(my_account);
   var remove_account = Buffer.from(base32.decode(account));
   arr_following.map(one_following =>{
     one_following = Buffer.from(base32.decode(one_following))
   });
   //cap nhat danh sach following
   let index_account = arr_following.indexOf(remove_account);
   if(index_account == -1)
     return false;
   arr_following.splice(index_account, 1);

   var val = Followings.encode({addresses: arr_following});

   //tao transaction
   var buff = Followings.decode(val).addresses;
   console.log(buff.length);
   console.log(base32.encode(buff[0]));
   var tx = {
     version: 1,
     account: new Buffer(35),
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

var calcBalance = async(account) => {
 var result = await axios('https://komodo.forest.network/tx_search?query=%22account=%27'+account+'%27%22');
 const res = result.data;
 var balance = 0;    //so du ban dau
 res.result.txs.map((tx) => {
   let one_transaction = decode(Buffer.from(tx.tx, 'base64'));
   if (one_transaction['operation'] == 'payment')
   {
     //neu la account duoc nhan thi cong tien
     if(one_transaction.params.address == account)
     {
       balance += one_transaction.params.amount;
     }
     else
     {
       balance -= one_transaction.params.amount;
     }
   }
 });
 return sent_money;
}
var doTransaction = async(tx, secret_key) => {
 console.log('do transaction');
 if(tx === false)
   return false;
 sign(tx,secret_key);
 const txs = '0x' + encode(tx).toString('hex');
 const res = await axios('https://komodo.forest.network/broadcast_tx_commit?tx='+txs)
 return res;
};
module.exports = {sendMoney, getFollowings, getPosts, getNewFeed, follow, unFollow, calcBalance, doTransaction};