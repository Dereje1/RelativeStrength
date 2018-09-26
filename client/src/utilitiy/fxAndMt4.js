import moment from 'moment';

export const mt4LastPush = (lastUpdate) => {
  // returns the number of seconds since last update
  const gmtUpdateTime = moment.utc(lastUpdate, 'YYYY.MM.DD h:mm:ss');
  const elapsedSinceUpdate = gmtUpdateTime.diff(moment.utc()) / 1000;
  return Math.floor(elapsedSinceUpdate);
};

export const filterEvents = (events) => {
  // filters high impact events from forex factory
  const fEvents = (events).filter((e) => {
    const gmtDateTime = moment(e.date);// ff event data comes in gmt
    const elapsed = gmtDateTime.diff(moment.utc()); // if elapsed < 0 , event has already occured.
    return (elapsed > 0 && e.impact === 'High'); // filter high impact events that have not occured yet
  });
  return (fEvents);
};

export const getForexHours = () => {
  // returns the open forex trading centers
  const tradeHours = {
    NEWYORK: [12, 21], LONDON: [7, 16], SYDNEY: [21, 6], TOKYO: [0, 8],
  };
  const currentGMThour = moment().utc().hour();
  const currentGMTday = moment().utc().day();
  const centerStatus = {
    NEWYORK: 'closed',
    LONDON: 'closed',
    SYDNEY: 'closed',
    TOKYO: 'closed',
  };

  if (currentGMTday === 6) return centerStatus; // Saturday
  // Friday After close
  if ((currentGMTday === 5) && (currentGMThour >= tradeHours.NEWYORK[1])) return centerStatus;
  // Sunday before open
  if ((currentGMTday === 0) && (currentGMThour < tradeHours.SYDNEY[0])) return centerStatus;
  // loop thru trade centers and find the open ones.
  Object.keys(tradeHours).forEach((c) => {
    const beforeMidnight = tradeHours[c][0] < tradeHours[c][1];
    if (beforeMidnight) {
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
