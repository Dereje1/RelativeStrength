import moment from 'moment'; // neeed for time conversion

export const mt4LastPush = (lastUpdate) => { // returns the number of seconds since last update
  // mt4 time stamps with gmt
  const gmtUpdateTime = moment.utc(lastUpdate, 'YYYY.MM.DD h:mm:ss');
  // elapsed time in secs since update
  const elapsedSinceUpdate = gmtUpdateTime.diff(moment.utc()) / 1000;
  return Math.floor(elapsedSinceUpdate);
};

export const filterEvents = (events) => { // filters high impact events from forex factory
  const fEvents = (events).filter((e) => {
    const eDay = e.date[0];
    const eTime = e.time[0];
    const when = `${eDay},${eTime}`;
    const gmtDateTime = moment.utc(when, 'MM-DD-YYYY,h:mmA');// ff event data comes in gmt
    const elapsed = gmtDateTime.diff(moment.utc()); // if elapsed < 0 , event has already occured.
    return (elapsed > 0 && e.impact[0] === 'High'); // filter high impact events that have not occured yet
  });
  return (fEvents);
};
