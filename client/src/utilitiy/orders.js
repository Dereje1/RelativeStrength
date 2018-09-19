import axios from 'axios';

export const symbolList = [
  'GBPNZD', 'GBPAUD', 'GBPCHF', 'GBPUSD', 'GBPCAD', 'EURUSD', 'GBPJPY',
  'EURNZD', 'USDCHF', 'EURJPY', 'EURAUD', 'EURCAD', 'CHFJPY', 'USDCAD',
  'NZDUSD', 'EURGBP', 'AUDUSD', 'NZDCHF', 'AUDCHF', 'CADCHF', 'EURCHF',
  'NZDJPY', 'AUDJPY', 'NZDCAD', 'CADJPY', 'AUDCAD', 'USDJPY', 'AUDNZD'];

/*
Api coomands
*/
export const postNewTrade = entry =>
  axios.post('/api/newtrade', entry)
    .then(response => response.data)
    .catch(error => error);

export const getOpenTrades = () =>
  axios.get('/api/getopentrades')
    .then(response => response.data)
    .catch(error => error);

export const getClosedTrades = () =>
  axios.get('/api/getclosedtrades')
    .then(response => response.data)
    .catch(error => error);

export const setStop = newStop =>
  axios.put('/api/movestop', newStop)
    .then(response => response.data)
    .catch(error => error);

export const closeTrade = exitInfo =>
  axios.put('/api/closetrade', exitInfo)
    .then(response => response.data)
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

  return symb.indexOf('JPY') === -1 ? (multiplier * 10) : (multiplier * 1000);
};

export const findGain = (symb, long, costBasis, avSize, allPairPrices, closed = false) => {
  const lastPrice = !closed ? allPairPrices[symb] : closed.closePrice;
  const pipGain = getPips(symb, long ? (lastPrice - costBasis) : (costBasis - lastPrice));
  const dollarGain = Math.round(pipGain
     * (!closed ? getDollarsPerPip(symb, allPairPrices) : closed.closedPipVal)
     * (avSize / 100000));
  return {
    pips: pipGain,
    dollars: dollarGain,
    profit: dollarGain > 0,
  };
};

export const getProfits = (opentrades, allPairPrices, closed = false) => {
  const cummulative = opentrades.reduce((accum, current) => {
    const accumCopy = { ...accum }; // because of no assign-param eslint rule
    accumCopy.totalPips += findGain(
      current.symbol,
      current.long,
      current.entry[0].price,
      current.entry[0].size,
      allPairPrices,
      !closed ? false :
        { closePrice: current.exit[0].price, closedPipVal: current.exit[0].pipValue },
    ).pips;
    accumCopy.totalDollars += findGain(
      current.symbol,
      current.long,
      current.entry[0].price,
      current.entry[0].size,
      allPairPrices,
      !closed ? false :
        { closePrice: current.exit[0].price, closedPipVal: current.exit[0].pipValue },
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
    accumCopy.openRiskDollars += Math.ceil(openRiskDollars);
    return accumCopy;
  }, {
    totalPips: 0,
    totalDollars: 0,
    openRiskPips: 0,
    openRiskDollars: 0,
  });
  return cummulative;
};
