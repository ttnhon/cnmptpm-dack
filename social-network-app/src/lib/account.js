const { Keypair } = require('stellar-base');
const base32 = require('base32.js');


export var checkLogged = () =>{
    const isLogged = localStorage.getItem('isLogged');
    
    if(isLogged != null && isLogged == 'true')
    {
        var secret_key_hash = localStorage.getItem('secretKeyHash');
        //var secret_key = base32.decode(secret_key_hash).toString();
        var secret_key = secret_key_hash;
        
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


export var login = (secret_key) =>{
    localStorage.setItem('isLogged', true);
    //var hash_sk = base32.encode('SCT6K7L36EXTK5T3L5PKYTY4YBVGS5ZEETGG7HFB7KV2BPOERKBZQI76');
    localStorage.setItem('secretKeyHash', secret_key);
    console.log('da thuc hien chuc nang luu localstorage');
    console.log(localStorage.getItem('secretKeyHash'));
};

export var logout = (secret_key_hash) =>{
    localStorage.clear();
};
