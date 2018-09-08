import axios from 'axios';

export const symbolList = [
  'GBPNZD', 'GBPAUD', 'GBPCHF', 'GBPUSD', 'GBPCAD', 'EURUSD', 'GBPJPY',
  'EURNZD', 'USDCHF', 'EURJPY', 'EURAUD', 'EURCAD', 'CHFJPY', 'USDCAD',
  'NZDUSD', 'EURGBP', 'AUDUSD', 'NZDCHF', 'AUDCHF', 'CADCHF', 'EURCHF',
  'NZDJPY', 'AUDJPY', 'NZDCAD', 'CADJPY', 'AUDCAD', 'USDJPY', 'AUDNZD'];

export const postNewTrade = async (entry) => {
  await axios.post('/api/newtrade', entry).then((response) => {
    console.log(response.data, 'data succesfully posted!!');
  })
    .catch((e) => {
      console.log(e, 'error with this request!!');
    });
};

