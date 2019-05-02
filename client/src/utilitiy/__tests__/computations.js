/**
 * @jest-environment node
 */
import axios from 'axios';
import { getPips, getUSDPairPrices, getDollarsPerPip } from '../fxcomputations';

let fxData;
const getfxdata = async () => {
  fxData = await axios.get('http://localhost:5000/api/getraw');
};

beforeAll(() => getfxdata());

it('gets pip value', () => {
  expect(getPips('EURUSD', 0.012)).toEqual(120);
  expect(getPips('USDJPY', 0.12)).toEqual(12);
});

it('gets USD base Prices', () => {
  const usdPrices = getUSDPairPrices(fxData.data.lastPrices);
  const usdPairs = Object.keys(usdPrices);
  expect(usdPairs).toHaveLength(7);
  expect(usdPrices).toHaveProperty('EURUSD', expect.any(Number));
  expect(usdPrices).toHaveProperty('USDJPY', expect.any(Number));
  expect(usdPrices).toHaveProperty('NZDUSD', expect.any(Number));
  expect(usdPrices).toHaveProperty('GBPUSD', expect.any(Number));
  expect(usdPrices).toHaveProperty('AUDUSD', expect.any(Number));
  expect(usdPrices).toHaveProperty('USDCHF', expect.any(Number));
  expect(usdPrices).toHaveProperty('USDCAD', expect.any(Number));
});

it('gets USD value of Pip', () => {
  expect(getDollarsPerPip('EURUSD', fxData.data.lastPrices)).toEqual(10);
});
export default undefined;
