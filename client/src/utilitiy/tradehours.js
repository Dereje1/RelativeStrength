import moment from 'moment';

const tradeHours = {
  NEWYORK: [12, 20],
  LONDON: [7, 15],
  SYDNEY: [22, 6],
  TOKYO: [23, 7],
};

const getForexHours = () => {
  const currentGMThour = moment().utc().hour();
  const currentGMTday = moment().utc().day();
  const centerStatus = {
    NEWYORK: 'closed',
    LONDON: 'closed',
    SYDNEY: 'closed',
    TOKYO: 'closed',
  };

  if (currentGMTday === 6) return centerStatus;
  if ((currentGMTday === 5) && (currentGMThour >= tradeHours.NEWYORK[1])) return centerStatus;
  if ((currentGMTday === 0) && (currentGMThour < tradeHours.SYDNEY[0])) return centerStatus;

  Object.keys(tradeHours).forEach((c) => {
    const zoneType = tradeHours[c][0] < tradeHours[c][1];
    if (zoneType) {
      const status = (currentGMThour >= tradeHours[c][0]) && (currentGMThour < tradeHours[c][1]);
      if (status) centerStatus[c] = 'open';
    } else if (currentGMThour >= 0 && currentGMThour <= 12) {
      const status = currentGMThour < tradeHours[c][1];
      if (status) centerStatus[c] = 'open';
    } else {
      const status = currentGMThour >= tradeHours[c][0];
      if (status) centerStatus[c] = 'open';
    }
  });
  return centerStatus;
};

export default getForexHours;
