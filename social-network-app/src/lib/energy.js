import server from './server';
const axios = require('axios');
const moment = require('moment');

const BANDWIDTH_PERIOD = 86400;
const MAX_BLOCK_SIZE = 22020096;
const RESERVE_RATIO = 1;
const MAX_CELLULOSE = Number.MAX_SAFE_INTEGER;
const NETWORK_BANDWIDTH = RESERVE_RATIO * MAX_BLOCK_SIZE * BANDWIDTH_PERIOD;

//Tinh nang luong toi da
var getBandwidthLimit = (balance) => {
	return balance / MAX_CELLULOSE * NETWORK_BANDWIDTH;
} 

var getMaxPage = async (acc) => {
  var result = await axios('https://'+server+'.forest.network/tx_search?query=%22account=%27'+acc+'%27%22');
  const res = result.data;
  if(res.result.total_count === 0)
  	return 0;
  var total = res.result.total_count;
  var round = Math.round(total/30);
  var div = Math.floor(total/30);
  var max_page = (div===round)? div+1 : round ;
  return max_page;
}
var getBlockInfo = async (height) => {
	if(height < 1)
		return undefined;
  var result = await axios('https://'+server+'.forest.network/block?height='+height);
  return result.data;
}
var getHeight = async (acc) => {
  var h=0;
  return await getMaxPage().then(async (max) => {
    var result = await axios('https://'+server+'.forest.network/tx_search?query=%22account=%27'+acc+'%27%22&page='+max);
    const res = result.data;
    if(res.result.total_count === 0)
  		return 0;
    var a = res.result.txs.slice(0).reverse().map((tx) => {
      var t = decode(Buffer.from(tx.tx, 'base64'));
      var height = tx.height;
      if(t.account===acc) {
        return height;
      }
    });
    return a[0];
  })
}

var getUsedEnergy = (tx) => {
	return tx.length/4*3;
}
export { getBandwidthLimit, getHeight, getMaxPage, getBlockInfo, getUsedEnergy }