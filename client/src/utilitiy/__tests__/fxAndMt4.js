import { mt4LastPush } from '../fxAndMt4';

it('Computes the Last Update', () => {
  const mockDates = ['2018.04.23 04:12:13', '2017.04.12 04:12:13', '2016.03.23 04:12:13'];
  const deltaArr = mockDates.map((d) => {
    const timeElapsedSinceLastPush = mt4LastPush(d);
    const unixUTC = new Date(d).getTime();
    const unixCurrent = Date.now();
    const UTCoffset = new Date().getTimezoneOffset();
    const computedTimeDiff = Math.floor((unixCurrent - unixUTC + (UTCoffset * 60 * 1000)) / 1000);
    return Math.abs(computedTimeDiff + timeElapsedSinceLastPush);
  });
  // expect all differences to be less than 2 secs
  const testDiff = deltaArr.every(d => d < 2);
  expect(testDiff).toBe(true);
});

export default undefined;
