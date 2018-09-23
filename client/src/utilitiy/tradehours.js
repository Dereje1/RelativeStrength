import moment from 'moment';

const tradeHours = {
  NEWYORK: [12, 20],
  LONDON: [7, 15],
  SYDNEY: [22, 6],
  TOKYO: [23, 7],
};

const getForexHours = (center) => {
  const currentGMThour = moment().utc().hour();
  const currentGMTday = moment().utc().day();

  if (currentGMTday === 6) return 'closed';
  if ((currentGMTday === 5) && (currentGMThour >= tradeHours.NEWYORK[1])) return 'closed';
  if ((currentGMTday === 0) && (currentGMThour < tradeHours.SYDNEY[0])) return 'closed';
  const openCenters = Object.keys(tradeHours).filter((c) => {
    const zoneType = tradeHours[c][0] < tradeHours[c][1];
    if (zoneType) {
      return (currentGMThour >= tradeHours[c][0]) && (currentGMThour < tradeHours[c][1]);
    }
    if (currentGMThour >= 0 && currentGMThour <= 12) return currentGMThour < tradeHours[c][1];
    return currentGMThour >= tradeHours[c][0];
  });
  return openCenters.includes(center) ? 'open' : 'closed';
};

export default getForexHours;
