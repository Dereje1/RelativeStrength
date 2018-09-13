import axios from 'axios';

export const symbolList = [
  'GBPNZD', 'GBPAUD', 'GBPCHF', 'GBPUSD', 'GBPCAD', 'EURUSD', 'GBPJPY',
  'EURNZD', 'USDCHF', 'EURJPY', 'EURAUD', 'EURCAD', 'CHFJPY', 'USDCAD',
  'NZDUSD', 'EURGBP', 'AUDUSD', 'NZDCHF', 'AUDCHF', 'CADCHF', 'EURCHF',
  'NZDJPY', 'AUDJPY', 'NZDCAD', 'CADJPY', 'AUDCAD', 'USDJPY', 'AUDNZD'];

/*
Api coomands
*/
export const postNewTrade = async (entry) => {
  await axios.post('/api/newtrade', entry).then((response) => {
    console.log(response.data, 'data succesfully posted!!');
  })
    .catch((e) => {
      console.log(e, 'error with this request!!');
    });
};

export const getOpenTrades = () =>
  axios.get('/api/getopentrades')
    .then(response => (response.data))
    .catch(error => error);

// end api commands

export const getPips = (symb, change) => {
  if (symb.indexOf('JPY') === 3) return (Math.round(change / 0.01));
  return (Math.round(change / 0.0001));
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

export const findGain = (symb, long, costBasis, avSize, allPairPrices) => {
  const lastPrice = allPairPrices[symb];
  const pipGain = getPips(symb, long ? (lastPrice - costBasis) : (costBasis - lastPrice));
  const dollarGain = Math.round(pipGain
     * getDollarsPerPip(symb, allPairPrices)
     * (avSize / 100000));
  return {
    pips: pipGain,
    dollars: dollarGain,
    profit: dollarGain > 0,
  };
};

export const openTradesCummulative = (opentrades, allPairPrices) => {
  const cummulative = opentrades.reduce((accum, current) => {
    const accumCopy = { ...accum }; // because of no assign-param eslint rule
    accumCopy.totalPips += findGain(
      current.symbol,
      current.long,
      current.entry[0].price,
      current.entry[0].size,
      allPairPrices,
    ).pips;
    accumCopy.totalDollars += findGain(
      current.symbol,
      current.long,
      current.entry[0].price,
      current.entry[0].size,
      allPairPrices,
    ).dollars;

    const openRisk = current.long ?
      current.entry[0].price - current.stop
      :
      current.stop - current.entry[0].price;

    const openRiskPips = openRisk > 0 ? getPips(current.symbol, openRisk) : 0;
    const openRiskDollars = openRisk > 0 ?
      getDollarsPerPip(current.symbol, allPairPrices) *
      openRiskPips * (current.entry[0].size / 100000) : 0;

    accumCopy.openRiskPips += openRiskPips;
    accumCopy.openRiskDollars += openRiskDollars;
    return accumCopy;
  }, {
    totalPips: 0,
    totalDollars: 0,
    openRiskPips: 0,
    openRiskDollars: 0,
  });
  return cummulative;
};
