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

export const getPips = (symb, change) => {
  if (symb.indexOf('JPY') === 3) return Math.abs(Math.round(change / 0.01));
  return Math.abs(Math.round(change / 0.0001));
};

const getUSDPairPrices = (allPairPrices) => {
  const USDPairs = ['AUDUSD', 'EURUSD', 'USDJPY', 'GBPUSD', 'USDCAD', 'NZDUSD', 'USDCHF'];
  const USDPairPrices = {};
  USDPairs.forEach((USD) => {
    USDPairPrices[USD] = allPairPrices[USD];
  });
  return USDPairPrices;
};

export const getDollarsPerPip = (symb, allPairPrices) => {
  let multiplier;
  const usdPairs = getUSDPairPrices(allPairPrices);
  const baseSymbol = symb.slice(3);
  const baseAgainstUSD = Object.keys(usdPairs).filter(u => u.indexOf(baseSymbol) !== -1);

  if (baseAgainstUSD.length > 1) multiplier = 1;
  else if (baseAgainstUSD[0].indexOf('USD') === 3) multiplier = (usdPairs[baseAgainstUSD[0]]);
  else multiplier = (1 / usdPairs[baseAgainstUSD[0]]);

  return symb.indexOf('JPY') === -1 ? Math.ceil(multiplier * 10) : Math.ceil(multiplier * 1000);
};
