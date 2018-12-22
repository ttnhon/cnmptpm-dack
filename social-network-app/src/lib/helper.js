import { encode, decode, verify, sign, hash } from './index';

var sendMoney = async(public_key, secret_key, receiver_account, amount = 100, memo = '') =>{
    var tx = {
     version:1,
     operation: 'payment',
     params:{
       address: receiver_account,
       amount: amount
     },
     account: public_key,
     sequence: 2,
     memo:  Buffer.alloc(0), //Buffer.alloc(0),
     signature: new Buffer(64)
   };
   sign(tx,secret_key);
   const txs = '0x' + encode(tx).toString('hex');
   return await txs;
 };
 
 
 var getFollowings = async(account) =>{
    fetch('https://komodo.forest.network/tx_search?query=%22account=%27'+account+'%27%22', (error, meta, body) =>{
       const res = JSON.parse(body.toString());
 
       var arr_following = [];
       res.result.txs.map((tx) => {
         one_transaction = decode(Buffer.from(tx.tx, 'base64'));
         if(one_transaction.operation == 'update_account' && one_transaction.params.name == 'followings')
         {
             arr_following = Followings.decode(one_transaction.params.value).addresses;
         }
       });
 
       if(arr_following.length > 0)
       {
         arr_following =  arr_following.map(value => ( base32.encode(value) ));
       }
       return await arr_following;
     });
 };
 
 var getPosts = async(account) =>{
    fetch('https://komodo.forest.network/tx_search?query=%22account=%27'+account+'%27%22', function(error, meta, body){
      const res = JSON.parse(body.toString());
      var list_post = [];
      res.result.txs.map((tx) => {
        one_transaction = decode(Buffer.from(tx.tx, 'base64'));
        if(one_transaction.operation == 'post')
        {
          let one_post = PlainTextContent.decode(one_transaction.params.content);
          one_post['height'] = tx.height;
          list_post = list_post.concat(one_post);
        }
      });
      return await list_post;
   });
 };
 
 var getNewFeed = async(account) => {
     const followings = await getFollowings(account);
     if(followings.height <= 0)
     return false;
 
     var all_posts = [];
     await followings.map(one_account => {
       let posts = await getPosts(one_account);
       all_posts = all_posts.concat(posts);
     });
 
     return all_posts;
 };
 
 /* Update account FOLLOWINGS Transaction */
 var follow = (my_account, account) => {
   const Followings = vstruct([
     { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
   ]);
   getFollowings(my_account)
   .then(arr_following => {
 
     var add_account = Buffer.from(base32.decode(account));
     arr_following.map(one_following =>{
       one_following = Buffer.from(base32.decode(one_following))
     });
 
     //cap nhat danh sach following
     if(arr_following.indexOf(add_account) != -1)
       return -1;
    arr_following = arr_following.concat(add_account);
 
     var val = Followings.encode({addresses: arr_following});
 
     //tao transaction
     var buff = Followings.decode(val).addresses;
     var tx = {
       version: 1,
       account: new Buffer(35),
       sequence: 5,
       memo: Buffer.alloc(0),
       operation: 'update_account',
       params: {
         key: 'followings',
         value: val
       },
       signature: new Buffer(64)
     };
     return tx;
   })
 }
 
 var unFollow = (my_account, account) => {
   const Followings = vstruct([
     { name: 'addresses', type: vstruct.VarArray(vstruct.UInt16BE, vstruct.Buffer(35)) },
   ]);
   getFollowings(my_account)
   .then(arr_following => {
 
     var add_account = Buffer.from(base32.decode(account));
     arr_following.map(one_following =>{
       one_following = Buffer.from(base32.decode(one_following))
     });
     //cap nhat danh sach following
     let index_account = arr_following.indexOf(add_account);
     if(index_account == -1)
       return -1;
     arr_following.splice(index_account, 1);
 
     var val = Followings.encode({addresses: arr_following});
 
     //tao transaction
     var buff = Followings.decode(val).addresses;
     console.log(buff.length);
     console.log(base32.encode(buff[0]));
     var tx = {
       version: 1,
       account: new Buffer(35),
       sequence: 5,
       memo: Buffer.alloc(0),
       operation: 'update_account',
       params: {
         key: 'followings',
         value: val
       },
       signature: new Buffer(64)
     };
     return tx;
   })
 };
 
 var calcBalance = async(account) => {
   fetch('https://komodo.forest.network/tx_search?query=%22account=%27'+account+'%27%22', function(error, meta, body){
     const res = JSON.parse(body.toString());
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
       return await sent_money;
     });
 }
 var doTransaction = (tx, secret_key) => {
   sign(tx,secret_key);
   const txs = '0x' + encode(tx).toString('hex');
 
   fetch('https://komodo.forest.network/broadcast_tx_commit?tx='+txs, function(error, meta, body){
     const res = JSON.parse(body.toString());
     return res;
   });
 };

 export {sendMoney, getFollowings, getPosts, getNewFeed, follow, unFollow, calcBalance, doTransaction}