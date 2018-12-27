const { Keypair } = require('stellar-base');
const base32 = require('base32.js');
const CryptoJS = require("crypto-js");


export var checkLogged = () =>{
    const isLogged = localStorage.getItem('isLogged');
    
    if(isLogged != null && isLogged == 'true')
    {
        var secret_key_hash = localStorage.getItem('secretKeyHash');
        //var secret_key = base32.decode(secret_key_hash).toString();
        var bytes  = CryptoJS.AES.decrypt(secret_key_hash.toString(), '1512389_1512402_1512405');
        var secret_key = bytes.toString(CryptoJS.enc.Utf8);
        
        try {
            const key = Keypair.fromSecret(secret_key);
            return key;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    return false;
};

export var getSecretKeyHash = () =>{
    var secret_key_hash = localStorage.getItem('secretKeyHash');
    return secret_key_hash;
};

export var setItemLocal = (name, item) =>{
    //var hash = CryptoJS.AES.encrypt(secret_key, '1512389_1512402_1512405');
    //var hash_sk = base32.encode('SCT6K7L36EXTK5T3L5PKYTY4YBVGS5ZEETGG7HFB7KV2BPOERKBZQI76');
    localStorage.setItem(name, item);
};

export var getItemLocal = (name) =>{
    //var hash = CryptoJS.AES.encrypt(secret_key, '1512389_1512402_1512405');
    //var hash_sk = base32.encode('SCT6K7L36EXTK5T3L5PKYTY4YBVGS5ZEETGG7HFB7KV2BPOERKBZQI76');
    return localStorage.getItem(name);
};

export var login = (secret_key) =>{
    localStorage.setItem('isLogged', true);
    localStorage.setItem('isLoadNotification', false);
    var hash = CryptoJS.AES.encrypt(secret_key, '1512389_1512402_1512405');
    //var hash_sk = base32.encode('SCT6K7L36EXTK5T3L5PKYTY4YBVGS5ZEETGG7HFB7KV2BPOERKBZQI76');
    localStorage.setItem('secretKeyHash', hash);
    console.log('da thuc hien chuc nang luu localstorage');
    console.log(localStorage.getItem('secretKeyHash'));
};

export var logout = (secret_key_hash) =>{
    localStorage.clear();
};
