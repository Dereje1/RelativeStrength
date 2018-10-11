export const symbolList = [
  'GBPNZD', 'GBPAUD', 'GBPCHF', 'GBPUSD', 'GBPCAD', 'EURUSD', 'GBPJPY',
  'EURNZD', 'USDCHF', 'EURJPY', 'EURAUD', 'EURCAD', 'CHFJPY', 'USDCAD',
  'NZDUSD', 'EURGBP', 'AUDUSD', 'NZDCHF', 'AUDCHF', 'CADCHF', 'EURCHF',
  'NZDJPY', 'AUDJPY', 'NZDCAD', 'CADJPY', 'AUDCAD', 'USDJPY', 'AUDNZD'];

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


export const costBasis = (tradeArr) => {
  const totalSize = tradeArr.reduce((accum, current) => accum + current.size, 0);
  const basis = tradeArr.reduce((accum, current) => accum + (current.size * current.price), 0);
  return [totalSize, basis / totalSize];
};

export const findGain = (symb, long, entryPrice, avSize, allPairPrices, closed = false) => {
  const lastPrice = !closed ? allPairPrices[symb] : closed.closePrice;
  const pipGain = getPips(symb, long ? (lastPrice - entryPrice) : (entryPrice - lastPrice));
  const dollarGain = Math.round(pipGain
     * (!closed ? getDollarsPerPip(symb, allPairPrices) : closed.closedPipVal)
     * (avSize / 100000));
  return {
    pips: pipGain,
    dollars: dollarGain,
    profit: dollarGain > 0,
  };
};

export const getProfits = (batchOfTrades, allPairPrices, closed = false) => {
  const cummulative = batchOfTrades.reduce((accum, current) => {
    const accumCopy = { ...accum }; // because of no assign-param eslint rule
    const priceInfo = costBasis(current.entry);
    const gainInPips = findGain(
      current.symbol,
      current.long,
      priceInfo[1],
      priceInfo[0],
      allPairPrices,
      !closed ? false :
        { closePrice: current.exit[0].price, closedPipVal: current.exit[0].pipValue },
    ).pips;
    const gainInDollars = findGain(
      current.symbol,
      current.long,
      priceInfo[1],
      priceInfo[0],
      allPairPrices,
      !closed ? false :
        { closePrice: current.exit[0].price, closedPipVal: current.exit[0].pipValue },
    ).dollars;

    accumCopy.totalTrades += 1;
    accumCopy.totalPips += gainInPips;
    accumCopy.totalDollars += gainInDollars;

    if (!closed) {
      const openRisk = current.long ?
        priceInfo[1] - current.stop
        :
        current.stop - priceInfo[1];

      const openRiskPips = openRisk > 0 ? getPips(current.symbol, openRisk) : 0;
      const openRiskDollars = openRisk > 0 ?
        getDollarsPerPip(current.symbol, allPairPrices) *
      openRiskPips * (priceInfo[0] / 100000) : 0;

      accumCopy.openRiskPips += openRiskPips;
      accumCopy.openRiskDollars += Math.ceil(openRiskDollars);
    } else {
      accumCopy.openRiskPips = null;
      accumCopy.openRiskDollars = null;
    }

    if (gainInDollars > 0) {
      accumCopy.numberOfGainers += 1;
      accumCopy.gainTotal += gainInDollars;
    } else {
      accumCopy.numberOfLoosers += 1;
      accumCopy.lossTotal += gainInDollars;
    }
    return accumCopy;
  }, {
    totalTrades: 0,
    totalPips: 0,
    totalDollars: 0,
    openRiskPips: 0,
    openRiskDollars: 0,
    numberOfGainers: 0,
    numberOfLoosers: 0,
    gainTotal: 0,
    lossTotal: 0,
  });
  return cummulative;
};

export const getNewRisk = (oldTrade, addPoisition, allPairPrices) => {
  // preserve previous trade
  const previousTrade = JSON.parse(JSON.stringify(oldTrade));
  // save example of an entry to modify
  const mockEntry = JSON.parse(JSON.stringify(previousTrade.entry[0]));
  // modify example with current/proposed user input
  mockEntry.date = Date.parse(addPoisition.date[0]._d);
  mockEntry.size = parseInt(addPoisition.size[0], 10);
  mockEntry.price = Number(addPoisition.price[0]);
  mockEntry.comments = String(addPoisition.comments[0]);
  // add example as a new trade entry in the netry array
  const updatedEntry = [...previousTrade.entry, ...[mockEntry]];
  // modify previous trade to simulate computations
  previousTrade.entry = updatedEntry;
  previousTrade.stop = Number(addPoisition.moveStop[0]);
  return {
    newRisk: getProfits([previousTrade], allPairPrices).openRiskDollars,
    newCostBasis: costBasis(previousTrade.entry),
  };
};
