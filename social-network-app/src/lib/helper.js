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

var getName = async(account) =>{
 var name = 'No Name';
 var result = await axios('https://komodo.forest.network/tx_search?query=%22account=%27'+account+'%27%22');
 const res = result.data;

 res.result.txs.slice(0).reverse().map((tx) => {
   one_transaction = decode(Buffer.from(tx.tx, 'base64'));
   if(one_transaction.operation == 'update_account' && one_transaction.params.key == 'name')
   {
     return one_transaction.params.value;
   }
 });

 return name;

}

var getFollowings = async(account) =>{
 var arr_following = [];
 var result = await axios('https://komodo.forest.network/tx_search?query=%22account=%27'+account+'%27%22');
 const res = result.data;
 console.log('thuc hien get following');
   
 res.result.txs.map((tx) => {
   one_transaction = decode(Buffer.from(tx.tx, 'base64'));
   if(one_transaction.operation == 'update_account' && one_transaction.params.key == 'followings')
   {
       arr_following = Followings.decode(one_transaction.params.value).addresses;
   }
 });

 if(arr_following.length > 0)
 {
   arr_following =  arr_following.map(value => ( base32.encode(value) ));
 }
 return arr_following;
};

var getPosts = async(account) =>{
  var result = await axios('https://komodo.forest.network/tx_search?query=%22account=%27'+account+'%27%22');
 const res = result.data;
 console.log('thuc hien get post');
 var list_post = [];
 var name = 'No name';
 res.result.txs.map((tx) =>{
   one_transaction = decode(Buffer.from(tx.tx, 'base64'));
   if(one_transaction.operation == 'update_account' && one_transaction.params.key == 'name')
   {
     name =  one_transaction.params.value.toString('utf-8');
   }
 });
 res.result.txs.map((tx) => {
   one_transaction = decode(Buffer.from(tx.tx, 'base64'));
   if(one_transaction.operation == 'post')
   {
     let one_post = [];
     one_post['name'] = name;
     one_post['content'] = PlainTextContent.decode(one_transaction.params.content);
     one_post['height'] = tx.height;
     console.log(one_post);
     list_post = list_post.concat(one_post);
   }
 });
 return list_post;
};

var getNewFeed = async(account) => {
   const followings = await getFollowings(account);
   if(followings.height <= 0)
   return false;
   console.log(followings)
   var all_posts = [];
   Promise.all(followings.map(async(one_account) => {
     
     let posts = await getPosts(one_account);
     if(posts.length > 0)
       all_posts = all_posts.concat(posts);
   }));

   return await all_posts;
};

/* Update account FOLLOWINGS Transaction */
var follow = async(my_account, add_account, sequence) => {
 console.log('thuc hien follow');
 const Followings = vstruct([
   { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
 ]);
 var arr_following = await getFollowings(my_account);

 if(arr_following.indexOf(add_account) != -1)
   return false;

 arr_following = arr_following.concat(add_account);
 arr_following = arr_following.map(one_following =>(Buffer.from(base32.decode(one_following))));
 
 var val = Followings.encode({addresses: arr_following});
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

var unFollow = async(my_account, remove_account, sequence) => {
   console.log('thuc hien unfollow');
   const Followings = vstruct([
     { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
   ]);
   var arr_following = await getFollowings(my_account);

   //cap nhat danh sach following
   let index_account = arr_following.indexOf(remove_account);
   if(index_account == -1)
     return false;
   arr_following.splice(index_account, 1);
   arr_following = arr_following.map(one_following =>(Buffer.from(base32.decode(one_following))));
   var val = Followings.encode({addresses: arr_following});
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
 const res = await axios('https://komodo.forest.network/broadcast_tx_commit?tx='+txs);
 return res.data;
};
module.exports = {sendMoney, getFollowings, getPosts, getNewFeed, follow, unFollow, calcBalance, doTransaction};